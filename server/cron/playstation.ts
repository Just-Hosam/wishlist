import prisma from "@/lib/prisma"
import { GameCategory, Platform } from "@/types"
import { getCachedPlaystationPrice } from "../actions/playstation"

const PLAYSTATION_BATCH_SIZE = 5

const batchArr = <T>(arr: T[], batchSize: number) => {
  const result: T[][] = []

  for (let i = 0; i < arr.length; i += batchSize) {
    const batch = arr.slice(i, i + batchSize)
    result.push(batch)
  }

  return result
}

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

  const batches = batchArr(playstationPrices, PLAYSTATION_BATCH_SIZE)

  console.log(
    `[CRON] Processing ${playstationPrices.length} wishlist games in ${batches.length} batches`
  )

  let updated = 0
  let errors = 0

  for (const [batchIndex, batch] of batches.entries()) {
    console.log(
      `[CRON] Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} games)`
    )

    for (const gamePrice of batch) {
      try {
        await getCachedPlaystationPrice(gamePrice.storeUrl)

        updated++

        const randomDelay = Math.floor(Math.random() * 3000) + 2000
        await new Promise((resolve) => setTimeout(resolve, randomDelay))
      } catch (error) {
        console.error(`[CRON] Error updating game ID ${gamePrice.id}:`, error)
        errors++
      }
    }

    if (batchIndex < batches.length - 1) {
      console.log(`[CRON] Waiting before next batch...`)
      await new Promise((resolve) => setTimeout(resolve, 3000))
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
