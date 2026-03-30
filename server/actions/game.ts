"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { GameCategory, GameInput, GameOutput } from "@/types"
import { updateTag } from "next/cache"

function revalidateGameCategory(category: GameCategory, userId: string) {
  updateTag(`user-${category.toLowerCase()}-games-${userId}`)
}

export async function deleteGame(id: string) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized.")
  }

  const game = await prisma.game.findFirst({
    where: { id, userId }
  })

  if (!game) {
    throw new Error("Game not found.")
  }

  await prisma.game.delete({ where: { id: game.id } })

  revalidateGameCategory(game.category, userId)
}

export async function saveGame(
  data: GameInput,
  id?: string,
  categoriesToRevalidate?: GameCategory[]
): Promise<GameOutput> {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) throw new Error("Unauthorized.")

  const {
    length,
    category,
    platforms,
    nowPlaying,
    igdbId,
    igdbName,
    igdbSlug,
    igdbSummary,
    igdbCoverImageId,
    igdbScreenshotIds,
    igdbVideoId,
    igdbVideoIds,
    igdbPlatformIds,
    igdbFirstReleaseDate,
    igdbNintendoUrlSegment,
    igdbPlaystationUrlSegment,
    igdbSteamUrlSegment
  } = data

  if (!category) {
    throw new Error("Missing category")
  }

  if (!Object.values(GameCategory).includes(category)) {
    throw new Error("Invalid game category.")
  }

  const gameData = {
    length: length || null,
    category: category,
    platforms: platforms ?? [],
    nowPlaying: category === GameCategory.LIBRARY ? !!nowPlaying : false,
    igdbId: igdbId || null,
    igdbName: igdbName || null,
    igdbSlug: igdbSlug || null,
    igdbSummary: igdbSummary || null,
    igdbCoverImageId: igdbCoverImageId || null,
    igdbScreenshotIds: igdbScreenshotIds || [],
    igdbVideoId: igdbVideoId || null,
    igdbVideoIds: igdbVideoIds || [],
    igdbPlatformIds: igdbPlatformIds || [],
    igdbFirstReleaseDate: igdbFirstReleaseDate || null,
    igdbNintendoUrlSegment: igdbNintendoUrlSegment || null,
    igdbPlaystationUrlSegment: igdbPlaystationUrlSegment || null,
    igdbSteamUrlSegment: igdbSteamUrlSegment || null
  }

  let game: GameOutput

  if (!id) {
    game = await prisma.game.create({ data: { ...gameData, userId } })
  } else {
    game = await prisma.game.update({
      where: { id, userId },
      data: gameData
    })
  }

  if (categoriesToRevalidate) {
    categoriesToRevalidate.forEach((category) =>
      revalidateGameCategory(category, userId)
    )
  } else {
    revalidateGameCategory(game.category, userId)
  }

  return game
}

export async function toggleNowPlaying(gameId: string) {
  if (!gameId) throw new Error("Game ID is required.")

  const session = await auth()
  const userId = session?.user?.id

  if (!userId) throw new Error("Unauthorized.")

  const game = await prisma.game.findFirst({ where: { id: gameId, userId } })

  if (!game) {
    throw new Error("Game not found or you don't have permission to update it.")
  }

  if (game.category !== GameCategory.LIBRARY) {
    throw new Error("Only library games can be toggled.")
  }

  const updatedGame = await prisma.game.update({
    where: { id: gameId },
    data: {
      nowPlaying: !game.nowPlaying
    }
  })

  revalidateGameCategory(GameCategory.LIBRARY, userId)

  return updatedGame.nowPlaying
}
