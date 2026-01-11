import { NextResponse } from "next/server"
import { runNintendoPriceUpdate } from "@/server/cron/nintendo"

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
