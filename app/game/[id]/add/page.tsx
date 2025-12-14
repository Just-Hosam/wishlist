import GameForm from "@/components/layout/GameForm"
import { getIGDBGameById } from "@/server/actions/igdb"
import { GameCategory, GameInput } from "@/types"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function AddFromSearch({ params }: Props) {
  const { id } = await params
  if (!id) notFound()

  const igdbGame = await getIGDBGameById(parseInt(id))
  if (!igdbGame) notFound()

  const gameData: GameInput = {
    igdbId: igdbGame.igdbId,
    igdbName: igdbGame.name,
    igdbSlug: igdbGame.slug,
    igdbSummary: igdbGame.summary,
    igdbCoverImageId: igdbGame.coverImageId,
    igdbScreenshotIds: igdbGame.screenshotImageIds,
    igdbVideoId: igdbGame.videoId,
    igdbPlatformIds: [],
    igdbFirstReleaseDate: igdbGame.firstReleaseDate,
    igdbNintendoUrlSegment: igdbGame.nintendoUrlSegment || null,
    igdbPlaystationUrlSegment: igdbGame.playstationUrlSegment || null,
    igdbSteamUrlSegment: igdbGame.steamUrlSegment || null,
    category: GameCategory.WISHLIST,
    platforms: [],
    length: null,
    nowPlaying: false
  }

  return <GameForm game={gameData} />
}
