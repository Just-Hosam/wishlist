"use server"

import prisma from "@/lib/prisma"
import { buildIGDBImageUrl } from "@/lib/igdb-store-links"
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
        name: game.igdbName || "Untitled Game",
        length: game.length,
        category: game.category,
        coverImageUrl: game.igdbCoverImageId
          ? buildIGDBImageUrl(game.igdbCoverImageId, "t_720p")
          : null,
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
        name: game.igdbName || "Untitled Game",
        length: game.length,
        category: game.category,
        coverImageUrl: game.igdbCoverImageId
          ? buildIGDBImageUrl(game.igdbCoverImageId)
          : null,
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
        name: game.igdbName || "Untitled Game",
        length: game.length,
        category: game.category,
        coverImageUrl: game.igdbCoverImageId
          ? buildIGDBImageUrl(game.igdbCoverImageId)
          : null,
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
