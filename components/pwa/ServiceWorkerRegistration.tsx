"use client"

import { useEffect } from "react"

const SERVICE_WORKER_PATH = "/sw.js"

export function ServiceWorkerRegistration() {
  useEffect(() => {
    const notProductionEnv = process.env.NODE_ENV !== "production"
    const noSWSupport = !("serviceWorker" in navigator)

    if (notProductionEnv || noSWSupport) return

    void registerServiceWorker()
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
