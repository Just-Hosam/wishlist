import { auth } from "@/auth"
import { getCachedNotifications } from "@/server/actions/notifications"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    return NextResponse.json(
      { hasUnread: false },
      { headers: { "Cache-Control": "no-store" } }
    )
  }

  const notifications = await getCachedNotifications(userId)
  const hasUnread = notifications.some(
    (notification) => notification.readAt === null
  )

  return NextResponse.json(
    { hasUnread },
    { headers: { "Cache-Control": "no-store" } }
  )
}
