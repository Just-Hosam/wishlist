import { requireCronAuth } from "@/server/cron/auth"
import { runNintendoPriceUpdate } from "@/server/cron/nintendo"
import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  try {
    const result = await runNintendoPriceUpdate()

    revalidateTag("nintendo-prices")

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
