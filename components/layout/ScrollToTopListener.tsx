"use client"

import { useEffect } from "react"

export function ScrollToTopListener() {
  useEffect(() => {
    const handler = () => {
      const scrollEl =
        document.querySelector<HTMLElement>("[data-scroll-container]") ??
        (document.scrollingElement as HTMLElement | null) ??
        document.documentElement

      scrollEl.scrollTo({ top: 0, behavior: "smooth" })
    }

    window.addEventListener("scroll-to-top", handler)
    return () => window.removeEventListener("scroll-to-top", handler)
  }, [])

  return null
}
