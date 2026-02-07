"use server"

import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { GameCategory, GameInput, GameOutput } from "@/types"
import { getServerSession } from "next-auth"
import { revalidateTag } from "next/cache"

function revalidateGameCategory(category: GameCategory, userId: string) {
  revalidateTag(`user-${category.toLowerCase()}-games-${userId}`)
}

function revalidateGameDetail(gameId: string) {
  revalidateTag(`game-detail-${gameId}`)
}

export async function deleteGame(id: string) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized.")
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    throw new Error("User not found.")
  }

  const game = await prisma.game.findFirst({
    where: {
      id,
      userId: user.id
    }
  })

  if (!game) {
    throw new Error("Game not found.")
  }

  await prisma.game.delete({ where: { id: game.id } })

  revalidateGameCategory(game.category, userId)
  revalidateGameDetail(game.id)
}

export async function saveGame(
  data: GameInput,
  id?: string,
  categoriesToRevalidate?: GameCategory[]
): Promise<GameOutput> {
  const session = await getServerSession(authOptions)
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

  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user || !user.id) {
    throw new Error("User not found.")
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
    game = await prisma.game.create({
      data: {
        ...gameData,
        userId: user.id
      }
    })
  } else {
    game = await prisma.game.update({
      where: { id, userId: user.id },
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

  revalidateGameDetail(game.id)

  return game
}

export async function toggleNowPlaying(gameId: string) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized.")
  }

  if (!gameId) {
    throw new Error("Game ID is required.")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error("User not found.")
  }

  const game = await prisma.game.findFirst({
    where: {
      id: gameId,
      userId: user.id
    }
  })

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
  revalidateGameDetail(gameId)

  return updatedGame.nowPlaying
}
