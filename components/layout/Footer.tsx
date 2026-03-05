"use client"

import { Link } from "@/components/navigation"
import { useNavigation } from "@/components/navigation/NavigationProvider"
import { buttonVariants } from "@/components/ui/button"
import { splitPathSegments } from "@/lib/path"
import { cn, getScrollContainer } from "@/lib/utils"
import { AlignJustify, Heart, LibraryBig, Search } from "lucide-react"
import { usePathname } from "next/navigation"

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

  if (pathname === "/") return null

  const scrollToTop = () => {
    const scrollEl = getScrollContainer()

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

  const handleSearchClickOnSearchPage = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    runScaleAnimation(e.currentTarget)

    const pathSegments = splitPathSegments(pathname)
    const isSearchInputRoute =
      pathSegments[0] === "search" && pathSegments.length <= 2

    if (isSearchInputRoute) {
      e.preventDefault()
      window.dispatchEvent(new CustomEvent("focus-search-input"))
    }
  }

  const handleWishlistClickOnWishlistPage = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    runScaleAnimation(e.currentTarget)

    if (pathname === "/wishlist") {
      e.preventDefault()
      scrollToTop()
    }
  }

  const handleLibraryClickOnLibraryPage = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    runScaleAnimation(e.currentTarget)

    if (pathname === "/library") {
      e.preventDefault()
      scrollToTop()
    }
  }

  const handleCompletedClickOnCompletedPage = (
    e: React.MouseEvent<HTMLAnchorElement>
  ) => {
    runScaleAnimation(e.currentTarget)
  }

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/[85%] via-60% to-transparent px-5 pb-6 pt-3">
      <div className="m-auto flex max-w-[450px] items-center gap-4">
        <nav aria-label="Primary" className="flex-1">
          <div className="flex min-h-[68px] w-full items-center justify-around gap-[2px] rounded-full bg-white px-[6px] py-0 text-muted-foreground shadow-lg">
            <Link
              href="/wishlist"
              className={cn(
                "inline-flex h-[56px] flex-1 items-center justify-center rounded-full border border-transparent px-[10px] py-[6px] text-sm font-medium text-foreground transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                activeTab === "WISHLIST" && "bg-accent/20 text-accent"
              )}
              onClick={handleWishlistClickOnWishlistPage}
              aria-label="Go to wishlist"
            >
              {activeTab === "WISHLIST" ? (
                <Heart className="size-[18px] fill-accent text-accent" />
              ) : (
                <Heart className="size-[18px]" />
              )}
            </Link>
            <Link
              href="/library"
              className={cn(
                "inline-flex h-[56px] flex-1 items-center justify-center rounded-full border border-transparent px-[10px] py-[6px] text-sm font-medium text-foreground transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                activeTab === "LIBRARY" && "bg-accent/20 text-accent"
              )}
              onClick={handleLibraryClickOnLibraryPage}
              aria-label="Go to library"
            >
              {activeTab === "LIBRARY" ? (
                <LibraryBig
                  strokeWidth={1.6}
                  className="size-[18px] text-accent"
                />
              ) : (
                <LibraryBig strokeWidth={1.6} className="size-[18px]" />
              )}
            </Link>
            <Link
              href="/more"
              className={cn(
                "inline-flex h-[56px] flex-1 items-center justify-center rounded-full border border-transparent px-[10px] py-[6px] text-sm font-medium text-foreground transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                activeTab === "MORE" && "bg-accent/20 text-accent"
              )}
              onClick={handleCompletedClickOnCompletedPage}
              aria-label="Go to more"
            >
              {activeTab === "MORE" ? (
                <AlignJustify className="size-[18px] text-accent" />
              ) : (
                <AlignJustify className="size-[18px]" />
              )}
            </Link>
          </div>
        </nav>
        <Link
          href="/search"
          onClick={handleSearchClickOnSearchPage}
          aria-label="Go to search"
          className={cn(
            buttonVariants({ variant: "accent", size: "icon" }),
            "h-[68px] w-[68px] rounded-full shadow-lg transition-transform focus-visible:ring-accent [&_svg]:size-[18px]"
          )}
        >
          <span className="sr-only">Search</span>
          <span aria-hidden="true">
            <Search />
          </span>
        </Link>
      </div>
    </footer>
  )
}
