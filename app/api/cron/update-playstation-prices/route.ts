import { getPlayStationGamePrice } from "@/lib/playstation-price"
import prisma from "@/lib/prisma"
import { Platform, GameCategory } from "@prisma/client"
import { NextResponse } from "next/server"

const BATCH_SIZE = 5

const batchArr = (arr: any[], batchSize: number) => {
  const result = []

  for (let i = 0; i < arr.length; i += batchSize) {
    const batch = arr.slice(i, i + batchSize)
    result.push(batch)
  }

  return result
}

export async function GET() {
  console.log("[CRON] Starting PlayStation price update job...")

  try {
    const playstationPrices = await prisma.gamePrice.findMany({
      where: {
        platform: Platform.PLAYSTATION,
        game: {
          category: GameCategory.WISHLIST
        }
      },
      include: {
        game: true
      }
    })

    const batches = batchArr(playstationPrices, BATCH_SIZE)

    console.log(
      `[CRON] Processing ${playstationPrices.length} wishlist games in ${batches.length} batches`
    )

    let updated = 0
    let errors = 0

    // User-Agent rotation
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
          // Random User-Agent for each request
          const randomUserAgent =
            userAgents[Math.floor(Math.random() * userAgents.length)]

          const playstationData = await getPlayStationGamePrice(
            gamePrice.storeUrl!,
            { "User-Agent": randomUserAgent }
          )

          if (playstationData) {
            // Convert prices to Decimal (remove currency symbols and parse)
            const currentPrice = parseFloat(
              playstationData.currentPrice.replace(/[^0-9.-]/g, "")
            )
            const regularPrice = parseFloat(
              playstationData.basePrice.replace(/[^0-9.-]/g, "")
            )

            // Validate that prices are valid numbers
            if (isNaN(currentPrice) || isNaN(regularPrice)) {
              console.error(
                `[CRON] Invalid price data for game ID ${gamePrice.id}: currentPrice=${currentPrice}, regularPrice=${regularPrice}`
              )
              errors++
              continue
            }

            await prisma.gamePrice.update({
              where: { id: gamePrice.id },
              data: {
                regularPrice,
                currentPrice,
                currencyCode: playstationData.currency,
                lastFetchedAt: new Date(),
                updatedAt: new Date()
              }
            })

            updated++
          } else {
            errors++
          }

          // Randomized delay: 2-5 seconds between requests
          const randomDelay = Math.floor(Math.random() * 3000) + 2000
          await new Promise((resolve) => setTimeout(resolve, randomDelay))
        } catch (error) {
          console.error(`[CRON] Error updating game ID ${gamePrice.id}:`, error)
          errors++
        }
      }

      // Add delay between batches
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
    return NextResponse.json(result)
  } catch (error) {
    console.error("[CRON] PlayStation price update failed:", error)
    return NextResponse.json(
      {
        error: "PlayStation price update failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
