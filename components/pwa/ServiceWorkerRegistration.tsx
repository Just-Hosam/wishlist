"use client"

import { PUSH_PERMISSION_GRANTED_EVENT } from "@/types/notifications"
import { useEffect } from "react"

export function ServiceWorkerRegistration() {
  useEffect(() => {
    const notProductionEnv = process.env.NODE_ENV !== "production"
    const noSWSupport = !("serviceWorker" in navigator)

    if (notProductionEnv || noSWSupport) return

    const handlePushPermissionGranted = () => {
      void syncPushSubscription()
    }

    window.addEventListener(
      PUSH_PERMISSION_GRANTED_EVENT,
      handlePushPermissionGranted
    )

    void registerServiceWorker().then((registration) => {
      if (registration) void syncPushSubscription()
    })

    return () => {
      window.removeEventListener(
        PUSH_PERMISSION_GRANTED_EVENT,
        handlePushPermissionGranted
      )
    }
  }, [])

  return null
}

async function syncPushSubscription() {
  const canSubscribeToPush =
    "Notification" in window &&
    "PushManager" in window &&
    Notification.permission === "granted"

  if (!canSubscribeToPush) return

  let registration: ServiceWorkerRegistration | undefined
  try {
    registration = await navigator.serviceWorker.getRegistration()
    if (!registration) return
  } catch (error) {
    console.warn("Failed to get service worker registration", error)
    return
  }

  let subscription: PushSubscription | null
  try {
    subscription =
      (await registration.pushManager.getSubscription()) ??
      (await createPushSubscription(registration))
    if (!subscription) return
  } catch (error) {
    console.warn("Failed to sync push subscription", error)
    return
  }

  console.info("[PUSH] Browser subscription:", subscription.toJSON())
}

async function registerServiceWorker() {
  try {
    return await navigator.serviceWorker.register("/sw.js")
  } catch (error) {
    console.warn("Service worker registration failed", error)
  }
}

async function createPushSubscription(registration: ServiceWorkerRegistration) {
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

  if (!vapidPublicKey) {
    throw new Error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not configured.")
  }

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64UrlToUint8Array(vapidPublicKey)
  })
}

function base64UrlToUint8Array(base64Url: string) {
  const padding = "=".repeat((4 - (base64Url.length % 4)) % 4)
  const base64 = (base64Url + padding).replace(/-/g, "+").replace(/_/g, "/")
  const decodedValue = window.atob(base64)

  return Uint8Array.from(decodedValue, (character) => character.charCodeAt(0))
}
