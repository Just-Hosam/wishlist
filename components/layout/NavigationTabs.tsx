"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTabContext } from "@/contexts/TabContext"
import { GameCategory } from "@/types/game"
import { FolderCheck, Heart } from "lucide-react"

export default function NavigationTabs() {
  const { activeTab, setActiveTab } = useTabContext()

  return (
    <Tabs value={activeTab}>
      <TabsList>
        <TabsTrigger
          onClick={() => setActiveTab(GameCategory.WISHLIST)}
          value={GameCategory.WISHLIST}
        >
          <Heart />
          Wishlist
        </TabsTrigger>
        <TabsTrigger
          onClick={() => setActiveTab(GameCategory.LIBRARY)}
          value={GameCategory.LIBRARY}
        >
          <FolderCheck />
          Library
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
