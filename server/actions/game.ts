"use server"

import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { GameCategory, GameInput, GameOutput, Platform } from "@/types"
import { getServerSession } from "next-auth"
import { revalidateTag } from "next/cache"

interface GameData {
  name: string
  length?: string
  category: GameCategory
  platforms?: Platform[]
  nowPlaying?: boolean

  // IGDB metadata fields
  igdbId?: number
  igdbName?: string
  igdbSlug?: string
  igdbSummary?: string
  igdbCoverImageId?: string
  igdbScreenshotIds?: string[]
  igdbVideoId?: string | null
  igdbPlatformIds?: number[]
  igdbFirstReleaseDate?: number
  igdbNintendoUrlSegment?: string | null
  igdbPlaystationUrlSegment?: string | null
  igdbSteamUrlSegment?: string | null

  nintendo?: {
    nsuid: string
    storeUrl?: string
    countryCode?: string
    regularPrice?: number
    currentPrice?: number
  }
  playstation?: {
    storeUrl?: string
    countryCode?: string
    regularPrice?: number
    currentPrice?: number
  }
}

function revalidateGameCategory(category: GameCategory, userId: string) {
  revalidateTag(`user-${category.toLowerCase()}-games-${userId}`)
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
}

export async function saveGame(
  data: GameInput,
  id?: string
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
    igdbPlatformIds,
    igdbFirstReleaseDate,
    igdbNintendoUrlSegment,
    igdbPlaystationUrlSegment,
    igdbSteamUrlSegment
  } = data

  // Validate required fields
  if (!category) {
    throw new Error("Missing category")
  }

  // Validate category
  if (!Object.values(GameCategory).includes(category)) {
    throw new Error("Invalid game category.")
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })

  if (!user) {
    throw new Error("User not found.")
  }

  const gameCategory = category || GameCategory.WISHLIST

  const game = await prisma.game.upsert({
    where: { id: id || "" },
    update: {
      length: length || null,
      category: gameCategory,
      platforms: platforms ?? [],
      nowPlaying: gameCategory === GameCategory.LIBRARY ? !!nowPlaying : false,
      igdbId: igdbId || null,
      igdbName: igdbName || null,
      igdbSlug: igdbSlug || null,
      igdbSummary: igdbSummary || null,
      igdbCoverImageId: igdbCoverImageId || null,
      igdbScreenshotIds: igdbScreenshotIds || [],
      igdbVideoId: igdbVideoId || null,
      igdbPlatformIds: igdbPlatformIds || [],
      igdbFirstReleaseDate: igdbFirstReleaseDate || null,
      igdbNintendoUrlSegment: igdbNintendoUrlSegment || null,
      igdbPlaystationUrlSegment: igdbPlaystationUrlSegment || null,
      igdbSteamUrlSegment: igdbSteamUrlSegment || null
    },
    create: {
      length: length || null,
      category: gameCategory,
      userId: user.id,
      platforms: platforms ?? [],
      nowPlaying: gameCategory === GameCategory.LIBRARY ? !!nowPlaying : false,
      igdbId: igdbId || null,
      igdbName: igdbName || null,
      igdbSlug: igdbSlug || null,
      igdbSummary: igdbSummary || null,
      igdbCoverImageId: igdbCoverImageId || null,
      igdbScreenshotIds: igdbScreenshotIds || [],
      igdbVideoId: igdbVideoId || null,
      igdbPlatformIds: igdbPlatformIds || [],
      igdbFirstReleaseDate: igdbFirstReleaseDate || null,
      igdbNintendoUrlSegment: igdbNintendoUrlSegment || null,
      igdbPlaystationUrlSegment: igdbPlaystationUrlSegment || null,
      igdbSteamUrlSegment: igdbSteamUrlSegment || null
    }
  })

  // TODO: Handle revalidation for both old and new categories if updating
  // Revalidate the appropriate list page
  revalidateGameCategory(game.category, userId)

  return game
}

