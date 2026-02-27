/**
 * Utility functions for building store URLs from IGDB data
 * Currently supports Canada only, expandable to other countries
 */

type Country = "CA" | "US"

interface IGDBStoreSegments {
  nintendoUrlSegment?: string | null
  playstationUrlSegment?: string | null
  steamUrlSegment?: string | null
}

/**
 * Build Nintendo eShop URL for a given country
 *
 * Nintendo URL segments can be in two formats:
 * - "games/detail/slug" - Used in US store (can also use store/products)
 * - "store/products/slug" - Used in CA/US store
 *
 * @param urlSegment - The Nintendo URL segment from IGDB (e.g., "games/detail/slug" or "store/products/slug")
 * @param country - Country code (default: 'CA' for Canada)
 * @returns Full Nintendo eShop URL
 */
export function buildNintendoStoreUrl(
  urlSegment: string,
  country: Country = "CA"
): string | null {
  if (!urlSegment) return null

  const countryMap: Record<Country, string> = {
    CA: "en-ca",
    US: "en-us"
  }

  const locale = countryMap[country]

  // If segment is "games/detail/slug", convert to "store/products/slug" for CA
  // US can accept both formats, but CA only accepts "store/products"
  if (country === "CA" && urlSegment.startsWith("games/detail/")) {
    const slug = urlSegment.replace("games/detail/", "")
    return `https://www.nintendo.com/${locale}/store/products/${slug}`
  }

  // Otherwise, use the segment as-is
  return `https://www.nintendo.com/${locale}/${urlSegment}`
}

/**
 * Build PlayStation Store URL for a given country
 * @param urlSegment - The PlayStation URL segment from IGDB
 * @param country - Country code (default: 'CA' for Canada)
 * @returns Full PlayStation Store URL
 */
export function buildPlayStationStoreUrl(
  urlSegment: string,
  country: Country = "CA"
): string | null {
  if (!urlSegment) return null

  const countryMap: Record<Country, string> = {
    CA: "en-ca",
    US: "en-us"
  }
  return `https://store.playstation.com/${countryMap[country]}/${urlSegment}`
}

/**
 * Build Steam Store URL for a given country
 * @param urlSegment - The Steam URL segment from IGDB
 * @param country - Country code (default: 'CA' for Canada)
 * @returns Full Steam Store URL
 */
export function buildSteamStoreUrl(
  urlSegment: string,
  country: Country = "CA"
): string | null {
  if (!urlSegment) return null

  const appId = extractSteamAppId(urlSegment)
  if (!appId) return null

  return `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=${country.toLowerCase()}&l=en`
}

/**
 * Build Steam store page URL for direct user navigation
 * @param urlSegment - The Steam URL segment from IGDB
 * @param country - Country code (default: 'CA' for Canada)
 * @returns Full Steam store page URL
 */
export function buildSteamStorePageUrl(
  urlSegment: string,
  country: Country = "CA"
): string | null {
  if (!urlSegment) return null

  const appId = extractSteamAppId(urlSegment)
  if (!appId) return null

  return `https://store.steampowered.com/app/${appId}/?cc=${country.toLowerCase()}&l=en`
}

function extractSteamAppId(urlSegment: string): string | null {
  const match = urlSegment.match(/\d+/)
  return match ? match[0] : null
}

/**
 * Build IGDB cover image URL
 * @param coverImageId - The IGDB cover image ID
 * @param size - Image size (default: 't_cover_big')
 * @returns Full IGDB image URL
 */
export function buildIGDBImageUrl(
  coverImageId: string,
  size:
    | "cover_small"
    | "cover_big"
    | "screenshot_med"
    | "screenshot_big"
    | "720p"
    | "1080p" = "cover_big"
): string {
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${coverImageId}.jpg`
}
