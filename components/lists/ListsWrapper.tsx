"use client"

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

  return (
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
  )
}
