import GameCarousel from "@/components/game/GameCarousel"
import { Button } from "@/components/ui/button"
import { buildIGDBImageUrl } from "@/lib/igdb-store-links"
import { tryCatch } from "@/lib/utils"
import { getCachedRecommendedGames } from "@/server/actions/igdb"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

export const dynamic = "force-static"

export default async function SearchPage() {
  const { data, error } = await tryCatch(getCachedRecommendedGames())

  if (error) return null

  const trendingGames = data?.trending ?? []
  const trendingCarouselGames = trendingGames.map((game) => ({
    id: game.id,
    name: game.name,
    coverImageUrl: buildIGDBImageUrl(game.coverImageId),
    releaseDate: game.firstReleaseDate,
    length: undefined,
    platforms: game.platforms
  }))

  const upcomingGames = data?.upcoming ?? []
  const upcomingCarouselGames = upcomingGames.map((game) => ({
    id: game.id,
    name: game.name,
    coverImageUrl: buildIGDBImageUrl(game.coverImageId),
    releaseDate: game.firstReleaseDate,
    length: undefined,
    platforms: game.platforms
  }))

  const releasedGames = data?.released ?? []
  const releasedCarouselGames = releasedGames.map((game) => ({
    id: game.id,
    name: game.name,
    coverImageUrl: buildIGDBImageUrl(game.coverImageId),
    releaseDate: game.firstReleaseDate,
    length: undefined,
    platforms: game.platforms
  }))

  return (
    <div className="custom-slide-up-fade-in">
      <div className="mb-9">
        <h2 className="text-lg font-bold">Trending</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Explore these popular titles.
        </p>
        <GameCarousel
          games={trendingCarouselGames}
          baseHref="/search/trending"
          showDate
          showPlatforms
        />
      </div>

      <div className="mb-9">
        <h2 className="text-lg font-bold">Coming Up</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Don't miss these upcoming releases.
        </p>
        <GameCarousel
          games={upcomingCarouselGames}
          baseHref="/search/upcoming"
          showDate
          showPlatforms
        />
      </div>

      <div className="mb-9">
        <h2 className="text-lg font-bold">Released</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          New and notable games.
        </p>
        <GameCarousel
          games={releasedCarouselGames}
          baseHref="/search/released"
          showDate
          showPlatforms
        />
      </div>

      <div>
        <h2 className="text-lg font-bold">External</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Check out these resources.
        </p>
        <a
          href="https://www.playstation.com/en-ca/ps-plus/games/?category=MONTHLY_GAMES&sort=last#plus-container"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-2 block"
        >
          <Button
            size="lg"
            variant="outline"
            className="h-auto w-full justify-between gap-3 px-6 py-4"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/logos/ps-plus.svg"
                alt="PlayStation Plus logo"
                width={17}
                height={17}
                className="rounded-sm drop-shadow-2xl"
              />
              <span className="font-semibold">Monthly Games</span>
            </div>
            <ExternalLink size={16} className="text-muted-foreground" />
          </Button>
        </a>
        <a
          href="https://www.playstation.com/en-ca/ps-plus/games/?category=GAME_CATALOG&sort=last#plus-container"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="lg"
            variant="outline"
            className="h-auto w-full justify-between gap-3 px-6 py-4"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/logos/ps-plus.svg"
                alt="PlayStation Plus logo"
                width={17}
                height={17}
                className="rounded-sm drop-shadow-2xl"
              />
              <span className="font-semibold">Game Catalog</span>
            </div>
            <ExternalLink size={16} className="text-muted-foreground" />
          </Button>
        </a>
      </div>
    </div>
  )
}
