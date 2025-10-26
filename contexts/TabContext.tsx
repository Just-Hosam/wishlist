"use client"

import { GameCategory } from "@/types/game"
import { createContext, useContext, useState, ReactNode } from "react"

interface TabContextType {
  activeTab: GameCategory
  setActiveTab: (tab: GameCategory) => void
  reset: () => void
}

const TabContext = createContext<TabContextType | undefined>(undefined)

export function TabProvider({
  children,
  initial = GameCategory.WISHLIST
}: {
  children: ReactNode
  initial?: GameCategory
}) {
  const [activeTab, setActiveTab] = useState<GameCategory>(initial)

  const reset = () => setActiveTab(GameCategory.WISHLIST)

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
