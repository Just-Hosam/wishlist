import {
  getCachedIGDBTrendingGames,
  getCachedIGDBUpcomingGames
} from "@/server/actions/igdb"
import { requireCronAuth } from "@/server/cron/auth"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  revalidateTag("search-trending-games")
  revalidateTag("search-upcoming-games")
  revalidatePath("/search")

  try {
    const [trendingGames, upcomingGames] = await Promise.all([
      getCachedIGDBTrendingGames(),
      getCachedIGDBUpcomingGames()
    ])

    return NextResponse.json({
      trendingCount: trendingGames.length,
      upcomingCount: upcomingGames.length,
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
