"use client"

import { markNotificationsAsRead } from "@/server/actions/notifications"
import { useEffect } from "react"
import { useNotification } from "./NotificationProvider"
import { tryCatch } from "@/lib/utils"

export default function MarkNotificationsAsRead() {
  const { clearUnread } = useNotification()

  useEffect(() => {
    async function markAsRead() {
      const { error } = await tryCatch(markNotificationsAsRead())

      if (error) {
        console.error("Failed to mark notifications as read:", error)
        return
      }

      clearUnread()
    }

    markAsRead()
  }, [clearUnread])

  return null
}
