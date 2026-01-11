import { NextResponse } from "next/server"
import { runSteamPriceUpdate } from "@/server/cron/steam"

export async function GET() {
  try {
    const result = await runSteamPriceUpdate()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      {
        error: "Steam price update failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}
