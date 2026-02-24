import { sleep } from "@/lib/utils"
import { requireCronAuth } from "@/server/cron/auth"
import { runCronStep } from "@/server/cron/utils"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  const invalidate = await runCronStep(request, {
    path: "/api/cron/update-prices/invalidate",
    step: "invalidate"
  })

  if (!invalidate.ok) {
    return NextResponse.json(
      {
        error: "Price cache invalidation failed",
        invalidate,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }

  await sleep(500)

  const refresh = await runCronStep(request, {
    path: "/api/cron/update-prices/refresh",
    step: "refresh"
  })

  if (!refresh.ok) {
    return NextResponse.json(
      {
        error: "Price refresh failed",
        invalidate,
        refresh,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }

  return NextResponse.json({
    invalidate,
    refresh,
    timestamp: new Date().toISOString()
  })
}
