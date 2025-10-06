"use client"

import { GameCategory } from "@prisma/client"
import { usePathname } from "next/navigation"
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react"

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
  const pathname = usePathname()
  const getTabFromPath = () => {
    const path = pathname.split("/").pop()?.toUpperCase()
    const isValidCategory = Object.values(GameCategory).includes(
      path as GameCategory
    )

    if (isValidCategory) return path as GameCategory

    return initial
  }

  const currentTab = getTabFromPath()
  const [activeTab, setActiveTab] = useState<GameCategory>(
    currentTab || initial
  )

  useEffect(() => {
    const tabFromPath = getTabFromPath()
    if (tabFromPath) {
      setActiveTab(tabFromPath)
    }
  }, [pathname])

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
