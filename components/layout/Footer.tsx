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
        { transform: "scale(0.70)" },
        { transform: "scale(1)" }
      ],
      { duration: 250, easing: "ease-in-out" }
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
    <footer className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/[85%] via-60% to-transparent px-5 pb-7 pt-3">
      <div className="m-auto flex max-w-[450px] items-center gap-4">
        <Tabs value={activeTab} className="flex-1">
          <TabsList className="min-h-[72px] w-full justify-around rounded-full bg-white px-[6px] py-0 shadow-lg">
            <Link
              href="/wishlist"
              className="flex-1"
              onClick={handleWishlistClickOnWishlistPage}
            >
              <TabsTrigger
                value="WISHLIST"
                ref={wishlistTriggerRef}
                className="h-[60px] w-full rounded-full data-[state=active]:bg-accent/20"
              >
                {activeTab === "WISHLIST" ? (
                  <Heart className="size-[18px] fill-accent text-accent" />
                ) : (
                  <Heart className="size-[18px]" />
                )}
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
                className="h-[60px] w-full rounded-full data-[state=active]:bg-accent/20"
              >
                {activeTab === "LIBRARY" ? (
                  <LibraryBig
                    strokeWidth={1.6}
                    className="size-[18px] fill-accent text-accent"
                  />
                ) : (
                  <LibraryBig strokeWidth={1.6} className="size-[18px]" />
                )}
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
                className="h-[60px] w-full rounded-full data-[state=active]:bg-accent/20"
              >
                {activeTab === "MORE" ? (
                  <AlignJustify className="size-[18px] text-accent" />
                ) : (
                  <AlignJustify className="size-[18px]" />
                )}
              </TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
        <Link href="/search" onClick={handleSearchClickOnSearchPage}>
          <Button
            variant="accent"
            ref={searchButtonRef}
            className={cn(
              "h-[72px] w-[72px] rounded-full shadow-lg transition-transform [&_svg]:size-[18px]",
              activeTab === "SEARCH" && "bg-accent/80"
            )}
          >
            <Search />
          </Button>
        </Link>
      </div>
    </footer>
  )
}
