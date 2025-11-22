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
 * @param urlSegment - The Nintendo URL segment from IGDB
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
  return `https://www.nintendo.com/${countryMap[country]}/store/products/${urlSegment}`
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
  return `https://store.playstation.com/${countryMap[country]}/concept/${urlSegment}`
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
