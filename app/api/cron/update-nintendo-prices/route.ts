import { getNintendoGameInfo } from "@/lib/nintendo-price"
import prisma from "@/lib/prisma"
import { GameCategory, Platform } from "@/types"
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

export async function runNintendoPriceUpdate() {
  console.log("[CRON] Starting Nintendo price update job...")

  try {
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

    const batches = batchArr(nintendoPrices, BATCH_SIZE)

    console.log(
      `[CRON] Processing ${nintendoPrices.length} wishlist games in ${batches.length} batches`
    )

    let updated = 0
    let errors = 0

    for (const [batchIndex, batch] of batches.entries()) {
      console.log(
        `[CRON] Processing batch ${batchIndex + 1}/${batches.length} (${batch.length} games)`
      )

      for (const gamePrice of batch) {
        try {
          const nintendoData = await getNintendoGameInfo(gamePrice.storeUrl)

          if (nintendoData) {
            await prisma.price.update({
              where: { id: gamePrice.id },
              data: {
                regularPrice: nintendoData.regularPrice,
                currentPrice: nintendoData.currentPrice,
                fetchedAt: new Date(),
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
      platform: "Nintendo",
      total: nintendoPrices.length,
      processed: nintendoPrices.length,
      updated,
      errors,
      timestamp: new Date().toISOString()
    }

    console.log("[CRON] Nintendo price update completed:", result)
    return result
  } catch (error) {
    console.error("[CRON] Nintendo price update failed:", error)
    throw error
  }
}

export async function GET() {
  try {
    const result = await runNintendoPriceUpdate()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Nintendo price update failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
