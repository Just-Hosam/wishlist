"use client"

import { createContext, ReactNode, useContext, useState } from "react"

type TabType = "WISHLIST" | "LIBRARY" | "MORE"

interface TabContextType {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
  reset: () => void
}

const TabContext = createContext<TabContextType | undefined>(undefined)

export function TabProvider({
  children,
  initial = "WISHLIST" as TabType
}: {
  children: ReactNode
  initial?: TabType
}) {
  const [activeTab, setActiveTab] = useState<TabType>(initial)

  const reset = () => setActiveTab("WISHLIST")

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab, reset }}>
      {children}
    </TabContext.Provider>
  )
}

export function useTabContext() {
  const context = useContext(TabContext)
  if (!context) {
    throw new Error("useTabContext must be used within a TabProvider")
  }
  return context
}
