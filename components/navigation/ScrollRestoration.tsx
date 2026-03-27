"use client"

import { getScrollContainer } from "@/lib/utils"
import { usePathname, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef } from "react"
import {
  NAVIGATION_SAVE_EVENT,
  type NavigationSaveDetail
} from "./navigation-events"
import { useNavigation } from "./NavigationProvider"

// Session keys are versioned so we can invalidate old persisted formats later
// by bumping `v1` -> `v2` without needing migration logic.
const PAGE_SCROLL_STORAGE_KEY = "playward:page-scroll:v1"
const HORIZONTAL_SCROLL_STORAGE_KEY = "playward:horizontal-scroll:v1"

// Any element with this attribute participates in horizontal restoration.
// We add this to carousels and media scrollers.
const HORIZONTAL_RESTORE_SELECTOR = "[data-scroll-restore-id]"

// Horizontal content (images/videos) can mount a few frames after route render.
// We retry restoration across multiple frames to catch late layout shifts.
const HORIZONTAL_RESTORE_ATTEMPTS = 12
// Vertical restoration needs a longer retry window because the page can be too
// short for the target scroll position until async content/layout settles.
const PAGE_RESTORE_ATTEMPTS = 120

type ScrollMap = Record<string, number>

const parseScrollMap = (rawValue: string | null): ScrollMap => {
  if (!rawValue) return {}

  try {
    const parsed = JSON.parse(rawValue)
    if (!parsed || typeof parsed !== "object") return {}

    const map: ScrollMap = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "number" && Number.isFinite(value)) {
        map[key] = value
      }
    }
    return map
  } catch {
    return {}
  }
}

// Horizontal state is keyed by route + local scroller id.
// Example: "/search::game-carousel:/search/trending" -> 428
const getHorizontalScrollKey = (routeKey: string, restoreId: string): string =>
  `${routeKey}::${restoreId}`

// During native browser history navigation we sometimes need the destination
// route immediately, before Next's hooks have caught up to the new URL.
const getLocationRouteKey = () => {
  const { pathname, search } = window.location
  return search ? `${pathname}${search}` : pathname
}

const setElementScrollLeftInstant = (
  element: HTMLElement,
  nextScrollLeft: number
) => {
  // Carousels have `scroll-smooth` in className for user interactions.
  // During restoration we need immediate positioning to avoid visible "glide"
  // when navigating back/forward. We temporarily override inline behavior.
  const previousScrollBehavior = element.style.scrollBehavior
  element.style.scrollBehavior = "auto"
  element.scrollLeft = nextScrollLeft

  // Restore original inline style on next frame so normal UX remains smooth.
  window.requestAnimationFrame(() => {
    element.style.scrollBehavior = previousScrollBehavior
  })
}

