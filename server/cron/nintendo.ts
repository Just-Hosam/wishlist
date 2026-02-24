import prisma from "@/lib/prisma"
import { GameCategory, Platform } from "@/types"
import { getCachedNintendoPrice } from "../actions/nintendo"

export async function runNintendoPriceUpdate() {
  console.log("[CRON] Starting Nintendo price update job...")

  const nintendoPrices = await prisma.price.findMany({
    where: {
      platform: Platform.NINTENDO,
      trackedBy: {
        some: {
          category: GameCategory.WISHLIST
        }
      }
    },
    include: {
      trackedBy: true
    }
  })

  console.log(`[CRON] Processing ${nintendoPrices.length} wishlist games`)

  let updated = 0
  let errors = 0

  for (const gamePrice of nintendoPrices) {
    try {
      await getCachedNintendoPrice(gamePrice.storeUrl)

      updated++

      const randomDelay = Math.floor(Math.random() * 3000) + 2000
      await new Promise((resolve) => setTimeout(resolve, randomDelay))
    } catch (error) {
      console.error(`[CRON] Error updating game ID ${gamePrice.id}:`, error)
      errors++
    }
  }

  const result = {
    platform: "Nintendo",
    total: nintendoPrices.length,
    processed: nintendoPrices.length,
    updated,
    errors,
    timestamp: new Date().toISOString()
  }

  console.log("[CRON] Nintendo price update completed:", result)
  return result
}
