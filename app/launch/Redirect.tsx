"use client"

import { useRouter } from "@/components/navigation"
import {
  appendCurrentLaunchMarker,
  captureNavigationTiming,
  capturePaintTimings,
  getConnectionEffectiveType,
  getDisplayMode,
  readCurrentLaunch,
  updateCurrentLaunch,
  writeCurrentLaunch
} from "@/lib/pwa-diagnostics"
import { useEffect } from "react"

export default function Redirect() {
  const router = useRouter()

  useEffect(() => {
    const supportsServiceWorker = "serviceWorker" in navigator

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type !== "launch-cache-result") return

      const current = readCurrentLaunch()
      if (!current) return

      writeCurrentLaunch({
        ...current,
        launchCacheResult: event.data.result ?? "unknown",
        swVersion: event.data.swVersion ?? null
      })

      appendCurrentLaunchMarker(
        "sw-message-received",
        `cache ${event.data.result ?? "unknown"} | sw ${event.data.swVersion ?? "-"}`
      )
    }

    const handleVisibilityChange = () => {
      appendCurrentLaunchMarker(
        "launch-visibilitychange",
        document.visibilityState
      )
    }

    const handlePageHide = (event: PageTransitionEvent) => {
      appendCurrentLaunchMarker(
        "launch-pagehide",
        event.persisted ? "persisted" : "not-persisted"
      )
    }

    writeCurrentLaunch({
      id: crypto.randomUUID(),
      recordedAt: new Date().toISOString(),
      startedAt: performance.now(),
      completedAt: null,
      durationMs: null,
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? null,
      swControlled: !!navigator.serviceWorker.controller,
      swVersion: null,
      launchCacheResult: "unknown",
      displayMode: getDisplayMode(),
      online: navigator.onLine,
      effectiveType: getConnectionEffectiveType(),
      documentReadyState: document.readyState,
      markers: [
        {
          label: "redirect-effect-start",
          atMs: 0,
          detail: `readyState ${document.readyState}`
        }
      ],
      navigationTiming: captureNavigationTiming(),
      paintTimings: capturePaintTimings(),
      resourceTimings: []
    })

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("pagehide", handlePageHide)

    appendCurrentLaunchMarker(
      "service-worker-support",
      supportsServiceWorker ? "supported" : "unsupported"
    )
    appendCurrentLaunchMarker(
      "service-worker-controller",
      navigator.serviceWorker.controller ? "present" : "missing"
    )

    if (supportsServiceWorker) {
      navigator.serviceWorker.addEventListener("message", onMessage)
      appendCurrentLaunchMarker("sw-listener-attached")
      navigator.serviceWorker.controller?.postMessage({
        type: "get-launch-cache-result"
      })
      appendCurrentLaunchMarker("sw-diagnostic-requested")
    }

    appendCurrentLaunchMarker("wishlist-prefetch-dispatched")
    router.prefetch("/wishlist")

    let frame2 = 0
    const frame1 = requestAnimationFrame(() => {
      appendCurrentLaunchMarker("launch-raf-1")
      frame2 = requestAnimationFrame(() => {
        appendCurrentLaunchMarker("launch-raf-2")
        updateCurrentLaunch((current) => ({
          ...current,
          paintTimings: capturePaintTimings()
        }))
        appendCurrentLaunchMarker("wishlist-replace-called")
        router.replace("/wishlist")
      })
    })

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("pagehide", handlePageHide)
      if (supportsServiceWorker) {
        navigator.serviceWorker.removeEventListener("message", onMessage)
      }
      cancelAnimationFrame(frame1)
      cancelAnimationFrame(frame2)
    }
  }, [router])

  return null
}
