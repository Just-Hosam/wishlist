"use client"

import {
  decodePathSegment,
  normalizePathname,
  splitPathSegments
} from "@/lib/path"
import { Gamepad2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import { SearchButton } from "../game/SearchButton"
import { SearchHeader } from "../game/SearchHeader"
import { useRouter } from "../navigation"
import { useNavigation } from "../navigation/NavigationProvider"
import NotificationButton from "../notifications/NotificationButton"
import { BackButton } from "./BackButton"
import { Nav } from "./Nav"

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

  const reviewsHeader = resolveReviewsHeader(pathname)
  if (reviewsHeader) return reviewsHeader

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
    case "/notifications":
      return <NotificationsHeader />
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
    return <SearchPageHeader />
  }

  if (segments.length === 2) {
    return <SearchResultsHeader initialQuery={decodePathSegment(segments[1])} />
  }

  if (segments.length >= 3) {
    return <DefaultHeader />
  }

  return null
}

function resolveReviewsHeader(pathname: string): ReactNode | null {
  const segments = splitPathSegments(pathname)
  if (segments[0] !== "reviews") return null

  if (segments.length === 2) return <ReviewsHeader />

  return null
}

function SigninHeader() {
  return (
    <div className="flex items-center gap-3">
      <Gamepad2 size={48} />
      <h1 className="text-4xl font-bold">Playward</h1>
    </div>
  )
}

function WishlistHeader() {
  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="text-4xl font-bold">Wishlist</h1>
      <NotificationButton />
    </div>
  )
}

function LibraryHeader() {
  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="text-4xl font-bold">Library</h1>
      <NotificationButton />
    </div>
  )
}

function MoreHeader() {
  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="text-4xl font-bold">More</h1>
      <NotificationButton />
    </div>
  )
}

function SearchPageHeader() {
  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="text-4xl font-bold">Search</h1>
      <div className="flex items-center gap-1">
        <SearchButton />
        <NotificationButton />
      </div>
    </div>
  )
}

function SearchResultsHeader({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()

  return (
    <SearchHeader
      initialQuery={initialQuery}
      onBack={() => router.push("/search")}
    />
  )
}

function AboutHeader() {
  return (
    <>
      <BackButton />
      <h1 className="text-xl font-bold">About</h1>
    </>
  )
}

function CompletedHeader() {
  return (
    <>
      <BackButton />
      <h1 className="text-xl font-bold">Completed</h1>
    </>
  )
}

function ReviewsHeader() {
  return (
    <>
      <BackButton />
      <h1 className="text-xl font-bold">Steam Reviews</h1>
    </>
  )
}

function NotificationsHeader() {
  return (
    <>
      <BackButton />
      <h1 className="text-xl font-bold">Notifications</h1>
    </>
  )
}

function DefaultHeader() {
  return <BackButton />
}
