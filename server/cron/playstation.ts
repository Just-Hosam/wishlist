import { getPlayStationGamePrice } from "@/lib/playstation/playstation-price"
import prisma from "@/lib/prisma"
import { GameCategory, Platform } from "@/types"

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

  const userAgents = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0"
  ]

  for (const [batchIndex, batch] of batches.entries()) {
    console.log(
      `[CRON] Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} games)`
    )

    for (const gamePrice of batch) {
      try {
        const randomUserAgent =
          userAgents[Math.floor(Math.random() * userAgents.length)]

        const playstationData = await getPlayStationGamePrice(
          gamePrice.storeUrl,
          { "User-Agent": randomUserAgent }
        )

        if (playstationData) {
          const currentPrice = playstationData.currentPrice
          const regularPrice = playstationData.regularPrice

          const hasInvalidPrice =
            currentPrice === null ||
            currentPrice === undefined ||
            regularPrice === null ||
            regularPrice === undefined ||
            isNaN(currentPrice) ||
            isNaN(regularPrice)

          if (hasInvalidPrice) {
            console.error(
              `[CRON] Invalid price data for game ID ${gamePrice.id}: currentPrice=${currentPrice}, regularPrice=${regularPrice}`
            )
            errors++
            continue
          }

          await prisma.price.update({
            where: { id: gamePrice.id },
            data: {
              regularPrice,
              currentPrice,
              fetchedAt: new Date(),
              updatedAt: new Date()
            }
          })

          updated++
        } else {
          errors++
        }

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
