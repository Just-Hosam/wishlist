"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTabContext } from "@/contexts/TabContext"
import { AlignJustify, FolderCheck, Heart, Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Footer() {
  const { activeTab, setActiveTab } = useTabContext()

  const handleSearchClick = (e: React.MouseEvent) => {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("focus-search-input"))
    }, 300)
  }

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/[98%] via-55% to-transparent px-7 pb-7 pt-3">
      <div className="m-auto flex max-w-[450px] items-center gap-4">
        <Tabs value={activeTab} className="flex-1">
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
        <Link href="/search" onClick={handleSearchClick}>
          <Button
            size="icon"
            variant="link"
            className="h-[52px] w-[52px] rounded-full bg-white text-black shadow-xl"
          >
            <Search />
          </Button>
        </Link>
      </div>
    </footer>
  )
}
