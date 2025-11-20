import { Prisma } from "@prisma/client"

export interface RawIGDBGame {
  id: number
  name: string
  slug: string
  alternative_names?: { id: number; name: string }[]
  summary?: string
  cover?: { image_id: string }
  screenshots?: { image_id: string }[]
  videos?: { id: number; video_id: string; name: string }[]
  websites?: { id: number; url: string; type: number }[]
  platforms?: { id: number }[]
  genres?: { id: number }[]
  first_release_date?: number
  hypes?: number
  rating?: number
  rating_count?: number
  aggregated_rating?: number
  aggregated_rating_count?: number
}

export type SerializedIGDBGame = Prisma.IGDBGameCreateManyInput
