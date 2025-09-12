"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CircleCheckBig, FolderCheck, ScrollText, Skull } from "lucide-react"
import Link from "next/link"
import { useTabContext } from "@/contexts/TabContext"
import { GameCategory } from "@prisma/client"

export default function NavigationTabs() {
  const { activeTab, setActiveTab } = useTabContext()

  return (
    <Tabs value={activeTab}>
      <TabsList className="h-11 p-2">
        <Link
          href="/wishlist"
          onClick={() => setActiveTab(GameCategory.WISHLIST)}
        >
          <TabsTrigger className="px-3 py-2" value="WISHLIST">
            <ScrollText />
          </TabsTrigger>
        </Link>
        <Link href="/owned" onClick={() => setActiveTab(GameCategory.OWNED)}>
          <TabsTrigger className="px-3 py-2" value="OWNED">
            <FolderCheck />
          </TabsTrigger>
        </Link>
        <Link
          href="/completed"
          onClick={() => setActiveTab(GameCategory.COMPLETED)}
        >
          <TabsTrigger className="px-3 py-2" value="COMPLETED">
            <CircleCheckBig />
          </TabsTrigger>
        </Link>
        <Link
          href="/graveyard"
          onClick={() => setActiveTab(GameCategory.GRAVEYARD)}
        >
          <TabsTrigger className="px-3 py-2" value="GRAVEYARD">
            <Skull />
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  )
}
