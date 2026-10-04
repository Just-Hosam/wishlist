import { getCalendarDate } from "@/lib/utils"
import { requireCronAuth } from "@/server/cron/auth"
import { createPSPlusMonthlyGameNotifications } from "@/server/cron/notifications"
import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  const now = new Date()
  const date = getCalendarDate(now, "America/Edmonton")

  const isFirstTuesdayOfMonth = date.weekday === "Tuesday" && date.day <= 7
  if (!isFirstTuesdayOfMonth) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "Not the first Tuesday of the month",
      timestamp: now.toISOString()
    })
  }

  try {
    const { count } = await createPSPlusMonthlyGameNotifications()

    if (count > 0) {
      revalidateTag("notification", { expire: 0 })
    }

    return NextResponse.json({
      ok: true,
      skipped: false,
      created: count,
      timestamp: now.toISOString()
    })
  } catch (error) {
    console.error(
      "[CRON] PlayStation Plus monthly games notification failed:",
      error
    )

    return NextResponse.json(
      {
        ok: false,
        error: "PlayStation Plus monthly games notification failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
