"use client"

import { ACCENT_STORAGE_KEY, Accent } from "@/types/theme"
import { useLayoutEffect } from "react"

export function AccentHydrator() {
  useLayoutEffect(() => {
    const fallbackAccent = Accent.PURPLE

    try {
      const saved = window.localStorage.getItem(ACCENT_STORAGE_KEY)
      const isValidAccent = Object.values(Accent).includes(saved as Accent)
      const nextAccent = isValidAccent ? (saved as Accent) : fallbackAccent

      document.documentElement.dataset.accent = nextAccent

      if (!isValidAccent) {
        window.localStorage.setItem(ACCENT_STORAGE_KEY, nextAccent)
      }
    } catch {
      document.documentElement.dataset.accent = fallbackAccent
    }
  }, [])

  return null
}
