"use client"

import { decodePathSegment, normalizePathname, splitPathSegments } from "@/lib/path"
import { Gamepad2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import { useNavigation } from "../navigation/NavigationProvider"
import { BackButton } from "./BackButton"
import { Nav } from "./Nav"
import { SearchBar } from "../game/SearchBar"

export function Header() {
  const pathname = usePathname()
  const { pendingPathname } = useNavigation()
  const activePathname = normalizePathname(pendingPathname ?? pathname)

  return <Nav>{resolveHeader(activePathname)}</Nav>
}

function resolveHeader(pathname: string): ReactNode {
  const exactHeader = resolveExactHeader(pathname)
  if (exactHeader) return exactHeader

  const searchHeader = resolveSearchHeader(pathname)
  if (searchHeader) return searchHeader

  return <DefaultHeader />
}

function resolveExactHeader(pathname: string): ReactNode | null {
  switch (pathname) {
    case "/":
      return <SigninHeader />
    case "/launch":
    case "/wishlist":
      return <WishlistHeader />
    case "/library":
      return <LibraryHeader />
    case "/more":
      return <MoreHeader />
    case "/more/about":
      return <AboutHeader />
    case "/more/completed":
      return <CompletedHeader />
    default:
      return null
  }
}

function resolveSearchHeader(pathname: string): ReactNode | null {
  const segments = splitPathSegments(pathname)
  if (segments[0] !== "search") return null

  if (segments.length === 1) {
    return <SearchHeader />
  }

  if (segments.length === 2) {
    return <SearchHeader initialQuery={decodePathSegment(segments[1])} />
  }

  if (segments.length >= 3) {
    return <DefaultHeader />
  }

  return null
}

function SigninHeader() {
  return (
    <div className="flex items-center gap-3">
      <Gamepad2 size={48} />
      <h1 className="text-4xl font-semibold">Playward</h1>
    </div>
  )
}

function WishlistHeader() {
  return <h1 className="text-4xl font-semibold">Wishlist</h1>
}

function LibraryHeader() {
  return <h1 className="text-4xl font-semibold">Library</h1>
}

function MoreHeader() {
  return <h1 className="text-4xl font-semibold">More</h1>
}

function SearchHeader({ initialQuery = "" }: { initialQuery?: string }) {
  return <SearchBar initialQuery={initialQuery} />
}

function AboutHeader() {
  return (
    <>
      <BackButton />
      <h1 className="text-2xl font-semibold">About</h1>
    </>
  )
}

function CompletedHeader() {
  return (
    <>
      <BackButton />
      <h1 className="text-2xl font-semibold">Completed</h1>
    </>
  )
}

function DefaultHeader() {
  return <BackButton />
}
