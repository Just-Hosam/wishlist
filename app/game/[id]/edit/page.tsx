import GameForm from "@/components/layout/GameForm"
import prisma from "@/lib/prisma"
import { getStoreUrlsFromIGDB } from "@/lib/igdb-store-links"
import { notFound } from "next/navigation"
import { GameInput, GameOutput } from "@/types"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditGame({ params }: Props) {
  const { id } = await params
  if (!id) notFound()

  // Fetch the game data with platform prices
  const gameData = await prisma.game.findUnique({
    where: { id },
    select: {
      id: true,
      length: true,
      category: true,
      platforms: true,
      nowPlaying: true,
      igdbId: true,
      igdbName: true,
      igdbSlug: true,
      igdbSummary: true,
      igdbCoverImageId: true,
      igdbScreenshotIds: true,
      igdbVideoId: true,
      igdbPlatformIds: true,
      igdbFirstReleaseDate: true,
      igdbNintendoUrlSegment: true,
      igdbPlaystationUrlSegment: true,
      igdbSteamUrlSegment: true,
      trackedPrices: {
        select: {
          platform: true
        }
      }
    }
  })

  if (!gameData) notFound()

  const game: GameInput & { id: string } = {
    id: gameData.id,
    length: gameData.length,
    category: gameData.category,
    platforms: gameData.platforms,
    nowPlaying: gameData.nowPlaying,
    igdbId: gameData.igdbId || null,
    igdbName: gameData.igdbName || null,
    igdbSlug: gameData.igdbSlug || null,
    igdbSummary: gameData.igdbSummary || null,
    igdbCoverImageId: gameData.igdbCoverImageId || null,
    igdbScreenshotIds: gameData.igdbScreenshotIds || null,
    igdbVideoId: gameData.igdbVideoId || null,
    igdbPlatformIds: gameData.igdbPlatformIds || null,
    igdbFirstReleaseDate: gameData.igdbFirstReleaseDate || null,
    igdbNintendoUrlSegment: gameData.igdbNintendoUrlSegment || null,
    igdbPlaystationUrlSegment: gameData.igdbPlaystationUrlSegment || null,
    igdbSteamUrlSegment: gameData.igdbSteamUrlSegment || null
  }

  const isPlayStationLinked = gameData.trackedPrices.some(
    (price) => price.platform === "PLAYSTATION"
  )

  const isNintendoLinked = gameData.trackedPrices.some(
    (price) => price.platform === "NINTENDO"
  )

  return (
    <GameForm
      game={game}
      isEdit={true}
      isPlayStationLinked={isPlayStationLinked}
      isNintendoLinked={isNintendoLinked}
    />
  )
}