export function ScrollRestoration() {
  const { isNavigating } = useNavigation()
  const pathname = usePathname() ?? "/"
  const searchParams = useSearchParams()
  const searchParamsString = searchParams.toString()

  // Path + search is our route identity. This allows independent restoration
  // between e.g. "/search?q=a" and "/search?q=b".
  const routeKey = searchParamsString
    ? `${pathname}?${searchParamsString}`
    : pathname

  // Refs are used instead of state to avoid extra renders and to let event
  // handlers/effects always read latest values synchronously.
  const loadedRef = useRef(false)
  const currentRouteKeyRef = useRef(routeKey)
  const isNavigatingRef = useRef(isNavigating)
  // While restoration is actively applying scroll positions, ignore passive
  // scroll persistence so we do not overwrite the saved value with 0/clamped data.
  const isRestoringRef = useRef(false)
  // Native browser back/forward can arrive outside our managed navigation path,
  // so we keep a dedicated retry loop handle for that restore flow.
  const popstateRestoreFrameRef = useRef(0)

  // Set by navigation event/popstate. Determines if *next* route applies saved
  // scroll (history navigation) or resets to top (push/replace).
  const shouldRestoreNextRouteRef = useRef(false)
  const pageScrollMapRef = useRef<ScrollMap>({})
  const horizontalScrollMapRef = useRef<ScrollMap>({})

  const ensureStorageLoaded = useCallback(() => {
    if (loadedRef.current) return

    try {
      // Read once from sessionStorage, then operate in-memory for speed.
      pageScrollMapRef.current = parseScrollMap(
        sessionStorage.getItem(PAGE_SCROLL_STORAGE_KEY)
      )
      horizontalScrollMapRef.current = parseScrollMap(
        sessionStorage.getItem(HORIZONTAL_SCROLL_STORAGE_KEY)
      )
    } catch {
      pageScrollMapRef.current = {}
      horizontalScrollMapRef.current = {}
    }

    loadedRef.current = true
  }, [])

  const persistPageScrollMap = useCallback(() => {
    try {
      // Persist after each write so a hard refresh/browser kill still keeps
      // the latest known state for this session.
      sessionStorage.setItem(
        PAGE_SCROLL_STORAGE_KEY,
        JSON.stringify(pageScrollMapRef.current)
      )
    } catch {
      // Ignore storage errors (quota, privacy mode, etc.)
    }
  }, [])

  const persistHorizontalScrollMap = useCallback(() => {
    try {
      sessionStorage.setItem(
        HORIZONTAL_SCROLL_STORAGE_KEY,
        JSON.stringify(horizontalScrollMapRef.current)
      )
    } catch {
      // Ignore storage errors (quota, privacy mode, etc.)
    }
  }, [])

  const savePageScroll = useCallback(
    (targetRouteKey: string) => {
      ensureStorageLoaded()

      // Main app scroll is on a custom container, not window.
      const scrollContainer = getScrollContainer()
      pageScrollMapRef.current[targetRouteKey] = scrollContainer.scrollTop
      persistPageScrollMap()
    },
    [ensureStorageLoaded, persistPageScrollMap]
  )

  const saveHorizontalScroll = useCallback(
    (targetRouteKey: string) => {
      ensureStorageLoaded()

      // Bulk-save all known horizontal scrollers on route snapshot events.
      const horizontalContainers = document.querySelectorAll<HTMLElement>(
        HORIZONTAL_RESTORE_SELECTOR
      )

      horizontalContainers.forEach((container) => {
        const restoreId = container.dataset.scrollRestoreId
        if (!restoreId) return

        horizontalScrollMapRef.current[getHorizontalScrollKey(targetRouteKey, restoreId)] =
          container.scrollLeft
      })

      persistHorizontalScrollMap()
    },
    [ensureStorageLoaded, persistHorizontalScrollMap]
  )

  const saveHorizontalElementScroll = useCallback(
    (targetRouteKey: string, element: HTMLElement) => {
      ensureStorageLoaded()

      // Hot-path helper for live horizontal scroll events so we only update the
      // exact element that moved.
      const restoreId = element.dataset.scrollRestoreId
      if (!restoreId) return

      horizontalScrollMapRef.current[getHorizontalScrollKey(targetRouteKey, restoreId)] =
        element.scrollLeft
      persistHorizontalScrollMap()
    },
    [ensureStorageLoaded, persistHorizontalScrollMap]
  )

  const restorePageScroll = useCallback((nextScrollTop: number) => {
    const scrollContainer = getScrollContainer()

    // Returning a boolean lets callers retry across frames until layout is tall
    // enough for the requested position to actually stick.
    if (Math.abs(scrollContainer.scrollTop - nextScrollTop) < 1) return true

    scrollContainer.scrollTo({ top: nextScrollTop, behavior: "auto" })
    return Math.abs(scrollContainer.scrollTop - nextScrollTop) < 1
  }, [])

  const resetPageScroll = useCallback(() => {
    // Used for push/replace navigations where we want fresh-page behavior.
    const scrollContainer = getScrollContainer()
    scrollContainer.scrollTo({ top: 0, behavior: "auto" })
  }, [])

  const restoreHorizontalScroll = useCallback(
    (targetRouteKey: string) => {
      ensureStorageLoaded()

      const horizontalContainers = document.querySelectorAll<HTMLElement>(
        HORIZONTAL_RESTORE_SELECTOR
      )

      horizontalContainers.forEach((container) => {
        const restoreId = container.dataset.scrollRestoreId
        if (!restoreId) return

        const nextScrollLeft =
          horizontalScrollMapRef.current[
            getHorizontalScrollKey(targetRouteKey, restoreId)
          ]

        if (typeof nextScrollLeft !== "number") return
        if (Math.abs(container.scrollLeft - nextScrollLeft) < 1) return

        setElementScrollLeftInstant(container, nextScrollLeft)
      })
    },
    [ensureStorageLoaded]
  )

  useEffect(() => {
    // Disable browser native restoration because we handle a custom scroll
    // container + custom horizontal regions that the browser does not know.
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = "manual"

    const saveCurrentRouteScroll = () => {
      const currentRouteKey = currentRouteKeyRef.current
      savePageScroll(currentRouteKey)
      saveHorizontalScroll(currentRouteKey)
    }

    window.addEventListener("pagehide", saveCurrentRouteScroll)

    return () => {
      window.removeEventListener("pagehide", saveCurrentRouteScroll)
      saveCurrentRouteScroll()
      window.history.scrollRestoration = previousScrollRestoration
    }
  }, [saveHorizontalScroll, savePageScroll])

  useEffect(() => {
    // Keep ref in sync so passive listeners can read navigation state without
    // stale closure issues.
    isNavigatingRef.current = isNavigating
  }, [isNavigating])

  useEffect(() => {
    const saveBeforeNavigation = (event: Event) => {
      const customEvent = event as CustomEvent<NavigationSaveDetail>
      const currentRouteKey = currentRouteKeyRef.current

      // Save intent for the upcoming route transition.
      shouldRestoreNextRouteRef.current =
        customEvent.detail?.restoreScroll ?? false

      // Snapshot immediately before navigation UI state changes.
      savePageScroll(currentRouteKey)
      saveHorizontalScroll(currentRouteKey)
    }

    window.addEventListener(NAVIGATION_SAVE_EVENT, saveBeforeNavigation)

    return () => {
      window.removeEventListener(NAVIGATION_SAVE_EVENT, saveBeforeNavigation)
    }
  }, [saveHorizontalScroll, savePageScroll])

  useEffect(() => {
    const onPopState = () => {
      // Managed back/forward already opts into restoration before history
      // navigation starts. The special path below is only for native browser
      // history, where popstate can arrive after the route effect has reset
      // scroll to top.
      if (shouldRestoreNextRouteRef.current) return

      ensureStorageLoaded()

      // Browser back/forward should restore previous scroll.
      shouldRestoreNextRouteRef.current = true
      const targetRouteKey = getLocationRouteKey()
      // Use the live browser URL here because this handler exists specifically
      // for cases where the route effect observed the destination too early.
      currentRouteKeyRef.current = targetRouteKey

      if (popstateRestoreFrameRef.current !== 0) {
        window.cancelAnimationFrame(popstateRestoreFrameRef.current)
      }

      const targetPageScrollTop = pageScrollMapRef.current[targetRouteKey] ?? 0
      let pageRestoreAttempts = 0
      let horizontalRestoreAttempts = 0

      const runPopstateRestore = () => {
        // Mirror the normal restore path, but decoupled from route-effect timing.
        isRestoringRef.current = true

        let shouldContinue = false
        const pageRestored = restorePageScroll(targetPageScrollTop)
        pageRestoreAttempts += 1

        if (!pageRestored && pageRestoreAttempts < PAGE_RESTORE_ATTEMPTS) {
          shouldContinue = true
        }

        restoreHorizontalScroll(targetRouteKey)
        horizontalRestoreAttempts += 1

        if (horizontalRestoreAttempts < HORIZONTAL_RESTORE_ATTEMPTS) {
          shouldContinue = true
        }

        if (shouldContinue) {
          popstateRestoreFrameRef.current =
            window.requestAnimationFrame(runPopstateRestore)
        } else {
          isRestoringRef.current = false
          popstateRestoreFrameRef.current = 0
        }
      }

      popstateRestoreFrameRef.current =
        window.requestAnimationFrame(runPopstateRestore)
    }

    window.addEventListener("popstate", onPopState)

    return () => {
      window.removeEventListener("popstate", onPopState)
      if (popstateRestoreFrameRef.current !== 0) {
        window.cancelAnimationFrame(popstateRestoreFrameRef.current)
      }
    }
  }, [ensureStorageLoaded, restoreHorizontalScroll, restorePageScroll])

  useEffect(() => {
    // Wait until loading state is done so we restore against real page content.
    if (isNavigating) return

    ensureStorageLoaded()
    currentRouteKeyRef.current = routeKey
    const shouldRestore = shouldRestoreNextRouteRef.current
    // Capture a stable vertical target once per transition so retries do not
    // chase values that may still be changing in storage.
    const targetPageScrollTop = pageScrollMapRef.current[routeKey] ?? 0
    isRestoringRef.current = shouldRestore

    if (!shouldRestore) {
      resetPageScroll()
    }

    let restoreFrame = 0
    let pageRestoreAttempts = 0
    let horizontalRestoreAttempts = 0

    const runRestore = () => {
      let shouldContinue = false

      if (shouldRestore) {
        // Keep trying until the saved vertical position actually sticks. This
        // covers slower route transitions where content mounts later.
        const pageRestored = restorePageScroll(targetPageScrollTop)
        pageRestoreAttempts += 1

        if (!pageRestored && pageRestoreAttempts < PAGE_RESTORE_ATTEMPTS) {
          shouldContinue = true
        }

        // Re-run across frames to catch late-mounted carousels.
        restoreHorizontalScroll(routeKey)
        horizontalRestoreAttempts += 1

        if (horizontalRestoreAttempts < HORIZONTAL_RESTORE_ATTEMPTS) {
          shouldContinue = true
        }
      }

      if (shouldContinue) {
        restoreFrame = window.requestAnimationFrame(runRestore)
      } else {
        isRestoringRef.current = false
      }
    }

    restoreFrame = window.requestAnimationFrame(runRestore)

    // One-shot flag: applies only to this route transition.
    shouldRestoreNextRouteRef.current = false

    return () => {
      isRestoringRef.current = false
      window.cancelAnimationFrame(restoreFrame)
    }
  }, [
    isNavigating,
    resetPageScroll,
    restoreHorizontalScroll,
    restorePageScroll,
    routeKey
  ])

  useEffect(() => {
    const scrollContainer = getScrollContainer()
    let persistFrame = 0

    const persistCurrentRoute = () => {
      persistFrame = 0

      // During loader/navigation, layout can collapse and emit misleading
      // scroll values. Skip those writes.
      if (isNavigatingRef.current) return
      // Restoration-triggered scroll events should not replace the saved value.
      if (isRestoringRef.current) return
      savePageScroll(routeKey)
    }

    const onPageScroll = () => {
      if (isNavigatingRef.current) return
      if (isRestoringRef.current) return
      // Coalesce rapid scroll events into a single frame-level persistence write.
      if (persistFrame !== 0) return
      persistFrame = window.requestAnimationFrame(persistCurrentRoute)
    }

    scrollContainer.addEventListener("scroll", onPageScroll, { passive: true })

    return () => {
      scrollContainer.removeEventListener("scroll", onPageScroll)
      if (persistFrame !== 0) {
        window.cancelAnimationFrame(persistFrame)
      }
    }
  }, [routeKey, savePageScroll])

  useEffect(() => {
    const onHorizontalScroll = (event: Event) => {
      // Same guard as vertical path: ignore scroll noise while navigating.
      if (isNavigatingRef.current) return
      // Avoid feeding restoration writes back into storage while we replay them.
      if (isRestoringRef.current) return

      const target = event.target
      if (!(target instanceof HTMLElement)) return
      if (!target.dataset.scrollRestoreId) return

      // Persist this specific element for better performance than full scans.
      saveHorizontalElementScroll(routeKey, target)
    }

    // `scroll` does not bubble; we must listen in capture phase.
    document.addEventListener("scroll", onHorizontalScroll, {
      capture: true,
      passive: true
    })

    return () => {
      document.removeEventListener("scroll", onHorizontalScroll, true)
    }
  }, [routeKey, saveHorizontalElementScroll])

  return null
}
