import { Platform, PriceDescription, PriceInput } from "@/types"
import { buildRequestHeaders } from "@/lib/request"

interface ExtractedPrice {
  name: string
  basePrice: string
  currentPrice: string
  savings: number
  discount?: string
  currency: string
  description: PriceDescription
  isFree: boolean
  isTiedToSubscription: boolean
  endTime: string | null
  lowestRecentPrice: string | null
}

export async function getPlayStationGamePrice(
  url: string
): Promise<PriceInput | null> {
  try {
    const response = await fetch(url, {
      headers: buildRequestHeaders({
        kind: "scrape",
        referer: "https://store.playstation.com/"
      })
    })

    if (!response.ok) {
      throw new Error(
        `Failed to fetch PlayStation Store page: ${response.status}`
      )
    }

    const html = await response.text()
    const gamePrice = extractPrice(html)

    if (gamePrice) {
      return {
        storeUrl: url,
        countryCode: "CA",
        regularPrice: parseFloat(gamePrice.basePrice),
        currentPrice: parseFloat(gamePrice.currentPrice),
        description: gamePrice.description,
        platform: Platform.PLAYSTATION,
        externalId: null
      }
    }

    return null
  } catch (error) {
    console.error("Error fetching PlayStation game price:", error)
    return null
  }
}

export function extractPrice(html: string): ExtractedPrice | null {
  const scriptRegex =
    /<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/g
  let match

  while ((match = scriptRegex.exec(html)) !== null) {
    try {
      const json = JSON.parse(match[1])

      const cache = json?.cache
      if (!cache) continue

      // Find price data and avoid picking the PS Plus Premium upsell if there
      // is any alternative CTA price result.
      const priceEntries = Object.entries(cache).filter(
        ([key, item]: [string, any]) => key.includes("GameCTA") && item?.price
      )

      if (priceEntries.length === 0) continue

      const selectedPriceEntry =
        priceEntries.find(
          ([, item]) => !isPsPlusPremiumPrice((item as any)?.price)
        ) || priceEntries[0]

      const price = (selectedPriceEntry[1] as any).price

      // Find product name
      const productEntry = Object.entries(cache).find(
        ([key, item]: [string, any]) => key.startsWith("Product:") && item?.name
      )

      const name = (productEntry?.[1] as any)?.name || "Unknown"

      // Determine price description based on the price object properties
      let description: PriceDescription

      if (price.isFree && !price.isTiedToSubscription) {
        description = PriceDescription.FREE_TO_PLAY
      } else if (price.isTiedToSubscription) {
        // Check upsellText to determine Extra vs Premium
        if (price.upsellText?.toLowerCase().includes("extra")) {
          description = PriceDescription.PS_PLUS_EXTRA
        } else if (price.upsellText?.toLowerCase().includes("premium")) {
          description = PriceDescription.PS_PLUS_PREMIUM
        } else {
          // Fallback for tied to subscription but unclear tier
          description = PriceDescription.PS_PLUS
        }
      } else if (
        price.serviceBranding?.includes("PS_PLUS") ||
        price.discountText?.includes("PS+")
      ) {
        description = PriceDescription.PS_PLUS
      } else {
        description = PriceDescription.STANDARD
      }

      // Extract lowest recent price from history
      const lowestRecentPrice = price.history?.lowestRecentPrice || null

      // Format end time if available
      const endTime = price.endTime
        ? new Date(parseInt(price.endTime)).toISOString()
        : null

      return {
        name,
        basePrice:
          price.basePrice === "Free"
            ? "0.00"
            : price.basePrice.replace(/[^0-9.]/g, ""),
        currentPrice:
          price.discountedPrice === "Free" ||
          price.discountedPrice === "Included"
            ? "0.00"
            : price.discountedPrice
              ? price.discountedPrice.replace(/[^0-9.]/g, "")
              : price.basePrice.replace(/[^0-9.]/g, ""),
        savings:
          price.basePriceValue -
          (price.discountedValue || price.basePriceValue),
        discount: price.discountText,
        currency: price.currencyCode,
        description,
        isFree: price.isFree,
        isTiedToSubscription: price.isTiedToSubscription,
        endTime,
        lowestRecentPrice
      }
    } catch {
      // Skip invalid JSON
    }
  }

  return null
}

function isPsPlusPremiumPrice(price: any): boolean {
  if (!price?.isTiedToSubscription) return false
  return price.upsellText?.toLowerCase().includes("premium") ?? false
}

export function buildPlayStationStoreUrl(
  urlSegment: string,
  country: "CA" | "US" = "CA"
): string {
  if (!urlSegment) return ""

  const countryMap: Record<"CA" | "US", string> = {
    CA: "en-ca",
    US: "en-us"
  }
  return `https://store.playstation.com/${countryMap[country]}/${urlSegment}`
}
