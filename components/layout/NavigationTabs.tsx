"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTabContext } from "@/contexts/TabContext"
import { GameCategory } from "@prisma/client"
import { Archive, CheckCircle2, FolderCheck, Heart } from "lucide-react"

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
          {activeTab === GameCategory.WISHLIST && <>Wishlist</>}
        </TabsTrigger>
        <TabsTrigger
          onClick={() => setActiveTab(GameCategory.LIBRARY)}
          value={GameCategory.LIBRARY}
        >
          <FolderCheck />
          {activeTab === GameCategory.LIBRARY && <>Library</>}
        </TabsTrigger>
        <TabsTrigger
          onClick={() => setActiveTab(GameCategory.COMPLETED)}
          value={GameCategory.COMPLETED}
        >
          <CheckCircle2 />
          {activeTab === GameCategory.COMPLETED && <>Completed</>}
        </TabsTrigger>
        <TabsTrigger
          onClick={() => setActiveTab(GameCategory.ARCHIVED)}
          value={GameCategory.ARCHIVED}
        >
          <Archive />
          {activeTab === GameCategory.ARCHIVED && <>Archived</>}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
