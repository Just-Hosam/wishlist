import { getCalendarDate, tryCatch } from "@/lib/utils"
import { requireCronAuth } from "@/server/cron/auth"
import { createPSPlusMonthlyGameNotifications } from "@/server/cron/notifications"
import { sendPushNotificationsForUsers } from "@/server/cron/push-notifications"
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

  const { data: notifications, error: creationError } = await tryCatch(
    createPSPlusMonthlyGameNotifications()
  )

  if (creationError) {
    console.error(
      "[CRON] PlayStation Plus monthly games notification failed:",
      creationError
    )

    return NextResponse.json(
      {
        ok: false,
        error: "PlayStation Plus monthly games notification failed",
        details:
          creationError instanceof Error
            ? creationError.message
            : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }

  const { count, userIds, payload } = notifications

  revalidateTag("notification", { expire: 0 })

  const push = await sendPushNotificationsForUsers(userIds, payload)

  if (push) {
    console.info(
      `[PUSH] Accepted ${push.accepted} notifications, failed ${push.failed}`
    )
  }

  return NextResponse.json({
    ok: true,
    skipped: false,
    created: count,
    timestamp: now.toISOString()
  })
}
