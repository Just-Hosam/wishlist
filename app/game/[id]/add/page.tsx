import GameForm from "@/components/layout/GameForm"
import prisma from "@/lib/prisma"
import { buildIGDBImageUrl, getStoreUrlsFromIGDB } from "@/lib/igdb-store-links"
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

  // Fetch IGDB game data
  const igdbGame = await prisma.iGDBGame.findUnique({
    where: { igdbId: parseInt(id) },
    select: {
      id: true,
      igdbId: true,
      name: true,
      summary: true,
      coverImageId: true,
      platforms: true,
      nintendoUrlSegment: true,
      playstationUrlSegment: true
    }
  })

  if (!igdbGame) {
    notFound()
  }

  // Build store URLs for Canada
  const storeUrls = getStoreUrlsFromIGDB(igdbGame, "CA")

  // Transform IGDB data to Game shape for the form
  const gameData = {
    name: igdbGame.name,
    description: igdbGame.summary,
    coverImageUrl: buildIGDBImageUrl(igdbGame.coverImageId),
    category: GameCategory.WISHLIST,
    igdbGameId: igdbGame.igdbId.toString(),
    // Pre-populate store URLs if available
    storeUrls: {
      nintendo: storeUrls.nintendo,
      playstation: storeUrls.playstation
    }
  }

  return <GameForm game={gameData} isFromIGDB={true} />
}
