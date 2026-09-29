"use client"

import { Bell } from "lucide-react"
import { Link } from "../navigation"
import { useEffect, useState } from "react"
import { hasUnreadNotifications } from "@/server/actions/notifications"

export default function NotificationButton() {
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function getNotifications() {
      try {
        const result = await hasUnreadNotifications()

        if (!cancelled) {
          setHasUnread(result)
        }
      } catch (error) {
        console.error("Failed to check for unread notifications:", error)
      }
    }

    getNotifications()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <Link className="relative -mr-2 -mt-1 px-3 py-3" href="/notifications">
      <Bell strokeWidth={2.3} />
      {hasUnread ? (
        <span className="custom-fade-in absolute right-3 top-[9px] size-[10px] rounded-full bg-red-500" />
      ) : null}
    </Link>
  )
}
