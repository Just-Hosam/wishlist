"use client"

import { useRouter } from "@/components/navigation"
import {
  getConnectionEffectiveType,
  getDisplayMode,
  readCurrentLaunch,
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
      effectiveType: getConnectionEffectiveType()
    })

    if (supportsServiceWorker) {
      navigator.serviceWorker.addEventListener("message", onMessage)
      navigator.serviceWorker.controller?.postMessage({
        type: "get-launch-cache-result"
      })
    }

    router.prefetch("/wishlist")

    let frame2 = 0
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        router.replace("/wishlist")
      })
    })

    return () => {
      if (supportsServiceWorker) {
        navigator.serviceWorker.removeEventListener("message", onMessage)
      }
      cancelAnimationFrame(frame1)
      cancelAnimationFrame(frame2)
    }
  }, [router])

  return null
}
