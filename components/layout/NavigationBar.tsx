"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTabContext } from "@/contexts/TabContext"
import { GameCategory } from "@/types/game"
import { AlignJustify, FolderCheck, Heart } from "lucide-react"
import Link from "next/link"

interface NavigationBarProps {
  className?: string
}

export default function NavigationBar({ className }: NavigationBarProps) {
  const { activeTab, setActiveTab } = useTabContext()

  return (
    <Tabs value={activeTab} className={`${className}`}>
      <TabsList className="w-full justify-around">
        <Link href="/lists" className="flex-1">
          <TabsTrigger
            onClick={() => setActiveTab("WISHLIST")}
            value="WISHLIST"
            className="w-full px-4 py-2"
          >
            <Heart size={50} />
          </TabsTrigger>
        </Link>
        <Link href="/lists" className="flex-1">
          <TabsTrigger
            onClick={() => setActiveTab("LIBRARY")}
            value="LIBRARY"
            className="w-full px-4 py-2"
          >
            <FolderCheck />
          </TabsTrigger>
        </Link>
        <Link href="/more" className="flex-1">
          <TabsTrigger
            onClick={() => setActiveTab("MORE")}
            value="MORE"
            className="w-full px-4 py-2"
          >
            <AlignJustify />
          </TabsTrigger>
        </Link>
      </TabsList>
    </Tabs>
  )
}
