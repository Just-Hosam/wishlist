"use client"

import { useMemo } from "react"

import WishlistList from "@/components/lists/WishlistList"
import { useTabContext } from "@/contexts/TabContext"
import { GameCategory } from "@/types/game"
import LibraryList from "./LibraryList"
import CompletedList from "./CompletedList"
import ArchivedList from "./ArchivedList"

interface ListsWrapperProps {
  data: any
}

export default function ListsWrapper({ data }: ListsWrapperProps) {
  const { activeTab } = useTabContext()

  const memoizedLists = useMemo(
    () =>
      ({
        [GameCategory.WISHLIST]: <WishlistList games={data.wishlistGames} />,
        [GameCategory.LIBRARY]: <LibraryList games={data.libraryGames} />,
        [GameCategory.COMPLETED]: <CompletedList games={data.completedGames} />,
        [GameCategory.ARCHIVED]: <ArchivedList games={data.archivedGames} />
      }) as Record<GameCategory, JSX.Element>,
    [
      data.wishlistGames,
      data.libraryGames,
      data.completedGames,
      data.archivedGames
    ]
  )

  return memoizedLists[activeTab] ?? null
}
