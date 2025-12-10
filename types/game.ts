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

export interface Game {
  id?: string
  name?: string
  length?: number | null
  category: GameCategory
  platforms?: Platform[]
  nowPlaying?: boolean

  // IGDB fields
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

  // Store URLs
  storeUrls?: {
    nintendo: string | null
    playstation: string | null
  }

  // Price data
  prices?: {
    platform: Platform
    externalId: string
    storeUrl: string | null
    countryCode: string | null
    currencyCode: string | null
    regularPrice: number | null
    currentPrice: number | null
  }[]
}
