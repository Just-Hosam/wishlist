import { tryCatch } from "@/lib/utils"
import { requireCronAuth } from "@/server/cron/auth"
import { createNewFeatureNotifications } from "@/server/cron/notifications"
import { sendPushNotificationsForUsers } from "@/server/cron/push-notifications"
import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  const body = (await request.json().catch(() => null)) as {
    eventKey?: unknown
    title?: unknown
    message?: unknown
  } | null

  const eventKey =
    typeof body?.eventKey === "string" ? body.eventKey.trim() : ""
  const title = typeof body?.title === "string" ? body.title.trim() : ""
  const message = typeof body?.message === "string" ? body.message.trim() : ""

  if (!eventKey || !title || !message) {
    return NextResponse.json(
      { error: "eventKey, title, and message are required" },
      { status: 400 }
    )
  }

  const { data: notifications, error: creationError } = await tryCatch(
    createNewFeatureNotifications({ eventKey, title, message })
  )

  if (creationError) {
    console.error("[NOTIFICATIONS] Creation failed:", creationError)

    return NextResponse.json(
      {
        ok: false,
        error: "New feature notification failed",
        details:
          creationError instanceof Error
            ? creationError.message
            : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }

  revalidateTag("notification", { expire: 0 })

  const push = await sendPushNotificationsForUsers(notifications.userIds, {
    title,
    message
  })

  if (push) {
    console.info(
      `[PUSH] Accepted ${push.accepted} notifications, failed ${push.failed}`
    )
  }

  return NextResponse.json({
    ok: true,
    created: notifications.count,
    eventKey,
    timestamp: new Date().toISOString()
  })
}
