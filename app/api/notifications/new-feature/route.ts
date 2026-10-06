import { requireCronAuth } from "@/server/cron/auth"
import { createNewFeatureNotifications } from "@/server/cron/notifications"
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

  try {
    const { count } = await createNewFeatureNotifications({
      eventKey,
      title,
      message
    })

    revalidateTag("notification", { expire: 0 })

    return NextResponse.json({
      ok: true,
      created: count,
      eventKey,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("[NOTIFICATIONS] New feature notification failed:", error)

    return NextResponse.json(
      {
        ok: false,
        error: "New feature notification failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
