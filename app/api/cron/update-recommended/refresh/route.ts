import { tryCatch } from "@/lib/try-catch"
import { getCachedRecommendedGames } from "@/server/actions/igdb"
import { requireCronAuth } from "@/server/cron/auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  const { data: recommendedGames, error } = await tryCatch(
    getCachedRecommendedGames()
  )

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Recommended games refresh failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    ok: true,
    trendingCount: recommendedGames.trending.length,
    upcomingCount: recommendedGames.upcoming.length,
    releasedCount: recommendedGames.released.length,
    timestamp: new Date().toISOString()
  })
}
