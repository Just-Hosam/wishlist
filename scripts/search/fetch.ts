import { buildRequestHeaders } from "@/lib/request"
import { IGDB_DISCOVER_WHERE_FILTER } from "@/types"
import { RawSearchGame, SEARCH_GAME_FIELDS } from "@/types/search"

const IGDB_API_URL = "https://api.igdb.com/v4/games"
const CLIENT_ID = process.env.IGDB_CLIENT_ID
const ACCESS_TOKEN = process.env.IGDB_ACCESS_TOKEN

export const fetchSearchKeywordGamesBatch = async (
  limit = 500,
  offset = 0
): Promise<RawSearchGame[]> => {
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
      fields ${SEARCH_GAME_FIELDS};

      where ${IGDB_DISCOVER_WHERE_FILTER}; 

      sort id asc;
      limit ${safeLimit};
      offset ${offset};
    `.trim()
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`IGDB API error (${response.status}): ${errorText}`)
  }

  return (await response.json()) as RawSearchGame[]
}
