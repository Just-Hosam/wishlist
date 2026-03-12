/*
  Minimal app-shell service worker.

  Goal:
  - Make repeat visits boot quickly by caching the tiny `/launch` shell and
    the hashed Next.js assets needed to render it.

  Non-goals:
  - We intentionally do NOT cache authenticated HTML pages or API responses,
    because those are user/session-specific and can easily become stale/wrong.
*/

// Bump this string whenever you change SW caching behavior and want to force
// old caches to be cleaned up on activate. This is also enough to force a
// fresh `/launch` shell after you change that route in a meaningful way.
const SW_VERSION = "0.3.55"

// Keep one small cache dedicated to startup-critical responses.
const BOOT_CACHE = `boot-cache-${SW_VERSION}`

// "App shell" = the smallest set of assets needed for very fast startup.
// `/launch` is a light page in this app that immediately routes onward.
const APP_SHELL_URL = "/launch"
const PRECACHE_URLS = [APP_SHELL_URL]
const launchRequestResults = new Map()

self.addEventListener("install", (event) => {
  // waitUntil tells the browser "installation is not done until this resolves".
  // If this rejects, install fails and the old worker keeps controlling clients.
  event.waitUntil(
    caches
      .open(BOOT_CACHE)
      // Precache the lightweight launch route so repeat boots can skip network
      // for the first visible app UI.
      .then((cache) => cache.addAll(PRECACHE_URLS))
      // Ask browser to move this worker to "activating" ASAP.
      // (Activation still obeys lifecycle constraints.)
      .then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", (event) => {
  // On activate, remove caches created by older SW versions.
  // This prevents unbounded cache growth and stale asset usage.
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== BOOT_CACHE) {
              return caches.delete(cacheName)
            }

            // Keep current cache entries untouched.
            return Promise.resolve()
          })
        )
      )
      // Keep activate alive until claim is complete for deterministic takeover.
      .then(() => self.clients.claim())
  )
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const requestUrl = new URL(request.url)

  const isGET = request.method === "GET"
  const isSameOrigin = requestUrl.origin === self.location.origin
  const isAPIRoute = requestUrl.pathname.startsWith("/api/")

  if (!isGET || !isSameOrigin || isAPIRoute) return

  // Navigation strategy for app shell:
  // cache-first gives the fastest possible bootstrap path for `/launch`.
  const isAppShellRoute =
    request.mode === "navigate" && requestUrl.pathname === APP_SHELL_URL
  if (isAppShellRoute) {
    event.respondWith(handleLaunchRequest(event))
    return
  }

  // Next.js build assets are content-hashed, so cache-first is a good fit:
  // if the URL stays the same, the bytes are the same. New deploys produce
  // new asset URLs and this worker version can still rotate old caches away.
  if (isBootStaticAsset(requestUrl.pathname)) {
    event.respondWith(cacheFirst(request))
  }
})

self.addEventListener("message", (event) => {
  if (event.data?.type !== "get-launch-cache-result") return

  const source = event.source
  const clientId = source?.id
  const payload = clientId
    ? launchRequestResults.get(clientId)
    : {
        type: "launch-cache-result",
        result: "unknown",
        swVersion: SW_VERSION
      }

  source?.postMessage(
    payload ?? {
      type: "launch-cache-result",
      result: "unknown",
      swVersion: SW_VERSION
    }
  )

  if (clientId) {
    launchRequestResults.delete(clientId)
  }
})

async function handleLaunchRequest(event) {
  const cache = await caches.open(BOOT_CACHE)
  const cachedResponse = await cache.match(APP_SHELL_URL)
  const clientId = event.resultingClientId || event.clientId

  if (clientId) {
    launchRequestResults.set(clientId, {
      type: "launch-cache-result",
      result: cachedResponse ? "hit" : "miss",
      swVersion: SW_VERSION
    })
  }

  if (cachedResponse) return cachedResponse

  return fetchAndCache(event.request, cache, APP_SHELL_URL)
}

async function cacheFirst(request, cacheKey = request) {
  const cache = await caches.open(BOOT_CACHE)

  // For `/launch` we match using a stable string key so query params do not
  // fragment cache entries. Static assets just use the full request as-is.
  const cachedResponse = await cache.match(cacheKey)

  if (cachedResponse) return cachedResponse

  // Cold start: no cache entry yet, so fall back to network and store it for
  // the next launch.
  return fetchAndCache(request, cache, cacheKey)
}

async function fetchAndCache(request, cache, cacheKey) {
  // If network fails, this throws and caller behavior decides fallback.
  const response = await fetch(request)

  if (response.ok) {
    // Responses are streams; clone before consuming one copy for CacheStorage.
    await cache.put(cacheKey ?? request, response.clone())
  }

  // Non-2xx responses are returned but not cached.
  return response
}

function isBootStaticAsset(pathname) {
  // Keep this list intentionally narrow. `/_next/static/` contains the
  // hashed JS/CSS chunks needed to hydrate and navigate quickly on repeat
  // launches, without pulling dynamic HTML or user-specific data into SW.
  return pathname.startsWith("/_next/static/")
}
