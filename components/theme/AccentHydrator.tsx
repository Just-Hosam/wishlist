"use client"

import { useEffect } from "react"
import { ACCENT_STORAGE_KEY, Accent } from "@/types/theme"

/**
 * Minimal client-only hydration:
 * - Reads last chosen accent from localStorage.
 * - Applies it to <html data-accent=...> so CSS vars switch themes.
 * - No server roundtrips or DB writes in this V1.
 */
export function AccentHydrator() {
  useEffect(() => {
    const fallbackAccent = Accent.PURPLE

    try {
      const saved = window.localStorage.getItem(ACCENT_STORAGE_KEY)
      const isValidAccent = Object.values(Accent).includes(saved as Accent)
      const nextAccent = isValidAccent ? (saved as Accent) : fallbackAccent

      document.documentElement.dataset.accent = nextAccent

      // Keep storage clean so future reads are consistent.
      if (!isValidAccent) {
        window.localStorage.setItem(ACCENT_STORAGE_KEY, nextAccent)
      }
    } catch {
      document.documentElement.dataset.accent = fallbackAccent
    }
  }, [])

  return null
}
