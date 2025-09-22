export interface GamePrice {
  name: string
  basePrice: string
  currentPrice: string
  savings: number
  discount?: string
  currency: string
  storeUrl: string
}

export interface ExtractedPrice {
  name: string
  basePrice: string
  currentPrice: string
  savings: number
  discount?: string
  currency: string
}

export async function getPlayStationGamePrice(
  url: string
): Promise<GamePrice | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(
        `Failed to fetch PlayStation Store page: ${response.status}`
      )
    }

    const html = await response.text()
    const gamePrice = extractPrice(html)

    // Include the original store URL in the response
    if (gamePrice) {
      return {
        ...gamePrice,
        storeUrl: url
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

      // Find price data
      const priceEntry = Object.entries(cache).find(
        ([key, item]: [string, any]) => key.includes("GameCTA") && item?.price
      )

      if (!priceEntry) continue

      const price = (priceEntry[1] as any).price

      // Find product name
      const productEntry = Object.entries(cache).find(
        ([key, item]: [string, any]) => key.startsWith("Product:") && item?.name
      )

      const name = (productEntry?.[1] as any)?.name || "Unknown"

      return {
        name,
        basePrice: price.basePrice,
        currentPrice: price.discountedPrice || price.basePrice,
        savings:
          price.basePriceValue -
          (price.discountedValue || price.basePriceValue),
        discount: price.discountText,
        currency: price.currencyCode
      }
    } catch {
      // Skip invalid JSON
    }
  }

  return null
}
