import GameForm from "@/components/layout/GameForm"
import prisma from "@/lib/prisma"
import { getStoreUrlsFromIGDB } from "@/lib/igdb-store-links"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditGame({ params }: Props) {
  const { id } = await params

  // Fetch the game data with platform prices
  const gameData = await prisma.game.findUnique({
    where: { id },
    select: {
      id: true,
      length: true,
      category: true,
      platforms: true,
      nowPlaying: true,
      // IGDB metadata
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
      prices: {
        select: {
          platform: true,
          externalId: true,
          storeUrl: true,
          countryCode: true,
          currencyCode: true,
          regularPrice: true,
          currentPrice: true
        }
      }
    }
  })

  if (!gameData) {
    notFound()
  }

  // Build store URLs from segments if available
  const storeUrls = getStoreUrlsFromIGDB(
    {
      nintendoUrlSegment: gameData.igdbNintendoUrlSegment,
      playstationUrlSegment: gameData.igdbPlaystationUrlSegment,
      steamUrlSegment: gameData.igdbSteamUrlSegment
    },
    "CA"
  )

  // Convert Decimal values to numbers for serialization
  const game = {
    ...gameData,
    igdbId: gameData.igdbId || undefined,
    igdbName: gameData.igdbName || undefined,
    igdbSlug: gameData.igdbSlug || undefined,
    igdbSummary: gameData.igdbSummary || undefined,
    igdbCoverImageId: gameData.igdbCoverImageId || undefined,
    igdbScreenshotIds: gameData.igdbScreenshotIds || undefined,
    igdbVideoId: gameData.igdbVideoId || undefined,
    igdbPlatformIds: gameData.igdbPlatformIds || undefined,
    igdbFirstReleaseDate: gameData.igdbFirstReleaseDate || undefined,
    igdbNintendoUrlSegment: gameData.igdbNintendoUrlSegment || undefined,
    igdbPlaystationUrlSegment: gameData.igdbPlaystationUrlSegment || undefined,
    igdbSteamUrlSegment: gameData.igdbSteamUrlSegment || undefined,
    storeUrls: {
      nintendo: storeUrls.nintendo,
      playstation: storeUrls.playstation
    },
    prices: gameData.prices.map((price) => ({
      ...price,
      storeUrl: price.storeUrl,
      regularPrice: price.regularPrice ? Number(price.regularPrice) : null,
      currentPrice: price.currentPrice ? Number(price.currentPrice) : null
    }))
  }

  return <GameForm game={game} isEdit={true} isFromIGDB={!!gameData.igdbId} />
}
