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

const LIST_PATHS = ["/wishlist", "/library", "/completed", "/archived"]

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
  const isListPage = LIST_PATHS.includes(pathname)
  let currentTab = initial

  if (isListPage) {
    currentTab = getTabFromPath(pathname) || currentTab
  }

  const [activeTab, setActiveTab] = useState<GameCategory>(currentTab)

  useEffect(() => {
    const tabFromPath = getTabFromPath(pathname)
    if (tabFromPath) setActiveTab(tabFromPath)
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

const getTabFromPath = (pathname: string) => {
  const path = pathname.split("/").pop()?.toUpperCase()
  const isValidCategory = Object.values(GameCategory).includes(
    path as GameCategory
  )

  if (isValidCategory) return path as GameCategory

  return null
}
