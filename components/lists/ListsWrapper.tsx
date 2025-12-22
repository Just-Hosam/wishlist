"use client"

import WishlistList from "@/components/lists/WishlistList"
import { useTabContext } from "@/contexts/TabContext"
import { GameCategory } from "@/types"
import LibraryList from "./LibraryList"
import ListEmptyState from "../layout/ListEmptyState"

interface ListsWrapperProps {
  data: any
}

export default function ListsWrapper({ data }: ListsWrapperProps) {
  const { activeTab } = useTabContext()

  return (
    <>
      {activeTab === GameCategory.WISHLIST &&
        (data.wishlistGames.length === 0 ? (
          <ListEmptyState />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-6">
            <WishlistList games={data.wishlistGames} />
          </div>
        ))}
      {activeTab === GameCategory.LIBRARY && (
        <LibraryList games={data.libraryGames} />
      )}
    </>
  )
}
