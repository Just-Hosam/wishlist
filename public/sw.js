/*
  Minimal app-shell service worker.

  Goal:
  - Make repeat visits boot quickly by caching a tiny "shell" route and static
    assets used very early in startup.

  Non-goals:
  - We intentionally do NOT cache authenticated HTML pages or API responses,
    because those are user/session-specific and can easily become stale/wrong.
*/

// Bump this string whenever you change SW caching behavior and want to force
// old caches to be cleaned up on activate.
const SW_VERSION = "v1"

// We separate shell and generic static assets so strategy changes are easier.
const APP_SHELL_CACHE = `app-shell-${SW_VERSION}`
const STATIC_ASSETS_CACHE = `static-assets-${SW_VERSION}`

// "App shell" = the smallest set of assets needed for very fast startup.
// `/launch` is a light page in this app that immediately routes onward.
const APP_SHELL_URLS = [
  "/launch",
  "/favicon/favicon-96x96.png",
  "/favicon/web-app-manifest-192x192.png",
  "/favicon/web-app-manifest-512x512.png",
  "/favicon/apple-touch-icon.png",
  "/favicon/favicon.svg",
  "/favicon/favicon.ico"
]

self.addEventListener("install", (event) => {
  // waitUntil tells the browser "installation is not done until this resolves".
  // If this rejects, install fails and the old worker keeps controlling clients.
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      // addAll performs fetch + cache in one step for each URL.
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      // Ask browser to move this worker to "activating" ASAP.
      // (Activation still obeys lifecycle constraints.)
      .then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", (event) => {
  // On activate, remove caches created by older SW versions.
  // This prevents unbounded cache growth and stale asset usage.
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== APP_SHELL_CACHE &&
            cacheName !== STATIC_ASSETS_CACHE
          ) {
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
    request.mode === "navigate" && requestUrl.pathname === "/launch"
  if (isAppShellRoute) {
    const task = cacheFirstAppShell(request)

    event.respondWith(task.then(({ response }) => response))
    event.waitUntil(
      task
        .then(({ revalidate }) => revalidate)
        .catch(() => undefined)
    )

    return
  }

  // Static assets use stale-while-revalidate:
  // - immediate cache response if present
  // - background refresh keeps cache up to date for next visit
  if (isStaticAsset(requestUrl.pathname)) {
    const task = staleWhileRevalidate(request)

    event.respondWith(task.then(({ response }) => response))
    event.waitUntil(
      task
        .then(({ revalidate }) => revalidate)
        .catch(() => undefined)
    )
  }
})

async function cacheFirstAppShell(request) {
  const cache = await caches.open(APP_SHELL_CACHE)

  // Match by a stable string key so query params on `/launch` do not fragment
  // cache entries. We intentionally store and read under "/launch".
  const cachedResponse = await cache.match("/launch")

  if (cachedResponse) {
    // When cache hits, return cached response immediately but also revalidate.
    // The fetch event listener attaches this promise to event.waitUntil().
    return {
      response: cachedResponse,
      revalidate: fetchAndCache(request, cache, "/launch")
    }
  }

  // Cold start: no cache available yet, fetch from network and store it.
  return {
    response: fetchAndCache(request, cache, "/launch"),
    revalidate: null
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_ASSETS_CACHE)
  const cachedResponse = await cache.match(request)

  // Kick off network fetch immediately; if cache hit exists we still return
  // cached bytes first, but network response updates cache for future requests.
  const networkPromise = fetchAndCache(request, cache)

  if (cachedResponse) {
    return {
      response: cachedResponse,
      revalidate: networkPromise
    }
  }

  // Cache miss falls back to network Promise.
  return {
    response: networkPromise,
    revalidate: null
  }
}

async function fetchAndCache(request, cache, cacheKey) {
  // If network fails, this throws and caller behavior decides fallback.
  // For stale-while-revalidate with cache hit, user still got cached response.
  const response = await fetch(request)

  if (response.ok) {
    // Responses are streams; clone before consuming one copy for CacheStorage.
    await cache.put(cacheKey ?? request, response.clone())
  }

  // Non-2xx responses are returned but not cached.
  return response
}

function isStaticAsset(pathname) {
  // Keep this list intentionally narrow to avoid caching dynamic pages.
  return (
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/favicon/") ||
    pathname.startsWith("/pwa/") ||
    pathname.startsWith("/logos/")
  )
}
