"use server"

import prisma from "@/lib/prisma"
import { buildIGDBImageUrl } from "@/lib/igdb-store-links"
import { unstable_cache } from "next/cache"
import { GameCategory, GameOutput } from "@/types"

export const getCachedWishlistGames = async (userId: string) => {
  return unstable_cache(
    async () => {
      const games = await prisma.game.findMany({
        where: {
          userId,
          category: GameCategory.WISHLIST
        },
        orderBy: { updatedAt: "desc" },
        include: { trackedPrices: { orderBy: { fetchedAt: "desc" } } }
      })

      return games.map((game) => ({
        id: game.id,
        name: game.igdbName || "Untitled Game",
        length: game.length,
        category: game.category,
        coverImageUrl: game.igdbCoverImageId
          ? buildIGDBImageUrl(game.igdbCoverImageId)
          : null,
        createdAt: game.createdAt.toISOString(),
        updatedAt: game.updatedAt.toISOString(),
        prices: game.trackedPrices.map((price) => ({
          id: price.id,
          platform: price.platform,
          externalId: price.externalId,
          countryCode: price.countryCode,
          regularPrice: price.regularPrice?.toString() || null,
          currentPrice: price.currentPrice?.toString() || null,
          fetchedAt: price.fetchedAt?.toISOString() || null,
          createdAt: price.createdAt.toISOString(),
          updatedAt: price.updatedAt.toISOString()
        }))
      }))
    },
    [userId],
    {
      tags: [`user-wishlist-games-${userId}`, "wishlist"],
      revalidate: 10_800 // 3 hours
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
      revalidate: 10_800 // 3 hours
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
      revalidate: 10_800 // 3 hours
    }
  )()
}

export const getCachedGameDetail = async (
  gameId: string,
  userId: string
): Promise<GameOutput | null> => {
  return unstable_cache(
    async () => {
      return prisma.game.findFirst({
        where: { id: gameId, userId }
      })
    },
    [gameId, userId],
    {
      tags: [`game-detail-${gameId}`],
      revalidate: 10_800 // 3 hours
    }
  )()
}
