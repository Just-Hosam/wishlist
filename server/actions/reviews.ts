import { buildRequestHeaders } from "@/lib/request"
import { tryCatch } from "@/lib/utils"
import { RawSteamReviews, SteamReviews } from "@/types/reviews"
import { unstable_cache } from "next/cache"

const STEAM_REVIEWS_URL = "https://store.steampowered.com/appreviews"

async function fetchSteamReviews(steamId: string): Promise<SteamReviews> {
  if (!steamId) throw new Error("Invalid Steam Id")

  const url = `${STEAM_REVIEWS_URL}/${steamId}?json=1`

  const { data: response, error } = await tryCatch(
    fetch(url, {
      headers: buildRequestHeaders({
        kind: "api",
        referer: STEAM_REVIEWS_URL,
        origin: "https://store.steampowered.com"
      })
    })
  )

  if (error) {
    throw new Error("Failed to fetch steam reviews from API")
  }

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Steam reviews response error (${response.status}): ${errorText}`
    )
  }

  const data = (await response.json()) as RawSteamReviews

  const total = data?.query_summary?.total_reviews
  const description = data?.query_summary?.review_score_desc

  if (total === null && !description) throw new Error("No Reviews")

  return {
    total,
    description
  }
}

export const getCachedSteamReviews = async (
  steamId: string
): Promise<SteamReviews> => {
  return unstable_cache(
    async (steamId: string) => fetchSteamReviews(steamId),
    [steamId],
    {
      tags: [`steam-reviews-${steamId}`],
      revalidate: 259_200 // 3 days
    }
  )(steamId)
}