export async function createGame(data: GameData) {
  const session = await getServerSession(authOptions)

  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized.")
  }

  const {
    name,
    length,
    category,
    platforms,
    nintendo,
    playstation,
    nowPlaying,
    igdbId,
    igdbName,
    igdbSlug,
    igdbSummary,
    igdbCoverImageId,
    igdbScreenshotIds,
    igdbVideoId,
    igdbPlatformIds,
    igdbFirstReleaseDate,
    igdbNintendoUrlSegment,
    igdbPlaystationUrlSegment,
    igdbSteamUrlSegment
  } = data

  // Validate required fields
  if (!name || !category) {
    throw new Error("Missing required fields: name and category are required.")
  }

  // Validate category
  if (!Object.values(GameCategory).includes(category)) {
    throw new Error("Invalid game category.")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error("User not found.")
  }

  const gameCategory = category || GameCategory.WISHLIST

  const game = await prisma.game.create({
    data: {
      length: length ? parseInt(length) : null,
      category: gameCategory,
      userId: user.id,
      platforms: platforms ?? [],
      nowPlaying: gameCategory === GameCategory.LIBRARY ? !!nowPlaying : false,
      igdbId: igdbId || null,
      igdbName: igdbName || null,
      igdbSlug: igdbSlug || null,
      igdbSummary: igdbSummary || null,
      igdbCoverImageId: igdbCoverImageId || null,
      igdbScreenshotIds: igdbScreenshotIds || [],
      igdbVideoId: igdbVideoId || null,
      igdbPlatformIds: igdbPlatformIds || [],
      igdbFirstReleaseDate: igdbFirstReleaseDate || null,
      igdbNintendoUrlSegment: igdbNintendoUrlSegment || null,
      igdbPlaystationUrlSegment: igdbPlaystationUrlSegment || null,
      igdbSteamUrlSegment: igdbSteamUrlSegment || null
    }
  })

  // If Nintendo data is provided, create a Price record
  if (nintendo && nintendo.storeUrl && nintendo.nsuid) {
    await prisma.price.create({
      data: {
        platform: Platform.NINTENDO,
        externalId: nintendo.nsuid,
        storeUrl: nintendo.storeUrl,
        countryCode: nintendo.countryCode || null,
        regularPrice: nintendo.regularPrice || null,
        currentPrice: nintendo.currentPrice || nintendo.regularPrice || null,
        fetchedAt: new Date(),
        trackedBy: {
          connect: { id: game.id }
        }
      }
    })
  }

  if (playstation && playstation.storeUrl) {
    await prisma.price.create({
      data: {
        platform: Platform.PLAYSTATION,
        externalId: game.id, // Use game ID as external ID for PlayStation for now
        storeUrl: playstation.storeUrl,
        countryCode: playstation.countryCode || null,
        regularPrice: playstation.regularPrice || null,
        currentPrice:
          playstation.currentPrice || playstation.regularPrice || null,
        fetchedAt: new Date(),
        trackedBy: {
          connect: { id: game.id }
        }
      }
    })
  }

  // Revalidate the appropriate list page
  revalidateGameCategory(game.category, userId)

  return game
}

