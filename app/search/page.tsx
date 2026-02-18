import GameCarousel from "@/components/game/GameCarousel"
import { buildIGDBImageUrl } from "@/lib/igdb-store-links"
import { tryCatch } from "@/lib/try-catch"
import {
  getCachedIGDBTrendingGames,
  getCachedIGDBUpcomingGames
} from "@/server/actions/igdb"

export const dynamic = "force-static"

export default async function SearchPage() {
  const [trendingResult, upcomingResult] = await Promise.all([
    tryCatch(getCachedIGDBTrendingGames()),
    tryCatch(getCachedIGDBUpcomingGames())
  ])

  const upcomingGames = upcomingResult.data ?? []
  const upcomingCarouselGames = upcomingGames.map((game) => ({
    id: game.id,
    name: game.name,
    coverImageUrl: buildIGDBImageUrl(game.coverImageId),
    releaseDate: game.firstReleaseDate,
    length: undefined,
    platforms: game.platforms
  }))

  const trendingGames = trendingResult.data ?? []
  const trendingCarouselGames = trendingGames.map((game) => ({
    id: game.id,
    name: game.name,
    coverImageUrl: buildIGDBImageUrl(game.coverImageId),
    releaseDate: game.firstReleaseDate,
    length: undefined,
    platforms: game.platforms
  }))

  return (
    <div className="custom-slide-up-fade-in">
      <div className="mb-8">
        <h2 className="mt-1 text-lg font-bold">Upcoming</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Don't miss these upcoming releases.
        </p>
        <GameCarousel
          games={upcomingCarouselGames}
          baseHref="/search/upcoming"
          showDate
          showPlatforms
        />
      </div>

      <div>
        <h2 className="text-lg font-bold">Trending</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Explore these popular titles.
        </p>
        <GameCarousel
          games={trendingCarouselGames}
          baseHref="/search/trending"
          showDate
          showPlatforms
        />
      </div>
    </div>
  )
}
