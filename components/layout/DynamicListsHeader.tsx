"use client"

import { useTabContext } from "@/contexts/TabContext"
import { GameCategory } from "@/types/game"
import { PageHeader } from "./PageHeader"

export function DynamicListsHeader() {
  const { activeTab } = useTabContext()

  let pageName = activeTab === GameCategory.WISHLIST ? "Wishlist" : "Library"

  if (
    activeTab !== GameCategory.WISHLIST &&
    activeTab !== GameCategory.LIBRARY
  ) {
    pageName = "More"
  }

  return <PageHeader pageName={pageName} />
}
