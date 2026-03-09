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
      // For normal push navigation we want "fresh page" semantics:
      // save old scroll, then reset new page to top (no restoration).
      if (href !== pathname) {
        startNavigation(href, { restoreScroll: false })
      }
      // Default scroll=false so Next does not perform its own scroll jump.
      // ScrollRestoration owns this behavior globally.
      router.push(href, { ...options, scroll: options?.scroll ?? false })
    },
    [router, pathname, startNavigation]
  )

  const replace = useCallback(
    (href: string, options?: { scroll?: boolean }) => {
      // Replace is treated like push for scroll behavior.
      if (href !== pathname) {
        startNavigation(href, { restoreScroll: false })
      }
      router.replace(href, { ...options, scroll: options?.scroll ?? false })
    },
    [router, pathname, startNavigation]
  )

  const back = useCallback(() => {
    // Back/forward should behave like browser history: restore previous scroll.
    startNavigation(pathname, { restoreScroll: true })
    router.back()
  }, [router, pathname, startNavigation])

  const forward = useCallback(() => {
    // Same restoration behavior as back().
    startNavigation(pathname, { restoreScroll: true })
    router.forward()
  }, [router, pathname, startNavigation])

  return {
    ...router,
    push,
    replace,
    back,
    forward
  }
}
