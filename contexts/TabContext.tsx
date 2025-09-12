"use client"

import { GameCategory } from "@prisma/client"
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"

interface TabContextType {
  activeTab: GameCategory
  setActiveTab: (tab: GameCategory) => void
  reset: () => void
}

const TabContext = createContext<TabContextType | undefined>(undefined)

export function TabProvider({
  children,
  initial = GameCategory.WISHLIST,
}: {
  children: ReactNode
  initial?: GameCategory
}) {
  const [activeTab, setActiveTab] = useState<GameCategory>(initial)

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("activeTab")
    if (
      stored &&
      Object.values(GameCategory).includes(stored as GameCategory)
    ) {
      setActiveTab(stored as GameCategory)
    }
  }, [])

  // Save to localStorage when activeTab changes
  useEffect(() => {
    localStorage.setItem("activeTab", activeTab)
  }, [activeTab])

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
