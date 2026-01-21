"use client"

import { BackButton } from "./BackButton"
import { usePathname } from "next/navigation"
import { Gamepad2 } from "lucide-react"
import { Nav } from "./Nav"
import { ReactNode } from "react"

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
  const config = ROUTE_CONFIG[pathname]

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
  return <BackButton />
}

function AboutHeader() {
  return (
    <>
      <BackButton /> <span className="text-xl">About</span>
    </>
  )
}

function CompletedHeader() {
  return (
    <>
      <BackButton /> <span className="text-xl">Completed</span>
    </>
  )
}

function DefaultHeader() {
  return <BackButton />
}
