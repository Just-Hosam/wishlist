import { buildRequestHeaders } from "@/lib/request"
import { RawIGDBAPIGame } from "@/types"

const IGDB_API_URL = "https://api.igdb.com/v4/games"
const CLIENT_ID = process.env.IGDB_CLIENT_ID
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN

export const fetchGamesBatch = async (
  limit = 500,
  offset = 0
): Promise<RawIGDBAPIGame[]> => {
  if (!CLIENT_ID || !ACCESS_TOKEN) {
    throw new Error("IGDB_CLIENT_ID and IGDB_ACCESS_TOKEN must be provided")
  }

  if (offset < 0) {
    throw new Error("Offset must be zero or greater")
  }

  const safeLimit = Math.min(limit, 500)
  const response = await fetch(IGDB_API_URL, {
    method: "POST",
    headers: buildRequestHeaders({
      kind: "api",
      headers: {
        "Client-ID": CLIENT_ID,
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "text/plain",
        accept: "application/json"
      }
    }),
    body: `
      fields 
        name, slug, alternative_names.name,
        summary,
        first_release_date,
        websites.type, websites.url,
        cover.image_id, screenshots.image_id, videos.video_id, videos.name,
        platforms.id,
        hypes, rating, rating_count, aggregated_rating, aggregated_rating_count;

      where 
        game_type = (0, 2, 3, 8, 9)
        & platforms = (48, 167, 130, 508, 6, 169)
        & first_release_date != null 
        & first_release_date >= 1262329201
        & summary != null
        & cover != null
        & videos != null
        & genres != null
        & themes != (42) 
        & keywords != (343, 847, 2509, 3586, 26306);

      sort id asc;
      limit ${safeLimit};
      offset ${offset};
    `.trim()
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`IGDB API error (${response.status}): ${errorText}`)
  }

  return (await response.json()) as RawIGDBAPIGame[]
}
