"use server"

import prisma from "@/lib/prisma"
import { GameCategory } from "@prisma/client"
import { unstable_cache } from "next/cache"

export const getCachedWishlistGames = async (userId: string) => {
  return unstable_cache(
    async () => {
      const games = await prisma.game.findMany({
        where: {
          userId,
          category: GameCategory.WISHLIST
        },
        orderBy: { updatedAt: "desc" },
        include: { prices: { orderBy: { lastFetchedAt: "desc" } } }
      })

      return games.map((game) => ({
        id: game.id,
        name: game.name,
        length: game.length,
        category: game.category,
        coverImageUrl: game.coverImageUrl,
        createdAt: game.createdAt.toISOString(),
        updatedAt: game.updatedAt.toISOString(),
        prices: game.prices.map((price) => ({
          id: price.id,
          gameId: price.gameId,
          platform: price.platform,
          externalId: price.externalId,
          countryCode: price.countryCode,
          currencyCode: price.currencyCode,
          regularPrice: price.regularPrice?.toString() || null,
          currentPrice: price.currentPrice?.toString() || null,
          lastFetchedAt: price.lastFetchedAt?.toISOString() || null,
          createdAt: price.createdAt.toISOString(),
          updatedAt: price.updatedAt.toISOString()
        }))
      }))
    },
    [userId],
    {
      tags: [`user-wishlist-games-${userId}`],
      revalidate: 1800 // 30 minutes
    }
  )()
}

export const getCachedLibraryGames = async (userId: string) => {
  return unstable_cache(
    async () => {
      const games = await prisma.game.findMany({
        where: {
          userId,
          category: GameCategory.LIBRARY
        },
        orderBy: [{ nowPlaying: "desc" }, { updatedAt: "desc" }]
      })

      return games.map((game) => ({
        id: game.id,
        name: game.name,
        length: game.length,
        category: game.category,
        coverImageUrl: game.coverImageUrl,
        platforms: game.platforms,
        nowPlaying: game.nowPlaying,
        createdAt: game.createdAt.toISOString(),
        updatedAt: game.updatedAt.toISOString()
      }))
    },
    [userId],
    {
      tags: [`user-library-games-${userId}`],
      revalidate: 1800 // 30 minutes
    }
  )()
}

export const getCachedCompletedGames = async (userId: string) => {
  return unstable_cache(
    async () => {
      const games = await prisma.game.findMany({
        where: {
          userId,
          category: GameCategory.COMPLETED
        },
        orderBy: { updatedAt: "desc" }
      })

      return games.map((game) => ({
        id: game.id,
        name: game.name,
        length: game.length,
        category: game.category,
        coverImageUrl: game.coverImageUrl,
        platforms: game.platforms,
        createdAt: game.createdAt.toISOString(),
        updatedAt: game.updatedAt.toISOString()
      }))
    },
    [userId],
    {
      tags: [`user-completed-games-${userId}`],
      revalidate: 1800 // 30 minutes
    }
  )()
}

export const getCachedArchivedGames = async (userId: string) => {
  return unstable_cache(
    async () => {
      const games = await prisma.game.findMany({
        where: {
          userId,
          category: GameCategory.ARCHIVED
        },
        orderBy: { updatedAt: "desc" }
      })

      return games.map((game) => ({
        id: game.id,
        name: game.name,
        length: game.length,
        category: game.category,
        coverImageUrl: game.coverImageUrl,
        platforms: game.platforms,
        createdAt: game.createdAt.toISOString(),
        updatedAt: game.updatedAt.toISOString()
      }))
    },
    [userId],
    {
      tags: [`user-archived-games-${userId}`],
      revalidate: 1800 // 30 minutes
    }
  )()
}
