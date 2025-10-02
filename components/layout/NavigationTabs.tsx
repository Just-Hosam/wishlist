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
      <TabsList className="h-11 p-2">
        <Link
          href="/wishlist"
          onClick={() => setActiveTab(GameCategory.WISHLIST)}
        >
          <TabsTrigger className="px-3 py-2" value={GameCategory.WISHLIST}>
            <Heart />
          </TabsTrigger>
        </Link>
        <Link
          href="/library"
          onClick={() => setActiveTab(GameCategory.LIBRARY)}
        >
          <TabsTrigger className="px-3 py-2" value={GameCategory.LIBRARY}>
            <FolderCheck />
          </TabsTrigger>
        </Link>
        <Link
          href="/completed"
          onClick={() => setActiveTab(GameCategory.COMPLETED)}
        >
          <TabsTrigger className="px-3 py-2" value={GameCategory.COMPLETED}>
            <CheckCircle2 />
          </TabsTrigger>
        </Link>
        <Link
          href="/archived"
          onClick={() => setActiveTab(GameCategory.ARCHIVED)}
        >
          <TabsTrigger className="px-3 py-2" value={GameCategory.ARCHIVED}>
            <Archive />
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  )
}
