"use server"

import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { GameCategory, Platform } from "@prisma/client"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

interface GameData {
  name: string
  length?: string
  category: GameCategory
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

export async function deleteGame(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Unauthorized.")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

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

  await prisma.game.delete({
    where: {
      id: game.id
    }
  })

  if (game.category === GameCategory.WISHLIST) {
    revalidatePath("/(lists)/wishlist")
  }
  if (game.category === GameCategory.LIBRARY) {
    revalidatePath("/(lists)/library")
  }
  if (game.category === GameCategory.COMPLETED) {
    revalidatePath("/(lists)/completed")
  }
  if (game.category === GameCategory.ARCHIVED) {
    revalidatePath("/(lists)/archived")
  }
}

export async function createGame(data: GameData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Unauthorized.")
  }

  const { name, length, category, nintendo, playstation } = data

  // Validate required fields
  if (!name || !category) {
    throw new Error("Missing required fields: name and category are required.")
  }

  // Validate category
  if (!Object.values(GameCategory).includes(category)) {
    throw new Error("Invalid game category.")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    throw new Error("User not found.")
  }

  // Create the game
  const game = await prisma.game.create({
    data: {
      name,
      length: length ? parseInt(length) : null,
      category: category || GameCategory.WISHLIST,
      userId: user.id
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

  // If PlayStation data is provided, create a GamePrice record
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
  if (game.category === GameCategory.WISHLIST) {
    revalidatePath("/(lists)/wishlist")
  }
  if (game.category === GameCategory.LIBRARY) {
    revalidatePath("/(lists)/library")
  }
  if (game.category === GameCategory.COMPLETED) {
    revalidatePath("/(lists)/completed")
  }
  if (game.category === GameCategory.ARCHIVED) {
    revalidatePath("/(lists)/archived")
  }

  return game
}

export async function updateGame(id: string, data: GameData) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Unauthorized.")
  }

  const { name, length, category, nintendo, playstation } = data

  // Validate required fields
  if (!name) {
    throw new Error("Game name is required.")
  }

  // Validate category
  if (category && !Object.values(GameCategory).includes(category)) {
    throw new Error("Invalid game category.")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
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

  // Update the game
  const updatedGame = await prisma.game.update({
    where: { id },
    data: {
      name,
      length: length ? parseInt(length) : null,
      category: category || existingGame.category
    }
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
  }

  // Revalidate both the old and new category pages in case the category changed
  if (existingGame.category === GameCategory.WISHLIST) {
    revalidatePath("/(lists)/wishlist")
  }
  if (existingGame.category === GameCategory.LIBRARY) {
    revalidatePath("/(lists)/library")
  }
  if (existingGame.category === GameCategory.COMPLETED) {
    revalidatePath("/(lists)/completed")
  }
  if (existingGame.category === GameCategory.ARCHIVED) {
    revalidatePath("/(lists)/archived")
  }

  // If category changed, also revalidate the new category page
  if (updatedGame.category !== existingGame.category) {
    if (updatedGame.category === GameCategory.WISHLIST) {
      revalidatePath("/(lists)/wishlist")
    }
    if (updatedGame.category === GameCategory.LIBRARY) {
      revalidatePath("/(lists)/library")
    }
    if (updatedGame.category === GameCategory.COMPLETED) {
      revalidatePath("/(lists)/completed")
    }
    if (updatedGame.category === GameCategory.ARCHIVED) {
      revalidatePath("/(lists)/archived")
    }
  }

  return updatedGame
}

export async function moveGame(gameId: string, toCategory: GameCategory) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Unauthorized.")
  }

  if (!gameId) {
    throw new Error("Game ID is required.")
  }

  if (!Object.values(GameCategory).includes(toCategory)) {
    throw new Error("Invalid category.")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
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
      category: toCategory
    }
  })

  // Revalidate both the old and new category pages
  if (oldCategory === GameCategory.WISHLIST) {
    revalidatePath("/(lists)/wishlist")
  }
  if (oldCategory === GameCategory.LIBRARY) {
    revalidatePath("/(lists)/library")
  }
  if (oldCategory === GameCategory.COMPLETED) {
    revalidatePath("/(lists)/completed")
  }
  if (oldCategory === GameCategory.ARCHIVED) {
    revalidatePath("/(lists)/archived")
  }

  // Revalidate the new category page if it's different
  if (toCategory !== oldCategory) {
    if (toCategory === GameCategory.WISHLIST) {
      revalidatePath("/(lists)/wishlist")
    }
    if (toCategory === GameCategory.LIBRARY) {
      revalidatePath("/(lists)/library")
    }
    if (toCategory === GameCategory.COMPLETED) {
      revalidatePath("/(lists)/completed")
    }
    if (toCategory === GameCategory.ARCHIVED) {
      revalidatePath("/(lists)/archived")
    }
  }

  return updatedGame
}
