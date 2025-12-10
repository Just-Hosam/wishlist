import { GameCategory, Platform } from "./enums"

export interface GameFormData {
  name: string
  length?: string
  category: GameCategory
  platforms?: Platform[]
  nowPlaying?: boolean
  igdbId?: number
  igdbName?: string
  igdbSlug?: string
  igdbSummary?: string
  igdbCoverImageId?: string
  igdbScreenshotIds?: string[]
  igdbVideoId?: string | null
  igdbPlatformIds?: number[]
  igdbFirstReleaseDate?: number
  igdbNintendoUrlSegment?: string | null
  igdbPlaystationUrlSegment?: string | null
  igdbSteamUrlSegment?: string | null
  nintendo?: {
    nsuid: string
    storeUrl?: string
    countryCode?: string
    currencyCode?: string
    regularPrice?: number
    currentPrice?: number
  }
  playstation?: {
    storeUrl?: string
    countryCode?: string
    currencyCode?: string
    regularPrice?: number
    currentPrice?: number
  }
}
