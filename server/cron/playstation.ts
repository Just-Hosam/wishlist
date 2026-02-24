import prisma from "@/lib/prisma"
import { GameCategory, Platform } from "@/types"
import { getCachedPlaystationPrice } from "../actions/playstation"
import { sleep } from "@/lib/utils"

export async function runPlayStationPriceUpdate() {
  console.log("[CRON] Starting PlayStation price update job...")

  const playstationPrices = await prisma.price.findMany({
    where: {
      platform: Platform.PLAYSTATION,
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

  console.log(`[CRON] Processing ${playstationPrices.length} wishlist games`)

  let updated = 0
  let errors = 0

  for (const gamePrice of playstationPrices) {
    try {
      await getCachedPlaystationPrice(gamePrice.storeUrl)

      updated++

      const randomDelay = Math.floor(Math.random() * 400) + 600 // around 800ms
      await sleep(randomDelay)
    } catch (error) {
      console.error(`[CRON] Error updating game ID ${gamePrice.id}:`, error)
      errors++
    }
  }

  const result = {
    platform: "PlayStation",
    total: playstationPrices.length,
    processed: playstationPrices.length,
    updated,
    errors,
    timestamp: new Date().toISOString()
  }

  console.log("[CRON] PlayStation price update completed:", result)
  return result
}
