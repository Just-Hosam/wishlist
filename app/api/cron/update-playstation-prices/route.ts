import { requireCronAuth } from "@/server/cron/auth"
import { runPlayStationPriceUpdate } from "@/server/cron/playstation"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  try {
    const result = await runPlayStationPriceUpdate()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        error: "PlayStation price update failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
