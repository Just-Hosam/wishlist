"use client"

import { useRouter as useNextRouter, usePathname } from "next/navigation"
import { useNavigation } from "./NavigationProvider"
import { useCallback } from "react"

export function useRouter() {
  const router = useNextRouter()
  const pathname = usePathname()
  const { startNavigation } = useNavigation()

  const push = useCallback(
    (href: string, options?: { scroll?: boolean }) => {
      // Only start navigation if we're going to a different route
      if (href !== pathname) {
        startNavigation(href)
      }
      router.push(href, options)
    },
    [router, pathname, startNavigation]
  )

  const replace = useCallback(
    (href: string, options?: { scroll?: boolean }) => {
      // Only start navigation if we're going to a different route
      if (href !== pathname) {
        startNavigation(href)
      }
      router.replace(href, options)
    },
    [router, pathname, startNavigation]
  )

  return {
    ...router,
    push,
    replace
  }
}
