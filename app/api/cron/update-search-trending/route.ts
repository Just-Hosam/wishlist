import { getCachedRecommendedGames } from "@/server/actions/igdb"
import { requireCronAuth } from "@/server/cron/auth"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  revalidateTag("igdb-recommended-games")
  revalidatePath("/search")

  try {
    const recommendedGames = await getCachedRecommendedGames()

    return NextResponse.json({
      trendingCount: recommendedGames.trending.length,
      upcomingCount: recommendedGames.upcoming.length,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Search discovery update failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
