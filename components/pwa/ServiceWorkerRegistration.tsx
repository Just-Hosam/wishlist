"use client"

import { useEffect } from "react"

const SERVICE_WORKER_PATH = "/sw.js"

export function ServiceWorkerRegistration() {
  useEffect(() => {
    const notProductionEnv = process.env.NODE_ENV !== "production"
    const noSWSupport = !("serviceWorker" in navigator)

    if (notProductionEnv || noSWSupport) return

    // If the document is already loaded, we can skip waiting for the load event
    const documentAlreadyLoaded = document.readyState === "complete"
    if (documentAlreadyLoaded) {
      void registerServiceWorker()
      return
    }

    const onLoad = () => void registerServiceWorker()
    window.addEventListener("load", onLoad)

    return () => window.removeEventListener("load", onLoad)
  }, [])

  return null
}

async function registerServiceWorker() {
  try {
    await navigator.serviceWorker.register(SERVICE_WORKER_PATH)
  } catch (error) {
    console.warn("Service worker registration failed", error)
  }
}
