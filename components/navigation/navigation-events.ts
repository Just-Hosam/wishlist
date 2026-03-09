"use client"

// Single app-wide event used to capture scroll position *before* we swap UI to
// loading state and/or trigger route transition. This avoids races where the
// old page collapses and we accidentally save 0.
export const NAVIGATION_SAVE_EVENT = "playward:navigation-save"

export interface NavigationSaveDetail {
  // true  => next route should restore previously saved scroll (history-style navigation)
  // false => next route should start at top (normal push/replace UX)
  restoreScroll: boolean
}

// We use a typed CustomEvent so ScrollRestoration can distinguish navigation
// intent (restore vs reset) without coupling directly to router implementation.
export function dispatchNavigationSaveEvent(detail: NavigationSaveDetail) {
  window.dispatchEvent(
    new CustomEvent<NavigationSaveDetail>(NAVIGATION_SAVE_EVENT, { detail })
  )
}
