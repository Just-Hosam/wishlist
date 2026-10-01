"use client"

import { tryCatch } from "@/lib/utils"
import { getNotifications } from "@/server/actions/notifications"
import { Bell } from "lucide-react"
import { useEffect } from "react"
import { Link } from "../navigation"
import { useNotification } from "./NotificationProvider"

export default function NotificationButton() {
  const { hasUnread, setHasUnread } = useNotification()

  useEffect(() => {
    let cancelled = false

    async function checkNotifications() {
      const { data: notifications, error } = await tryCatch(getNotifications())

      if (error) {
        console.error("Failed to check notifications:", error)
        return
      }

      if (!cancelled) {
        setHasUnread(
          notifications.some((notification) => notification.readAt === null)
        )
      }
    }

    checkNotifications()

    return () => {
      cancelled = true
    }
  }, [setHasUnread])

  return (
    <Link className="relative -mr-2 -mt-1 px-3 py-3" href="/notifications">
      <Bell strokeWidth={2.3} />
      {hasUnread ? (
        <span className="absolute right-3 top-[9px] size-[10px] rounded-full bg-red-500" />
      ) : null}
    </Link>
  )
}
