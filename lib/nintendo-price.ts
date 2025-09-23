// Nintendo price scraping utilities

export const getNSUID = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url, {
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1"
      }
    })
    if (!response.ok) {
      console.error(`Failed to fetch Nintendo URL: ${response.status}`)
      return null
    }

    const html = await response.text()

    // Find the first instance of "nsuid": then pull in the value in the next ""
    const nsuidMatch = html.match(/"nsuid"\s*:\s*"([^"]+)"/)

    if (!nsuidMatch || !nsuidMatch[1]) {
      console.error("NSUID not found in the page")
      return null
    }

    return nsuidMatch[1]
  } catch (error) {
    console.error("Error fetching NSUID:", error)
    return null
  }
}

// const response_sample = {
//   personalized: false,
//   country: "CA",
//   prices: [
//     {
//       title_id: 70010000080959,
//       sales_status: "onsale",
//       regular_price: { amount: "$26.99", currency: "CAD", raw_value: "26.99" },
//       discount_price: {
//         amount: "$18.89",
//         currency: "CAD",
//         raw_value: "18.89",
//         start_datetime: "2025-08-27T16:00:00Z",
//         end_datetime: "2025-09-17T06:59:59Z"
//       },
//       gold_point: {
//         basic_gift_gp: "0",
//         basic_gift_rate: "0",
//         consume_gp: "0",
//         extra_gold_points: [],
//         gift_gp: "0",
//         gift_rate: "0"
//       }
//     }
//   ]
// }

// const NSUID = "70010000056206" // The Last Faith
// const NSUID = "70010000080959" // Crypt Custodian
// const NSUID = "70010000020840" // Silksong
const COUNTRY = "CA"
const LANG = "en"

export interface NintendoGameInfo {
  nsuid: string
  raw_price: string
  raw_price_value: string // The clean numeric value
  discounted_price?: string
  discounted_price_value?: string // The clean numeric value
  country: string
  currency: string
  onSale: boolean
  storeUrl: string
}

export interface NintendoPriceData {
  nsuid: string
  raw_price: string
  raw_price_value: string // The clean numeric value
  discounted_price?: string
  discounted_price_value?: string // The clean numeric value
  country: string
  currency: string
  onSale: boolean
}

export async function getCurrentPrice(
  nsuid: string,
  country = COUNTRY,
  lang = LANG
): Promise<NintendoPriceData | null> {
  try {
    const url = `https://api.ec.nintendo.com/v1/price?country=${country}&ids=${nsuid}&lang=${lang}`
    const res = await fetch(url, {
      headers: {
        Accept:
          "application/json,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    })
    if (!res.ok) {
      console.error(`Nintendo API HTTP ${res.status}`)
      return null
    }
    const data = await res.json()

    const row = data.prices?.[0]

    const priceAvailable = row?.discount_price || row?.regular_price
    if (!priceAvailable) {
      console.error("Price fields missing from Nintendo API response")
      return null
    }

    const raw_price = row.regular_price?.amount
    const raw_price_value = row.regular_price?.raw_value
    const discounted_price = row.discount_price?.amount
    const discounted_price_value = row.discount_price?.raw_value

    return {
      nsuid,
      raw_price,
      raw_price_value,
      discounted_price,
      discounted_price_value,
      country,
      currency: row.regular_price?.currency,
      onSale: !!row.discount_price
    }
  } catch (error) {
    console.error("Error fetching Nintendo price:", error)
    return null
  }
}

export async function getNintendoGameInfo(
  url: string
): Promise<NintendoGameInfo | null> {
  const nsuid = await getNSUID(url)
  if (!nsuid) {
    return null
  }

  const gameInfo = await getCurrentPrice(nsuid)
  if (!gameInfo) {
    return null
  }

  return {
    ...gameInfo,
    storeUrl: url
  }
}

// Example usage (commented out for production)
/*
const gameUrl =
  "https://www.nintendo.com/en-ca/store/products/final-fantasy-vii-remake-intergrade-switch-2/"

getNintendoGameInfo(gameUrl)
  .then(console.log)
  .catch(console.error)
*/
