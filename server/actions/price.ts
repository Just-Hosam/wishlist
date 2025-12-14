"use server"

import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { PriceInput, PriceOutput } from "@/types"
import { getServerSession } from "next-auth"

export async function getPrice(url: string): Promise<PriceOutput | null> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) throw new Error("Unauthorized.")
  if (!url) throw new Error("URL is required")

  const price = (await prisma.price.findFirst({
    where: { storeUrl: url }
  })) as PriceOutput | null

  if (!price) return null

  const now = new Date()
  const lastChecked = price.fetchedAt || new Date(0)
  const fourAMToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    4
  )
  const isStale = lastChecked < fourAMToday

  if (isStale) return null

  return price
}

export async function savePrice(priceData: PriceInput): Promise<PriceOutput> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  if (!userId) throw new Error("Unauthorized.")

  const price = await prisma.price.upsert({
    where: { storeUrl: priceData.storeUrl },
    update: {
      regularPrice: priceData.regularPrice,
      currentPrice: priceData.currentPrice,
      description: priceData.description,
      countryCode: priceData.countryCode,
      externalId: priceData.externalId,
      fetchedAt: new Date(),
      updatedAt: new Date()
    },
    create: {
      storeUrl: priceData.storeUrl,
      platform: priceData.platform,
      regularPrice: priceData.regularPrice,
      currentPrice: priceData.currentPrice,
      description: priceData.description,
      countryCode: priceData.countryCode,
      externalId: priceData.externalId,
      fetchedAt: new Date()
    }
  })

  return price as PriceOutput
}

export async function linkPriceToGame(
  gameId: string,
  url: string
): Promise<void> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) throw new Error("Unauthorized.")

  // Verify the game belongs to the user
  const game = await prisma.game.findFirst({
    where: { id: gameId, userId }
  })

  if (!game) throw new Error("Game not found or unauthorized.")

  await prisma.price.update({
    where: { storeUrl: url },
    data: {
      trackedBy: {
        connect: { id: gameId }
      },
      updatedAt: new Date()
    }
  })
}

export async function unlinkPriceFromGame(
  gameId: string,
  url: string
): Promise<void> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) throw new Error("Unauthorized.")

  // Verify the game belongs to the user
  const game = await prisma.game.findFirst({
    where: { id: gameId, userId }
  })

  if (!game) throw new Error("Game not found or unauthorized.")

  await prisma.price.update({
    where: { storeUrl: url },
    data: {
      trackedBy: {
        disconnect: { id: gameId }
      },
      updatedAt: new Date()
    }
  })
}
