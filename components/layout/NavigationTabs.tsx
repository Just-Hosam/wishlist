"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTabContext } from "@/contexts/TabContext"
import { GameCategory } from "@/types"
import { FolderCheck, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NavigationTabs() {
  const { activeTab } = useTabContext()
  const router = useRouter()

  return (
    <Tabs value={activeTab}>
      <TabsList>
        <TabsTrigger
          onClick={() => router.push("/wishlist")}
          value={GameCategory.WISHLIST}
        >
          <Heart />
          Wishlist
        </TabsTrigger>
        <TabsTrigger
          onClick={() => router.push("/library")}
          value={GameCategory.LIBRARY}
        >
          <FolderCheck />
          Library
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
