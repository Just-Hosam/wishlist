"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CircleCheckBig, FolderCheck, ScrollText, Skull } from "lucide-react"
import Link from "next/link"
import { useActiveTab } from "@/lib/hooks/useActiveTab"

export default function NavigationTabs() {
  const activeTab = useActiveTab()

  return (
    <Tabs value={activeTab}>
      <TabsList className="h-11 p-2">
        <Link href="/wishlist">
          <TabsTrigger className="px-3 py-2" value="wishlist">
            <ScrollText />
          </TabsTrigger>
        </Link>
        <Link href="/owned">
          <TabsTrigger className="px-3 py-2" value="owned">
            <FolderCheck />
          </TabsTrigger>
        </Link>
        <Link href="/completed">
          <TabsTrigger className="px-3 py-2" value="completed">
            <CircleCheckBig />
          </TabsTrigger>
        </Link>
        <Link href="/graveyard">
          <TabsTrigger className="px-3 py-2" value="graveyard">
            <Skull />
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  )
}
