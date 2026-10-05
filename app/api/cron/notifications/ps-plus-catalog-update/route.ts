import { getCalendarDate } from "@/lib/utils"
import { requireCronAuth } from "@/server/cron/auth"
import { createPSPlusCatalogUpdateNotifications } from "@/server/cron/notifications"
import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  const now = new Date()
  const date = getCalendarDate(now, "America/Edmonton")

  const isSecondTuesdayOfMonth =
    date.weekday === "Tuesday" && date.day >= 8 && date.day <= 14
  if (!isSecondTuesdayOfMonth) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: "Not the second Tuesday of the month",
      timestamp: now.toISOString()
    })
  }

  try {
    const { count } = await createPSPlusCatalogUpdateNotifications()

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
      "[CRON] PlayStation Plus catalog update notification failed:",
      error
    )

    return NextResponse.json(
      {
        ok: false,
        error: "PlayStation Plus catalog update notification failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
