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

  console.log("[CRON] Starting combined price refresh job...")

  const settled = await Promise.allSettled(jobs.map((job) => job.run()))

  const results: Array<Record<string, unknown>> = []
  const errors: Array<{ platform: string; message: string }> = []

  for (let i = 0; i < settled.length; i++) {
    const result = settled[i]
    const job = jobs[i]

    if (result.status === "fulfilled") {
      results.push(result.value)
    } else {
      const message =
        result.reason instanceof Error ? result.reason.message : "Unknown error"
      console.error(
        `[CRON] ${job.platform} price update failed:`,
        result.reason
      )
      errors.push({ platform: job.platform, message })
    }
  }

  revalidateTag("wishlist")

  const status = errors.length > 0 ? 500 : 200

  return NextResponse.json(
    {
      ok: errors.length === 0,
      results,
      errors,
      timestamp: new Date().toISOString()
    },
    { status }
  )
}
