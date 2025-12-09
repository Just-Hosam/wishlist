"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTabContext } from "@/contexts/TabContext"
import { cn } from "@/lib/utils"
import { GameCategory } from "@/types/game"
import { AlignJustify, FolderCheck, Heart } from "lucide-react"
import Link from "next/link"

interface NavigationBarProps {
  className?: string
}

export default function NavigationBar({ className }: NavigationBarProps) {
  const { activeTab, setActiveTab } = useTabContext()

  return (
    <Tabs value={activeTab} className={cn(className)}>
      <TabsList className="w-full justify-around rounded-full bg-white p-[6px] shadow-lg">
        <Link href="/lists" className="flex-1">
          <TabsTrigger
            onClick={() => setActiveTab("WISHLIST")}
            value="WISHLIST"
            className="h-10 w-full rounded-full data-[state=active]:bg-secondary"
          >
            <Heart />
          </TabsTrigger>
        </Link>
        <Link href="/lists" className="flex-1">
          <TabsTrigger
            onClick={() => setActiveTab("LIBRARY")}
            value="LIBRARY"
            className="h-10 w-full rounded-full data-[state=active]:bg-secondary"
          >
            <FolderCheck />
          </TabsTrigger>
        </Link>
        <Link href="/more" className="flex-1">
          <TabsTrigger
            onClick={() => setActiveTab("MORE")}
            value="MORE"
            className="h-10 w-full rounded-full data-[state=active]:bg-secondary"
          >
            <AlignJustify />
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  )
}
