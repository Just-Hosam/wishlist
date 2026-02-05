"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { AlignJustify, Heart, LibraryBig, Search } from "lucide-react"
import { Link } from "@/components/navigation"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

type Tab = "WISHLIST" | "LIBRARY" | "MORE" | "SEARCH" | ""

export default function Footer() {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<Tab>("")
  const wishlistTriggerRef = useRef<HTMLButtonElement>(null)
  const libraryTriggerRef = useRef<HTMLButtonElement>(null)
  const moreTriggerRef = useRef<HTMLButtonElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)

  const runScaleAnimation = (element: HTMLElement | null) => {
    if (!element?.animate) return

    element.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.75)" },
        { transform: "scale(1)" }
      ],
      { duration: 300, easing: "ease-in-out" }
    )
  }

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

  if (pathname === "/") return null

  const handleSearchClickOnSearchPage = (e: React.MouseEvent) => {
    setActiveTab("SEARCH")
    runScaleAnimation(searchButtonRef.current)

    if (pathname === "/search") {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent("focus-search-input"))
    }
  }

  const handleWishlistClickOnWishlistPage = (e: React.MouseEvent) => {
    setActiveTab("WISHLIST")
    runScaleAnimation(wishlistTriggerRef.current)

    if (pathname === "/wishlist") {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent("scroll-to-top"))
    }
  }

  const handleLibraryClickOnLibraryPage = (e: React.MouseEvent) => {
    setActiveTab("LIBRARY")
    runScaleAnimation(libraryTriggerRef.current)

    if (pathname === "/library") {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent("scroll-to-top"))
    }
  }

  const handleCompletedClickOnCompletedPage = (e: React.MouseEvent) => {
    setActiveTab("MORE")
    runScaleAnimation(moreTriggerRef.current)
  }

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/[80%] via-60% to-transparent px-5 pb-7 pt-3">
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
                ref={wishlistTriggerRef}
                className="h-12 w-full rounded-full data-[state=active]:bg-secondary"
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
                ref={libraryTriggerRef}
                className="h-12 w-full rounded-full data-[state=active]:bg-secondary"
              >
                <LibraryBig strokeWidth={1.6} />
              </TabsTrigger>
            </Link>
            <Link
              href="/more"
              className="flex-1"
              onClick={handleCompletedClickOnCompletedPage}
            >
              <TabsTrigger
                value="MORE"
                ref={moreTriggerRef}
                className="h-12 w-full rounded-full data-[state=active]:bg-secondary"
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
            ref={searchButtonRef}
            className="h-16 w-16 rounded-full bg-white p-[7px] text-black shadow-lg transition-transform"
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
