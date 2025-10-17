"use server"

import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { GameCategory, Platform } from "@prisma/client"
import { getServerSession } from "next-auth"
import { revalidateTag } from "next/cache"

interface GameData {
  name: string
  length?: string
  category: GameCategory
  platforms?: Platform[]
  nowPlaying?: boolean
  nintendo?: {
    nsuid: string
    storeUrl?: string
    countryCode?: string
    currencyCode?: string
    regularPrice?: number
    currentPrice?: number
  }
  playstation?: {
    storeUrl?: string
    countryCode?: string
    currencyCode?: string
    regularPrice?: number
    currentPrice?: number
  }
}

function revalidateGameCategory(category: GameCategory) {
  revalidateTag(`user-${category.toLowerCase()}-games`)
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

  revalidateGameCategory(game.category)
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
    nowPlaying
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
      name,
      length: length ? parseInt(length) : null,
      category: gameCategory,
      userId: user.id,
      platforms: platforms ?? [],
      nowPlaying: gameCategory === GameCategory.LIBRARY ? !!nowPlaying : false
    }
  })

  // If Nintendo data is provided, create a GamePrice record
  if (nintendo && nintendo.nsuid) {
    await prisma.gamePrice.create({
      data: {
        gameId: game.id,
        platform: Platform.NINTENDO,
        externalId: nintendo.nsuid,
        storeUrl: nintendo.storeUrl || null,
        countryCode: nintendo.countryCode || null,
        currencyCode: nintendo.currencyCode || null,
        regularPrice: nintendo.regularPrice || null,
        currentPrice: nintendo.currentPrice || nintendo.regularPrice || null,
        lastFetchedAt: new Date()
      }
    })
  }

  if (playstation) {
    await prisma.gamePrice.create({
      data: {
        gameId: game.id,
        platform: Platform.PLAYSTATION,
        externalId: game.id, // Use game ID as external ID for PlayStation for now
        storeUrl: playstation.storeUrl || null,
        countryCode: playstation.countryCode || null,
        currencyCode: playstation.currencyCode || null,
        regularPrice: playstation.regularPrice || null,
        currentPrice:
          playstation.currentPrice || playstation.regularPrice || null,
        lastFetchedAt: new Date()
      }
    })
  }

  // Revalidate the appropriate list page
  revalidateGameCategory(game.category)

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
    nowPlaying
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
    name,
    length: length ? parseInt(length) : null,
    category: nextCategory,
    nowPlaying: nextCategory === GameCategory.LIBRARY
      ? nowPlaying ?? existingGame.nowPlaying ?? false
      : false
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
    const existingPrice = await prisma.gamePrice.findFirst({
      where: {
        gameId: id,
        platform: Platform.NINTENDO
      }
    })

    if (existingPrice) {
      // Update existing price record
      await prisma.gamePrice.update({
        where: { id: existingPrice.id },
        data: {
          externalId: nintendo.nsuid,
          storeUrl: nintendo.storeUrl || null,
          countryCode: nintendo.countryCode || null,
          currencyCode: nintendo.currencyCode || null,
          regularPrice: nintendo.regularPrice || null,
          currentPrice: nintendo.currentPrice || nintendo.regularPrice || null,
          lastFetchedAt: new Date()
        }
      })
    } else {
      // Create new price record
      await prisma.gamePrice.create({
        data: {
          gameId: id,
          platform: Platform.NINTENDO,
          externalId: nintendo.nsuid,
          storeUrl: nintendo.storeUrl || null,
          countryCode: nintendo.countryCode || null,
          currencyCode: nintendo.currencyCode || null,
          regularPrice: nintendo.regularPrice || null,
          currentPrice: nintendo.currentPrice || nintendo.regularPrice || null,
          lastFetchedAt: new Date()
        }
      })
    }
  } else {
    // If Nintendo data is not provided, check if a price record exists and delete it
    const existingPrice = await prisma.gamePrice.findFirst({
      where: {
        gameId: id,
        platform: Platform.NINTENDO
      }
    })

    if (existingPrice) {
      await prisma.gamePrice.delete({
        where: { id: existingPrice.id }
      })
    }
  }

  // Handle PlayStation price data
  if (playstation) {
    // Check if a PlayStation price record already exists for this game
    const existingPrice = await prisma.gamePrice.findFirst({
      where: {
        gameId: id,
        platform: Platform.PLAYSTATION
      }
    })

    if (existingPrice) {
      // Update existing price record
      await prisma.gamePrice.update({
        where: { id: existingPrice.id },
        data: {
          externalId: id, // Use game ID as external ID for PlayStation for now
          storeUrl: playstation.storeUrl || null,
          countryCode: playstation.countryCode || null,
          currencyCode: playstation.currencyCode || null,
          regularPrice: playstation.regularPrice || null,
          currentPrice:
            playstation.currentPrice || playstation.regularPrice || null,
          lastFetchedAt: new Date()
        }
      })
    } else {
      // Create new price record
      await prisma.gamePrice.create({
        data: {
          gameId: id,
          platform: Platform.PLAYSTATION,
          externalId: id, // Use game ID as external ID for PlayStation for now
          storeUrl: playstation.storeUrl || null,
          countryCode: playstation.countryCode || null,
          currencyCode: playstation.currencyCode || null,
          regularPrice: playstation.regularPrice || null,
          currentPrice:
            playstation.currentPrice || playstation.regularPrice || null,
          lastFetchedAt: new Date()
        }
      })
    }
  } else {
    // If PlayStation data is not provided, check if a price record exists and delete it
    const existingPrice = await prisma.gamePrice.findFirst({
      where: {
        gameId: id,
        platform: Platform.PLAYSTATION
      }
    })

    if (existingPrice) {
      await prisma.gamePrice.delete({
        where: { id: existingPrice.id }
      })
    }
  }

  // Revalidate both the old and new category pages in case the category changed
  revalidateGameCategory(existingGame.category)

  // If category changed, also revalidate the new category page
  if (updatedGame.category !== existingGame.category) {
    revalidateGameCategory(updatedGame.category)
  }

  return updatedGame
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
  revalidateGameCategory(oldCategory)

  // Revalidate the new category page if it's different
  if (toCategory !== oldCategory) {
    revalidateGameCategory(toCategory)
  }

  return updatedGame
}
