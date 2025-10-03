"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTabContext } from "@/contexts/TabContext"
import { GameCategory } from "@prisma/client"
import { Archive, CheckCircle2, FolderCheck, Heart } from "lucide-react"
import Link from "next/link"

export default function NavigationTabs() {
  const { activeTab, setActiveTab } = useTabContext()

  return (
    <Tabs value={activeTab}>
      <TabsList>
        <Link
          href="/wishlist"
          onClick={() => setActiveTab(GameCategory.WISHLIST)}
        >
          <TabsTrigger value={GameCategory.WISHLIST}>
            <Heart />
            {activeTab === GameCategory.WISHLIST && <>Wishlist</>}
          </TabsTrigger>
        </Link>
        <Link
          href="/library"
          onClick={() => setActiveTab(GameCategory.LIBRARY)}
        >
          <TabsTrigger value={GameCategory.LIBRARY}>
            <FolderCheck />
            {activeTab === GameCategory.LIBRARY && <>Library</>}
          </TabsTrigger>
        </Link>
        <Link
          href="/completed"
          onClick={() => setActiveTab(GameCategory.COMPLETED)}
        >
          <TabsTrigger value={GameCategory.COMPLETED}>
            <CheckCircle2 />
            {activeTab === GameCategory.COMPLETED && <>Completed</>}
          </TabsTrigger>
        </Link>
        <Link
          href="/archived"
          onClick={() => setActiveTab(GameCategory.ARCHIVED)}
        >
          <TabsTrigger value={GameCategory.ARCHIVED}>
            <Archive />
            {activeTab === GameCategory.ARCHIVED && <>Archived</>}
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  )
}
