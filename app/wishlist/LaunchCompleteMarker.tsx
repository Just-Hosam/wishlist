"use client"

import {
  appendLaunchHistory,
  clearCurrentLaunch,
  readCurrentLaunch
} from "@/lib/pwa-diagnostics"
import { useEffect } from "react"

export function LaunchCompleteMarker() {
  useEffect(() => {
    const current = readCurrentLaunch()
    if (!current || current.completedAt) return

    requestAnimationFrame(() => {
      const completedAt = performance.now()

      appendLaunchHistory({
        ...current,
        completedAt,
        durationMs: Math.round(completedAt - current.startedAt)
      })

      clearCurrentLaunch()
    })
  }, [])

  return null
}
