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
): string {
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
): string {
  const countryMap: Record<Country, string> = {
    CA: "en-ca",
    US: "en-us"
  }
  return `https://store.playstation.com/${countryMap[country]}/${urlSegment}`
}

/**
 * Build all available store URLs from IGDB game data
 * @param igdbGame - IGDB game data with store URL segments
 * @param country - Country code (default: 'CA' for Canada)
 * @returns Object with all available store URLs
 */
export function getStoreUrlsFromIGDB(
  igdbGame: IGDBStoreSegments,
  country: Country = "CA"
): {
  nintendo: string | null
  playstation: string | null
} {
  return {
    nintendo: igdbGame.nintendoUrlSegment
      ? buildNintendoStoreUrl(igdbGame.nintendoUrlSegment, country)
      : null,
    playstation: igdbGame.playstationUrlSegment
      ? buildPlayStationStoreUrl(igdbGame.playstationUrlSegment, country)
      : null
  }
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
    | "t_cover_small"
    | "t_cover_big"
    | "t_screenshot_med"
    | "t_screenshot_big"
    | "t_720p" = "t_cover_big"
): string {
  return `https://images.igdb.com/igdb/image/upload/${size}/${coverImageId}.jpg`
}
