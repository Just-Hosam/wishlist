"use server"

import { buildIGDBImageUrl } from "@/lib/igdb-store-links"
import prisma from "@/lib/prisma"
import { GameCategory } from "@/types"
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
        include: { trackedPrices: { orderBy: { fetchedAt: "desc" } } }
      })

      return games.map(({ trackedPrices, ...game }) => ({
        ...game,
        name: game.igdbName || "Untitled Game",
        coverImageUrl: game.igdbCoverImageId
          ? buildIGDBImageUrl(game.igdbCoverImageId)
          : null,
        prices: trackedPrices.map((price) => ({
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
      revalidate: 30 * 60 // 30 minutes
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
        ...game,
        name: game.igdbName || "Untitled Game",
        coverImageUrl: game.igdbCoverImageId
          ? buildIGDBImageUrl(game.igdbCoverImageId)
          : null
      }))
    },
    [userId],
    {
      tags: [`user-library-games-${userId}`],
      revalidate: 30 * 60 // 30 minutes
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
        ...game,
        name: game.igdbName || "Untitled Game",
        coverImageUrl: game.igdbCoverImageId
          ? buildIGDBImageUrl(game.igdbCoverImageId)
          : null,
        releaseDate: game.igdbFirstReleaseDate
      }))
    },
    [userId],
    {
      tags: [`user-completed-games-${userId}`],
      revalidate: 30 * 60 // 30 minutes
    }
  )()
}
