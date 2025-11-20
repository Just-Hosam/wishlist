import { PrismaClient } from "@prisma/client"
import { fetchGamesBatch } from "./fetch"
import { serializeGames } from "./serialize"

const START_OFFSET = 0
const MAX_BATCHES = Number.POSITIVE_INFINITY
const IGDB_RESULTS_PER_BATCH = 500
const IGDB_RATE_LIMIT_DELAY_MS = 2000

const prisma = new PrismaClient()
const failedOffsets: number[] = []

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const processBatch = async (offset: number): Promise<boolean> => {
  console.log(`🔄 [offset ${offset}] Fetching games...`)

  try {
    const games = await fetchGamesBatch(IGDB_RESULTS_PER_BATCH, offset)

    if (games.length === 0) {
      console.log(`⚠️ [offset ${offset}] No games returned. Stopping.`)
      return false
    }

    const serializedGames = serializeGames(games)

    try {
      const result = await prisma.iGDBGame.createMany({
        data: serializedGames,
        skipDuplicates: true
      })

      console.log(
        `✅ [offset ${offset}] Saved ${result.count} of ${serializedGames.length} games.`
      )
    } catch (error) {
      failedOffsets.push(offset)
      console.error(
        `❌ [offset ${offset}] Failed to write ${serializedGames.length} games.`,
        error
      )
    }

    return games.length === IGDB_RESULTS_PER_BATCH
  } catch (error) {
    failedOffsets.push(offset)
    console.error(`❌ [offset ${offset}] Failed to fetch games.`, error)
    return true
  }
}

const run = async (startOffset = START_OFFSET, maxBatches = MAX_BATCHES) => {
  let offset = startOffset
  let processedBatches = 0

  while (processedBatches < maxBatches) {
    const hasMore = await processBatch(offset)
    processedBatches += 1

    if (!hasMore) break
    offset += IGDB_RESULTS_PER_BATCH
    if (processedBatches >= MAX_BATCHES) break

    await sleep(IGDB_RATE_LIMIT_DELAY_MS)
  }

  if (failedOffsets.length > 0) {
    console.warn(
      `Completed with errors in ${failedOffsets.length} batch(es): ${failedOffsets.join(
        ", "
      )}`
    )
  } else {
    console.log("Completed IGDB ingestion without errors.")
  }
}

run()
  .catch((error) => {
    console.error("Fatal error while processing IGDB data:", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
