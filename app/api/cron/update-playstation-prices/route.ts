import { NextResponse } from "next/server"
import { runPlayStationPriceUpdate } from "@/server/cron/playstation"

export async function GET() {
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
