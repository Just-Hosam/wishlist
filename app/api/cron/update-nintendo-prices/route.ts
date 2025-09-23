import { getNintendoGameInfo } from "@/lib/nintendo-price"
import prisma from "@/lib/prisma"
import { Platform, GameCategory } from "@prisma/client"
import { NextResponse } from "next/server"

const BATCH_SIZE = 5

export async function POST() {
  console.log("[CRON] Starting Nintendo price update job...")

  try {
    const nintendoPrices = await prisma.gamePrice.findMany({
      where: {
        platform: Platform.NINTENDO,
        game: {
          category: GameCategory.WISHLIST
        }
      },
      include: {
        game: true
      }
    })

    const batch = nintendoPrices.slice(0, BATCH_SIZE)

    console.log(
      `[CRON] Processing ${batch.length} of ${nintendoPrices.length} wishlist games`
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

    for (const gamePrice of batch) {
      try {
        // Random User-Agent for each request
        const randomUserAgent =
          userAgents[Math.floor(Math.random() * userAgents.length)]

        const nintendoData = await getNintendoGameInfo(gamePrice.storeUrl!)

        if (nintendoData) {
          // Use discounted price if on sale, otherwise use regular price
          const currentPrice = nintendoData.onSale
            ? parseFloat(nintendoData.discounted_price_value!)
            : parseFloat(nintendoData.raw_price_value)
          const regularPrice = parseFloat(nintendoData.raw_price_value)

          await prisma.gamePrice.update({
            where: { id: gamePrice.id },
            data: {
              regularPrice,
              currentPrice,
              currencyCode: nintendoData.currency,
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

    const result = {
      platform: "Nintendo",
      total: nintendoPrices.length,
      processed: batch.length,
      updated,
      errors,
      timestamp: new Date().toISOString()
    }

    console.log("[CRON] Nintendo price update completed:", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[CRON] Nintendo price update failed:", error)
    return NextResponse.json(
      {
        error: "Nintendo price update failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
