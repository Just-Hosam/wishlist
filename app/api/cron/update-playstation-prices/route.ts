import { requireCronAuth } from "@/server/cron/auth"
import { runPlayStationPriceUpdate } from "@/server/cron/playstation"
import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  revalidateTag("playstation-prices", "max")

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
