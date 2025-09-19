// Nintendo price scraping utilities

export const getNSUID = async (url: string): Promise<string> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`)
  }

  const html = await response.text()

  // Find the first instance of "nsuid": then pull in the value in the next ""
  const nsuidMatch = html.match(/"nsuid"\s*:\s*"([^"]+)"/)

  if (!nsuidMatch || !nsuidMatch[1]) {
    throw new Error("NSUID not found in the page")
  }

  return nsuidMatch[1]
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
}

export async function getCurrentPrice(
  nsuid: string,
  country = COUNTRY,
  lang = LANG
): Promise<NintendoGameInfo> {
  const url = `https://api.ec.nintendo.com/v1/price?country=${country}&ids=${nsuid}&lang=${lang}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()

  const row = data.prices?.[0]

  const priceAvailable = row.discount_price || row.regular_price
  if (!priceAvailable) throw new Error("Price fields missing")

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
}

export async function getNintendoGameInfo(
  url: string
): Promise<NintendoGameInfo> {
  const nsuid = await getNSUID(url)
  return await getCurrentPrice(nsuid)
}

// Example usage (commented out for production)
/*
const gameUrl =
  "https://www.nintendo.com/en-ca/store/products/final-fantasy-vii-remake-intergrade-switch-2/"

getNintendoGameInfo(gameUrl)
  .then(console.log)
  .catch(console.error)
*/
