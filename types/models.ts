import { GameCategory, Platform, PriceDescription } from "./enums"

export interface UserModel {
  id: string
  name: string | null
  email: string | null
  emailVerified: Date | null
  image: string | null
  age: number | null
  bio: string | null
}

export interface GameModel {
  id: string
  length: number | null
  category: GameCategory
  platforms: Platform[]
  nowPlaying: boolean
  igdbId: number | null
  igdbName: string | null
  igdbSlug: string | null
  igdbSummary: string | null
  igdbCoverImageId: string | null
  igdbScreenshotIds: string[]
  igdbVideoId: string | null
  igdbPlatformIds: number[]
  igdbFirstReleaseDate: number | null
  igdbNintendoUrlSegment: string | null
  igdbPlaystationUrlSegment: string | null
  igdbSteamUrlSegment: string | null
  userId: string
  createdAt: Date
  updatedAt: Date

  // Relationships
  user: UserModel | null
  trackedPrices: PriceModel[] | null
}

export interface PriceModel {
  id: string
  storeUrl: string
  externalId: string | null
  platform: Platform
  description: PriceDescription | null
  countryCode: string | null
  currencyCode: string | null
  regularPrice: number | null
  currentPrice: number | null
  fetchedAt: Date
  updatedAt: Date
  createdAt: Date

  // Relationships
  trackedPrices: GameModel[] | null
}
