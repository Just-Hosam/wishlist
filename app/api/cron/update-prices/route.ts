import { requireCronAuth } from "@/server/cron/auth"
import { runNintendoPriceUpdate } from "@/server/cron/nintendo"
import { runPlayStationPriceUpdate } from "@/server/cron/playstation"
import { runSteamPriceUpdate } from "@/server/cron/steam"
import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

const jobs = [
  { platform: "PlayStation", run: runPlayStationPriceUpdate },
  { platform: "Steam", run: runSteamPriceUpdate },
  { platform: "Nintendo", run: runNintendoPriceUpdate }
]

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  console.log("[CRON] Starting combined price update job...")

  const results: Array<Record<string, unknown>> = []
  const errors: Array<{ platform: string; message: string }> = []

  for (const job of jobs) {
    try {
      const result = await job.run()
      results.push(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error"
      console.error(
        `[CRON] ${job.platform} price update failed in combined job:`,
        error
      )
      errors.push({ platform: job.platform, message })
    }
  }

  revalidateTag("prices")
  revalidateTag("wishlist")

  const status = errors.length ? 500 : 200

  return NextResponse.json(
    {
      results,
      errors,
      timestamp: new Date().toISOString()
    },
    { status }
  )
}
