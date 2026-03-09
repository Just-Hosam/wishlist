import { Platform } from "./enums"

export const IGDB_GAME_FIELDS = `
  name, slug,
  summary,
  first_release_date,
  websites.type, websites.url,
  platforms.id,
  cover.image_id, screenshots.image_id, videos.video_id, videos.name,
  hypes, rating, rating_count, aggregated_rating, aggregated_rating_count
`

export const IGDB_DISCOVER_WHERE_FILTER = `
  game_type = (0, 2, 3, 8, 9)
  & platforms = (48, 167, 130, 508, 6, 169)
  & first_release_date != null
  & first_release_date >= 946688461
  & summary != null
  & cover != null
  & videos != null
  & genres != null
  & themes != (42)
  & keywords != (343, 847, 2509, 3586, 26306)
`

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

export interface IGDBPopscore {
  game_id: number
  popularity_type: number
  value: number
}
