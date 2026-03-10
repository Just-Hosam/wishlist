"use client"

import {
  appendCurrentLaunchMarker,
  appendLaunchHistory,
  capturePaintTimings,
  captureRelevantResourceTimings,
  clearCurrentLaunch,
  readCurrentLaunch
} from "@/lib/pwa-diagnostics"
import { useEffect } from "react"

export function LaunchCompleteMarker() {
  useEffect(() => {
    const current = readCurrentLaunch()
    if (!current || current.completedAt) return

    appendCurrentLaunchMarker("wishlist-marker-mounted")

    let frame2 = 0
    const frame1 = requestAnimationFrame(() => {
      appendCurrentLaunchMarker("wishlist-raf-1")

      frame2 = requestAnimationFrame(() => {
        appendCurrentLaunchMarker("wishlist-raf-2")

        const latest = readCurrentLaunch()
        if (!latest) return

        const completedAt = performance.now()

        appendLaunchHistory({
          ...latest,
          completedAt,
          durationMs: Math.round(completedAt - latest.startedAt),
          paintTimings: capturePaintTimings(),
          resourceTimings: captureRelevantResourceTimings(),
          markers: [
            ...latest.markers,
            {
              label: "launch-finalized",
              atMs: Math.round(completedAt - latest.startedAt),
              detail: "wishlist second frame"
            }
          ]
        })

        clearCurrentLaunch()
      })
    })

    return () => {
      cancelAnimationFrame(frame1)
      cancelAnimationFrame(frame2)
    }
  }, [])

  return null
}
