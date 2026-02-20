import GameCarousel from "@/components/game/GameCarousel"
import GameList from "@/components/game/GameList"
import ListEmptyState from "@/components/game/ListEmptyState"
import { getCachedLibraryGames } from "@/server/actions/lists"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function LibraryPage() {
  const userId = (await headers()).get("x-user-id")
  if (!userId) redirect("/")

  const libraryGames = await getCachedLibraryGames(userId)

  const nowPlayingGames = libraryGames.filter((game) => game.nowPlaying)
  const backlogGames = libraryGames.filter((game) => !game.nowPlaying)
  const hasNowPlaying = nowPlayingGames.length > 0
  const hasBacklog = backlogGames.length > 0

  if (!hasNowPlaying && !hasBacklog) return <ListEmptyState />

  return (
    <>
      {hasNowPlaying && (
        <div className="custom-slide-up-fade-in mb-9">
          <h2 className="text-lg font-bold">Now Playing</h2>
          <p className="mb-3 text-xs text-muted-foreground">
            Games you're playing right now.
          </p>
          <GameCarousel
            games={nowPlayingGames}
            baseHref="/library"
            showLength
            showPlatforms
          />
        </div>
      )}
      {hasBacklog && (
        <div className="custom-slide-up-fade-in">
          {hasNowPlaying && (
            <>
              <h2 className="text-lg font-bold">Backlog</h2>
              <p className="mb-3 text-xs text-muted-foreground">
                Your to-play collection.
              </p>
            </>
          )}
          <GameList
            games={backlogGames}
            baseHref="/library"
            showLength
            showPlatforms
          />
        </div>
      )}
    </>
  )
}
