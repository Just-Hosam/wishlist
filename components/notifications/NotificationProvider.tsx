"use client"

import { createContext, ReactNode, useContext, useState } from "react"

interface NotificationContextType {
  hasUnread: boolean
  setHasUnread: (hasUnread: boolean) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [hasUnread, setHasUnread] = useState(false)

  return (
    <NotificationContext.Provider value={{ hasUnread, setHasUnread }}>
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
