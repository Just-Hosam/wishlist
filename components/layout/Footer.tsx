"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { AlignJustify, FolderCheck, Heart, Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Footer() {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState("")

  useEffect(() => {
    if (pathname.startsWith("/wishlist")) {
      setActiveTab("WISHLIST")
      return
    }

    if (pathname.startsWith("/library")) {
      setActiveTab("LIBRARY")
      return
    }

    if (pathname.startsWith("/more")) {
      setActiveTab("MORE")
      return
    }

    if (pathname.startsWith("/search")) {
      setActiveTab("SEARCH")
      return
    }
  }, [pathname])

  const handleSearchClickOnSearchPage = (e: React.MouseEvent) => {
    if (pathname === "/search") {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent("focus-search-input"))
    }
  }

  const handleWishlistClickOnWishlistPage = (e: React.MouseEvent) => {
    if (pathname === "/wishlist") {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent("scroll-to-top"))
    }
  }

  const handleLibraryClickOnLibraryPage = (e: React.MouseEvent) => {
    if (pathname === "/library") {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent("scroll-to-top"))
    }
  }

  const handleCompletedClickOnCompletedPage = (e: React.MouseEvent) => {
    if (pathname === "/more/completed") {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent("scroll-to-top"))
    }
  }

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/[98%] via-55% to-transparent px-7 pb-7 pt-3">
      <div className="m-auto flex max-w-[450px] items-center gap-4">
        <Tabs value={activeTab} className="flex-1">
          <TabsList className="w-full justify-around rounded-full bg-white p-2 shadow-lg">
            <Link
              href="/wishlist"
              className="flex-1"
              onClick={handleWishlistClickOnWishlistPage}
            >
              <TabsTrigger
                value="WISHLIST"
                className="h-12 w-full rounded-full transition-transform duration-150 active:scale-90 data-[state=active]:bg-secondary"
              >
                <Heart />
              </TabsTrigger>
            </Link>
            <Link
              href="/library"
              className="flex-1"
              onClick={handleLibraryClickOnLibraryPage}
            >
              <TabsTrigger
                value="LIBRARY"
                className="h-12 w-full rounded-full transition-transform duration-150 active:scale-90 data-[state=active]:bg-secondary"
              >
                <FolderCheck />
              </TabsTrigger>
            </Link>
            <Link
              href="/more"
              className="flex-1"
              onClick={handleCompletedClickOnCompletedPage}
            >
              <TabsTrigger
                value="MORE"
                className="h-12 w-full rounded-full transition-transform duration-150 active:scale-90 data-[state=active]:bg-secondary"
              >
                <AlignJustify />
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
        <Link href="/search" onClick={handleSearchClickOnSearchPage}>
          <Button
            size="icon"
            variant="link"
            className="h-16 w-16 rounded-full bg-white p-[7px] text-black shadow-lg transition-transform duration-150 active:scale-90"
          >
            <div
              className={cn(
                "flex h-full w-full items-center justify-center rounded-full",
                activeTab === "SEARCH" && "bg-secondary"
              )}
            >
              <Search />
            </div>
          </Button>
        </Link>
      </div>
    </footer>
  )
}
