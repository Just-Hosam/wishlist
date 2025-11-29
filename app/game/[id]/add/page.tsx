import GameForm from "@/components/layout/GameForm"
import { buildIGDBImageUrl, getStoreUrlsFromIGDB } from "@/lib/igdb-store-links"
import { getIGDBGameById } from "@/server/actions/igdb"
import { GameCategory } from "@prisma/client"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function AddFromSearch({ params }: Props) {
  const { id } = await params

  if (!id) {
    notFound()
  }

  // Fetch IGDB game data from API
  const igdbGame = await getIGDBGameById(parseInt(id))

  if (!igdbGame) {
    notFound()
  }

  // Build store URLs for Canada
  const storeUrls = getStoreUrlsFromIGDB(
    {
      nintendoUrlSegment: igdbGame.nintendoUrlSegment,
      playstationUrlSegment: igdbGame.playstationUrlSegment,
      steamUrlSegment: igdbGame.steamUrlSegment
    },
    "CA"
  )

  // Transform IGDB data to Game shape for the form
  const gameData = {
    igdbId: igdbGame.igdbId,
    igdbName: igdbGame.name,
    igdbSlug: igdbGame.slug,
    igdbSummary: igdbGame.summary,
    igdbCoverImageId: igdbGame.coverImageId,
    igdbScreenshotIds: igdbGame.screenshotImageIds,
    igdbVideoId: igdbGame.videoId,
    igdbPlatformIds: [], // We don't have platform IDs in IGDBGame interface
    igdbFirstReleaseDate: igdbGame.firstReleaseDate,
    igdbNintendoUrlSegment: igdbGame.nintendoUrlSegment,
    igdbPlaystationUrlSegment: igdbGame.playstationUrlSegment,
    igdbSteamUrlSegment: igdbGame.steamUrlSegment,
    category: GameCategory.WISHLIST,
    // DON'T pre-populate user platforms - let user select what they own
    // Pre-populate store URLs if available (for display/fetching prices)
    storeUrls: {
      nintendo: storeUrls.nintendo,
      playstation: storeUrls.playstation
    }
  }

  return <GameForm game={gameData} isFromIGDB={true} />
}
