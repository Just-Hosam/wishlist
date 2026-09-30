"use client"

import { hasUnreadNotifications } from "@/server/actions/notifications"
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react"

interface NotificationContextType {
  hasUnread: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function checkForUnreadNotifications() {
      try {
        const result = await hasUnreadNotifications()

        console.log("GET NOTIFICATIONS")

        if (!cancelled) setHasUnread(result)
      } catch (error) {
        console.error("Failed to check for unread notifications:", error)
      }
    }

    checkForUnreadNotifications()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <NotificationContext.Provider value={{ hasUnread }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider")
  }

  return context
}
