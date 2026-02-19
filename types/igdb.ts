import { Platform } from "./enums"

export interface IGDBGame {
  id: string
  igdbId: number
  name: string
  slug: string
  summary: string
  coverImageId: string
  screenshotImageIds: string[]
  videoId: string | null
  videoIds: string[]
  platforms: Platform[]
  firstReleaseDate: number
  rating?: number | null
  ratingCount?: number | null
  aggregatedRating?: number | null
  aggregatedRatingCount?: number | null
  hypes?: number | null
  nintendoUrlSegment?: string | null
  playstationUrlSegment?: string | null
  steamUrlSegment?: string | null
}

export interface RawIGDBGame {
  id: number
  name: string
  slug: string
  summary?: string
  cover?: { id: string; image_id: string }
  screenshots?: { id: string; image_id: string }[]
  videos?: { id: string; video_id: string; name: string }[]
  platforms?: { id: number }[]
  first_release_date?: number
  rating?: number
  rating_count?: number
  aggregated_rating?: number
  aggregated_rating_count?: number
  hypes?: number
  websites?: { id: string; type: number; url: string }[]
}
