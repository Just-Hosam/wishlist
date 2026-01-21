"use client"

import { useEffect, useState } from "react"
import { BackButton } from "./BackButton"
import { usePathname } from "next/navigation"

type Tab = "SIGNIN" | "WISHLIST" | "LIBRARY" | "MORE" | "SEARCH" | "BACK"

export function Header() {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<Tab>("SIGNIN")

  useEffect(() => {
    console.log("pathname :>>", pathname)
    if (pathname === "/") {
      setActiveTab("SIGNIN")
      return
    }

    if (pathname === "/wishlist") {
      setActiveTab("WISHLIST")
      return
    }

    if (pathname === "/library") {
      setActiveTab("LIBRARY")
      return
    }

    if (pathname === "/more") {
      setActiveTab("MORE")
      return
    }

    if (pathname === "/search") {
      setActiveTab("SEARCH")
      return
    }

    setActiveTab("BACK")
  }, [pathname])

  return (
    <nav className="absolute left-0 right-0 top-0 z-30 m-auto flex min-h-[76px] max-w-[1200px] items-center justify-between gap-3 bg-[#fafafa] px-6 pb-4 pt-5">
      {/* {(showBackButton || pageName) && (
        <div className="flex items-center gap-3">
          {showBackButton && <BackButton />}
          {pageName && (
            <h1
              className={`${showBackButton ? "text-xl" : "text-3xl font-semibold"}`}
            >
              {pageName}
            </h1>
          )}
        </div>
      )} */}

      {activeTab === "SIGNIN" && (
        <h1 className="text-3xl font-semibold">Playward</h1>
      )}
      {activeTab === "WISHLIST" && (
        <h1 className="text-3xl font-semibold">Wishlist</h1>
      )}
      {activeTab === "LIBRARY" && (
        <h1 className="text-3xl font-semibold">Library</h1>
      )}
      {activeTab === "MORE" && <h1 className="text-3xl font-semibold">More</h1>}
      {activeTab === "BACK" && <BackButton />}
    </nav>
  )
}
