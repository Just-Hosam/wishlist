"use client"

import { Gamepad2 } from "lucide-react"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"
import { useNavigation } from "../navigation/NavigationProvider"
import { BackButton } from "./BackButton"
import { Nav } from "./Nav"

const ROUTE_CONFIG: Record<string, ReactNode> = {
  "/": <SigninHeader />,
  "/wishlist": <WishlistHeader />,
  "/library": <LibraryHeader />,
  "/more": <MoreHeader />,
  "/search": <SearchHeader />,
  "/more/about": <AboutHeader />,
  "/more/completed": <CompletedHeader />
}

export function Header() {
  const pathname = usePathname()
  const { pendingPathname } = useNavigation()
  const activePathname = pendingPathname ?? pathname
  const config = ROUTE_CONFIG[activePathname]

  return <Nav>{config || <DefaultHeader />}</Nav>
}

function SigninHeader() {
  return (
    <div className="flex items-center gap-3">
      <Gamepad2 size={40} />
      <h1 className="text-3xl font-semibold">Playward</h1>
    </div>
  )
}

function WishlistHeader() {
  return <h1 className="text-3xl font-semibold">Wishlist</h1>
}

function LibraryHeader() {
  return <h1 className="text-3xl font-semibold">Library</h1>
}

function MoreHeader() {
  return <h1 className="text-3xl font-semibold">More</h1>
}

function SearchHeader() {
  return null
}

function AboutHeader() {
  return (
    <>
      <BackButton />
      <h1 className="flex h-12 items-center rounded-full bg-white px-6 text-xl shadow-md">
        About
      </h1>
    </>
  )
}

function CompletedHeader() {
  return (
    <>
      <BackButton />
      <h1 className="flex h-12 items-center rounded-full bg-white px-6 text-xl shadow-md">
        Completed
      </h1>
    </>
  )
}

function DefaultHeader() {
  return <BackButton />
}
