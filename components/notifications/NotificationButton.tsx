"use client"

import { Bell } from "lucide-react"
import { useEffect } from "react"
import { Link } from "../navigation"
import { useNotification } from "./NotificationProvider"

export default function NotificationButton() {
  const { hasUnread, setHasUnread } = useNotification()

  useEffect(() => {
    let cancelled = false

    async function checkNotifications() {
      try {
        const response = await fetch("/api/notifications", {
          cache: "no-store"
        })

        if (!response.ok) {
          throw new Error(
            `Notification check failed with status ${response.status}`
          )
        }

        const data = (await response.json()) as { hasUnread: boolean }

        if (!cancelled) setHasUnread(data.hasUnread)
      } catch (error) {
        console.error("Failed to check notifications:", error)
      }
    }

    void checkNotifications()

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