export async function updateGame(id: string, data: GameData) {
  const session = await getServerSession(authOptions)

  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized.")
  }

  const {
    name,
    length,
    category,
    platforms,
    nintendo,
    playstation,
    nowPlaying,
    igdbId,
    igdbName,
    igdbSlug,
    igdbSummary,
    igdbCoverImageId,
    igdbScreenshotIds,
    igdbVideoId,
    igdbPlatformIds,
    igdbFirstReleaseDate,
    igdbNintendoUrlSegment,
    igdbPlaystationUrlSegment,
    igdbSteamUrlSegment
  } = data

  // Validate required fields
  if (!name) {
    throw new Error("Game name is required.")
  }

  // Validate category
  if (category && !Object.values(GameCategory).includes(category)) {
    throw new Error("Invalid game category.")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error("User not found.")
  }

  // Check if game exists and belongs to the user
  const existingGame = await prisma.game.findFirst({
    where: {
      id,
      userId: user.id
    }
  })

  if (!existingGame) {
    throw new Error("Game not found or you don't have permission to edit it.")
  }

  const nextCategory = category || existingGame.category

  const updateData: any = {
    length: length ? parseInt(length) : null,
    category: nextCategory,
    nowPlaying:
      nextCategory === GameCategory.LIBRARY
        ? (nowPlaying ?? existingGame.nowPlaying ?? false)
        : false
  }

  // Only update IGDB fields if explicitly provided (don't overwrite with undefined)
  if (igdbId !== undefined) {
    updateData.igdbId = igdbId
  }
  if (igdbName !== undefined) {
    updateData.igdbName = igdbName
  }
  if (igdbSlug !== undefined) {
    updateData.igdbSlug = igdbSlug
  }
  if (igdbSummary !== undefined) {
    updateData.igdbSummary = igdbSummary
  }
  if (igdbCoverImageId !== undefined) {
    updateData.igdbCoverImageId = igdbCoverImageId
  }
  if (igdbScreenshotIds !== undefined) {
    updateData.igdbScreenshotIds = igdbScreenshotIds
  }
  if (igdbVideoId !== undefined) {
    updateData.igdbVideoId = igdbVideoId
  }
  if (igdbPlatformIds !== undefined) {
    updateData.igdbPlatformIds = igdbPlatformIds
  }
  if (igdbFirstReleaseDate !== undefined) {
    updateData.igdbFirstReleaseDate = igdbFirstReleaseDate
  }
  if (igdbNintendoUrlSegment !== undefined) {
    updateData.igdbNintendoUrlSegment = igdbNintendoUrlSegment
  }
  if (igdbPlaystationUrlSegment !== undefined) {
    updateData.igdbPlaystationUrlSegment = igdbPlaystationUrlSegment
  }
  if (igdbSteamUrlSegment !== undefined) {
    updateData.igdbSteamUrlSegment = igdbSteamUrlSegment
  }

  if (platforms !== undefined) {
    updateData.platforms = { set: platforms }
  }

  const updatedGame = await prisma.game.update({
    where: { id },
    data: updateData
  })

  // Handle Nintendo price data
  if (nintendo && nintendo.nsuid) {
    // Check if a Nintendo price record already exists for this game
    const existingPrice = await prisma.price.findFirst({
      where: {
        storeUrl: nintendo.storeUrl,
        platform: Platform.NINTENDO
      }
    })

    if (existingPrice) {
      // Update existing price record
      await prisma.price.update({
        where: { id: existingPrice.id },
        data: {
          externalId: nintendo.nsuid,
          storeUrl: nintendo.storeUrl!,
          countryCode: nintendo.countryCode || null,
          regularPrice: nintendo.regularPrice || null,
          currentPrice: nintendo.currentPrice || nintendo.regularPrice || null,
          fetchedAt: new Date()
        }
      })
    } else if (nintendo.storeUrl) {
      // Create new price record
      await prisma.price.create({
        data: {
          platform: Platform.NINTENDO,
          externalId: nintendo.nsuid,
          storeUrl: nintendo.storeUrl,
          countryCode: nintendo.countryCode || null,
          regularPrice: nintendo.regularPrice || null,
          currentPrice: nintendo.currentPrice || nintendo.regularPrice || null,
          fetchedAt: new Date(),
          trackedBy: {
            connect: { id }
          }
        }
      })
    }
  } else {
    // If Nintendo data is not provided, check if a price record exists and disconnect it
    const existingPrices = await prisma.price.findMany({
      where: {
        platform: Platform.NINTENDO,
        trackedBy: {
          some: { id }
        }
      }
    })

    if (existingPrices.length > 0) {
      await prisma.game.update({
        where: { id },
        data: {
          trackedPrices: {
            disconnect: existingPrices.map((p) => ({ id: p.id }))
          }
        }
      })
    }
  }

  // Handle PlayStation price data
  if (playstation && playstation.storeUrl) {
    // Check if a PlayStation price record already exists for this game
    const existingPrice = await prisma.price.findFirst({
      where: {
        storeUrl: playstation.storeUrl,
        platform: Platform.PLAYSTATION
      }
    })

    if (existingPrice) {
      // Update existing price record
      await prisma.price.update({
        where: { id: existingPrice.id },
        data: {
          externalId: id, // Use game ID as external ID for PlayStation for now
          storeUrl: playstation.storeUrl,
          countryCode: playstation.countryCode || null,
          regularPrice: playstation.regularPrice || null,
          currentPrice:
            playstation.currentPrice || playstation.regularPrice || null,
          fetchedAt: new Date()
        }
      })
    } else {
      // Create new price record
      await prisma.price.create({
        data: {
          platform: Platform.PLAYSTATION,
          externalId: id, // Use game ID as external ID for PlayStation for now
          storeUrl: playstation.storeUrl,
          countryCode: playstation.countryCode || null,
          regularPrice: playstation.regularPrice || null,
          currentPrice:
            playstation.currentPrice || playstation.regularPrice || null,
          fetchedAt: new Date(),
          trackedBy: {
            connect: { id }
          }
        }
      })
    }
  } else {
    // If PlayStation data is not provided, check if a price record exists and disconnect it
    const existingPrices = await prisma.price.findMany({
      where: {
        platform: Platform.PLAYSTATION,
        trackedBy: {
          some: { id }
        }
      }
    })

    if (existingPrices.length > 0) {
      await prisma.game.update({
        where: { id },
        data: {
          trackedPrices: {
            disconnect: existingPrices.map((p) => ({ id: p.id }))
          }
        }
      })
    }
  }

  // Revalidate both the old and new category pages in case the category changed
  revalidateGameCategory(existingGame.category, userId)

  // If category changed, also revalidate the new category page
  if (updatedGame.category !== existingGame.category) {
    revalidateGameCategory(updatedGame.category, userId)
  }

  return updatedGame
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

  return updatedGame.nowPlaying
}

export async function moveGame(gameId: string, toCategory: GameCategory) {
  const session = await getServerSession(authOptions)

  const userId = session?.user?.id

  if (!userId) {
    throw new Error("Unauthorized.")
  }

  if (!gameId) {
    throw new Error("Game ID is required.")
  }

  if (!Object.values(GameCategory).includes(toCategory)) {
    throw new Error("Invalid category.")
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
    throw new Error("Game not found or you don't have permission to move it.")
  }

  const oldCategory = game.category

  const updatedGame = await prisma.game.update({
    where: { id: gameId },
    data: {
      category: toCategory,
      nowPlaying: false
    }
  })

  // Revalidate both the old and new category pages
  revalidateGameCategory(oldCategory, userId)

  // Revalidate the new category page if it's different
  if (toCategory !== oldCategory) {
    revalidateGameCategory(toCategory, userId)
  }

  return updatedGame
}
