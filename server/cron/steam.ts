import prisma from "@/lib/prisma"
import { GameCategory, Platform } from "@/types"

const BATCH_SIZE = 10
const COUNTRY_PARAM = "ca"
const LANGUAGE_PARAM = "en"
const COUNTRY_CODE = "CA"

const chunk = <T>(items: T[], size: number) => {
  const batches: T[][] = []

  for (let i = 0; i < items.length; i += size) {
    batches.push(items.slice(i, i + size))
  }

  return batches
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function runSteamPriceUpdate() {
  console.log("[CRON] Starting Steam price update job...")

  const steamPrices = await prisma.price.findMany({
    where: {
      platform: Platform.PC,
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

  const pricesWithExternalId = steamPrices.filter(
    (price) => price.externalId !== null && price.externalId !== undefined
  )

  const batches = chunk(pricesWithExternalId, BATCH_SIZE)

  console.log(
    `[CRON] Processing ${pricesWithExternalId.length} wishlist games in ${batches.length} batches`
  )

  let updated = 0
  let errors = 0

  for (const [batchIndex, batch] of batches.entries()) {
    const appIds = batch
      .map((price) => price.externalId)
      .filter(Boolean) as string[]

    if (appIds.length === 0) {
      errors += batch.length
      continue
    }

    console.log(
      `[CRON] Processing batch ${batchIndex + 1}/${batches.length} (${appIds.length} app ids)`
    )

    const apiUrl = `https://store.steampowered.com/api/appdetails?appids=${appIds.join(",")}&cc=${COUNTRY_PARAM}&l=${LANGUAGE_PARAM}&filters=price_overview`

    try {
      const response = await fetch(apiUrl, {
        headers: {
          Accept: "application/json"
        }
      })

      if (!response.ok) {
        throw new Error(`Steam API returned ${response.status}`)
      }

      const data = await response.json()

      for (const priceRecord of batch) {
        const appId = priceRecord.externalId
        if (!appId) {
          errors++
          continue
        }

        const appData = data?.[appId]
        const priceOverview = appData?.data?.price_overview

        if (!appData?.success || !priceOverview) {
          errors++
          continue
        }

        const regularPrice = priceOverview.initial / 100
        const currentPrice = priceOverview.final / 100

        const hasInvalidPrice =
          regularPrice === null ||
          regularPrice === undefined ||
          Number.isNaN(regularPrice) ||
          currentPrice === null ||
          currentPrice === undefined ||
          Number.isNaN(currentPrice)

        if (hasInvalidPrice) {
          console.error(
            `[CRON] Invalid price data for app ${appId}: currentPrice=${currentPrice}, regularPrice=${regularPrice}`
          )
          errors++
          continue
        }

        await prisma.price.update({
          where: { id: priceRecord.id },
          data: {
            regularPrice,
            currentPrice,
            countryCode: COUNTRY_CODE,
            fetchedAt: new Date(),
            updatedAt: new Date(),
            externalId: appId
          }
        })

        updated++
      }
    } catch (error) {
      console.error(
        `[CRON] Error processing batch ${batchIndex + 1}/${batches.length}:`,
        error
      )
      errors += batch.length
    }

    if (batchIndex < batches.length - 1) {
      const delay = Math.floor(Math.random() * 2000) + 2000
      console.log(`[CRON] Waiting ${delay}ms before next batch...`)
      await sleep(delay)
    }
  }

  const skipped = steamPrices.length - pricesWithExternalId.length

  const result = {
    platform: "Steam",
    total: steamPrices.length,
    processed: pricesWithExternalId.length,
    updated,
    errors,
    skipped,
    timestamp: new Date().toISOString()
  }

  console.log("[CRON] Steam price update completed:", result)
  return result
}
