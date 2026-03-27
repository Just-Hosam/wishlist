import prisma from "@/lib/prisma"
import { GameCategory, Platform } from "@/types"
import { getCachedPlaystationPrice } from "../actions/playstation"
import { sleep } from "@/lib/utils"

const BATCH_SIZE = 3

const chunk = <T>(items: T[], size: number) => {
  const batches: T[][] = []

  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size))
  }

  return batches
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

  const batches = chunk(playstationPrices, BATCH_SIZE)

  console.log(
    `[CRON] Processing ${playstationPrices.length} wishlist games in ${batches.length} batches`
  )

  let updated = 0
  let errors = 0

  for (const [batchIndex, batch] of batches.entries()) {
    console.log(
      `[CRON] Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} store urls)`
    )

    const results = await Promise.allSettled(
      batch.map((gamePrice) => getCachedPlaystationPrice(gamePrice.storeUrl))
    )

    for (const [resultIndex, result] of results.entries()) {
      if (result.status === "fulfilled") {
        updated++
        continue
      }

      console.error(
        `[CRON] Error updating game ID ${batch[resultIndex].id}:`,
        result.reason
      )
      errors++
    }

    if (batchIndex < batches.length - 1) {
      const delay = Math.floor(Math.random() * 400) + 600 // around 800ms
      console.log(`[CRON] Waiting ${delay}ms before next batch...`)
      await sleep(delay)
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
