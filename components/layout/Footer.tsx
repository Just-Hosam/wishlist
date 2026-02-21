"use client"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useNavigation } from "@/components/navigation/NavigationProvider"
import { splitPathSegments } from "@/lib/path"
import { AlignJustify, Heart, LibraryBig, Search } from "lucide-react"
import { Link } from "@/components/navigation"
import { usePathname } from "next/navigation"
import { useRef } from "react"

type Tab = "WISHLIST" | "LIBRARY" | "MORE" | "SEARCH" | ""

export default function Footer() {
  const pathname = usePathname()
  const { pendingPathname } = useNavigation()
  const activePathname = pendingPathname ?? pathname
  const activeTab: Tab =
    activePathname.startsWith("/wishlist") ||
    activePathname.startsWith("/launch")
      ? "WISHLIST"
      : activePathname.startsWith("/library")
        ? "LIBRARY"
        : activePathname.startsWith("/more")
          ? "MORE"
          : activePathname.startsWith("/search")
            ? "SEARCH"
            : ""

  const wishlistTriggerRef = useRef<HTMLButtonElement>(null)
  const libraryTriggerRef = useRef<HTMLButtonElement>(null)
  const moreTriggerRef = useRef<HTMLButtonElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)

  if (pathname === "/") return null

  const scrollToTop = () => {
    const scrollEl =
      document.querySelector<HTMLElement>("[data-scroll-container]") ??
      (document.scrollingElement as HTMLElement | null) ??
      document.documentElement

    scrollEl.scrollTo({ top: 0, behavior: "smooth" })
  }

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

  const handleSearchClickOnSearchPage = (e: React.MouseEvent) => {
    runScaleAnimation(searchButtonRef.current)

    const pathSegments = splitPathSegments(pathname)
    const isSearchInputRoute =
      pathSegments[0] === "search" && pathSegments.length <= 2

    if (isSearchInputRoute) {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent("focus-search-input"))
    }
  }

  const handleWishlistClickOnWishlistPage = (e: React.MouseEvent) => {
    runScaleAnimation(wishlistTriggerRef.current)

    if (pathname === "/wishlist") {
      e.preventDefault()
      scrollToTop()
    }
  }

  const handleLibraryClickOnLibraryPage = (e: React.MouseEvent) => {
    runScaleAnimation(libraryTriggerRef.current)

    if (pathname === "/library") {
      e.preventDefault()
      scrollToTop()
    }
  }

  const handleCompletedClickOnCompletedPage = () => {
    runScaleAnimation(moreTriggerRef.current)
  }

  return (
    <footer className="custom-footer-slide-up absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/[85%] via-60% to-transparent px-5 pb-5 pt-3">
      <div className="m-auto flex max-w-[450px] items-center gap-4">
        <Tabs value={activeTab} className="flex-1">
          <TabsList className="min-h-[68px] w-full justify-around rounded-full bg-white px-[6px] py-0 shadow-lg">
            <Link
              href="/wishlist"
              className="flex-1"
              onClick={handleWishlistClickOnWishlistPage}
            >
              <TabsTrigger
                value="WISHLIST"
                ref={wishlistTriggerRef}
                className="h-[56px] w-full rounded-full data-[state=active]:bg-accent/20"
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
                className="h-[56px] w-full rounded-full data-[state=active]:bg-accent/20"
              >
                {activeTab === "LIBRARY" ? (
                  <LibraryBig
                    strokeWidth={1.6}
                    className="size-[18px] text-accent"
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
                className="h-[56px] w-full rounded-full data-[state=active]:bg-accent/20"
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
            className="h-[68px] w-[68px] rounded-full shadow-lg transition-transform [&_svg]:size-[18px]"
          >
            <Search />
          </Button>
        </Link>
      </div>
    </footer>
  )
}
