"use client"

import WishlistList from "@/components/lists/WishlistList"
import { useTabContext } from "@/contexts/TabContext"
import { GameCategory } from "@/types/game"
import LibraryList from "./LibraryList"
import CompletedList from "./CompletedList"
import ArchivedList from "./ArchivedList"
import PullToRefresh from "react-simple-pull-to-refresh"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

interface ListsWrapperProps {
  data: any
}

export default function ListsWrapper({ data }: ListsWrapperProps) {
  const router = useRouter()
  const { activeTab } = useTabContext()
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const checkStandalone = () => {
      if (typeof window === "undefined") return false

      const mediaMatches =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(display-mode: standalone)").matches
      const navigatorStandalone =
        (window.navigator as Navigator & { standalone?: boolean }).standalone

      return Boolean(mediaMatches || navigatorStandalone)
    }

    setIsStandalone(checkStandalone())

    if (typeof window.matchMedia !== "function") return

    const mediaQuery = window.matchMedia("(display-mode: standalone)")
    const handleChange = (event: MediaQueryListEvent) => {
      setIsStandalone(event.matches || checkStandalone())
    }

    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  const content = useMemo(
    () => (
      <>
        {activeTab === GameCategory.WISHLIST && (
          <WishlistList games={data.wishlistGames} />
        )}
        {activeTab === GameCategory.LIBRARY && (
          <LibraryList games={data.libraryGames} />
        )}
        {activeTab === GameCategory.COMPLETED && (
          <CompletedList games={data.completedGames} />
        )}
        {activeTab === GameCategory.ARCHIVED && (
          <ArchivedList games={data.archivedGames} />
        )}
      </>
    ),
    [activeTab, data]
  )

  if (!isStandalone) return content

  return (
    <PullToRefresh onRefresh={async () => router.refresh()}>
      {content}
    </PullToRefresh>
  )
}
