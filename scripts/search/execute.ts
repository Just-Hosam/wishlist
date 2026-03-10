import { PrismaClient } from "@prisma/client"
import { fetchSearchKeywordGamesBatch } from "./fetch"
import { serializeSearchKeywords } from "./serialize"
import { sleep } from "@/lib/utils"

const START_OFFSET = 0
const MAX_BATCHES = Number.POSITIVE_INFINITY
const IGDB_RESULTS_PER_BATCH = 500
const IGDB_RATE_LIMIT_DELAY_MS = 2000
const UPSERT_CHUNK_SIZE = 100

const prisma = new PrismaClient()
const failedOffsets: number[] = []

async function upsertSearchKeywordBatch(
  keywords: ReturnType<typeof serializeSearchKeywords>
) {
  for (let index = 0; index < keywords.length; index += UPSERT_CHUNK_SIZE) {
    const chunk = keywords.slice(index, index + UPSERT_CHUNK_SIZE)

    await prisma.$transaction(
      chunk.map((keyword) =>
        prisma.searchKeyword.upsert({
          where: { igdbId: keyword.igdbId },
          create: keyword,
          update: keyword
        })
      )
    )
  }
}

const processBatch = async (offset: number): Promise<boolean> => {
  console.log(`🔄 [offset ${offset}] Fetching search keywords...`)

  try {
    const games = await fetchSearchKeywordGamesBatch(
      IGDB_RESULTS_PER_BATCH,
      offset
    )

    if (games.length === 0) {
      console.log(`⚠️ [offset ${offset}] No games returned. Stopping.`)
      return false
    }

    const serializedKeywords = serializeSearchKeywords(games)

    try {
      await upsertSearchKeywordBatch(serializedKeywords)

      console.log(
        `✅ [offset ${offset}] Upserted ${serializedKeywords.length} search keywords.`
      )
    } catch (error) {
      failedOffsets.push(offset)
      console.error(
        `❌ [offset ${offset}] Failed to write ${serializedKeywords.length} search keywords.`,
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
    console.log("Completed IGDB search keyword ingestion without errors.")
  }
}

run()
  .catch((error) => {
    console.error("Fatal error while processing IGDB search keyword data:", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
