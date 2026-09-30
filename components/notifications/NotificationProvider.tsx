"use client"

import { hasUnreadNotifications } from "@/server/actions/notifications"
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react"

interface NotificationContextType {
  hasUnread: boolean
  clearUnread: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [hasUnread, setHasUnread] = useState(false)

  const clearUnread = useCallback(() => {
    setHasUnread(false)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function checkForUnreadNotifications() {
      try {
        const result = await hasUnreadNotifications()

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
    <NotificationContext.Provider value={{ hasUnread, clearUnread }}>
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
