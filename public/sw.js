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
const SW_VERSION = "0.3.69"

// Keep one small cache dedicated to startup-critical responses.
const BOOT_CACHE = `boot-cache-${SW_VERSION}`
// Store remote IGDB artwork separately from boot assets so image churn does
// not evict the tiny shell cache used for fast startup.
const IGDB_IMAGE_CACHE = "igdb-image-cache-v1"
// CacheStorage cannot attach custom metadata to entries, so keep TTL metadata
// in a parallel cache keyed by the same request URL.
const IGDB_IMAGE_META_CACHE = "igdb-image-meta-v1"
// IGDB image URLs are content-addressed enough to tolerate long-lived reuse.
const IGDB_IMAGE_TTL_MS = 2_592_000_000 // 30 days

// "App shell" = the smallest set of assets needed for very fast startup.
// `/launch` is a light page in this app that immediately routes onward.
const APP_SHELL_URL = "/launch"
const PRECACHE_URLS = [APP_SHELL_URL]

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
  // On activate, rotate versioned boot caches while preserving long-lived
  // IGDB image caches across releases.
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames.map((cacheName) => {
            if (shouldDeleteCache(cacheName)) {
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

  if (!isGET) return

  // IGDB images are a separate cross-origin cache path. Keep them out of the
  // boot cache and allow stale entries to cover offline/error cases while
  // refreshing from network whenever the TTL has expired.
  const isIGDBImageRequest = requestUrl.href.startsWith(
    "https://images.igdb.com/igdb/image/upload/"
  )
  if (isIGDBImageRequest) {
    event.respondWith(serveIGDBImage(request))
    return
  }

  const isSameOrigin = requestUrl.origin === self.location.origin
  const isAPIRoute = requestUrl.pathname.startsWith("/api/")

  if (!isSameOrigin || isAPIRoute) return

  // Navigation strategy for app shell:
  // cache-first gives the fastest possible bootstrap path for `/launch`.
  const isAppShellRoute =
    request.mode === "navigate" && requestUrl.pathname === APP_SHELL_URL
  if (isAppShellRoute) {
    event.respondWith(cacheFirst(request, APP_SHELL_URL))
    return
  }

  // Next.js build assets are content-hashed, so cache-first is a good fit:
  // if the URL stays the same, the bytes are the same. New deploys produce
  // new asset URLs and this worker version can still rotate old caches away.
  if (isBootStaticAsset(requestUrl.pathname)) {
    event.respondWith(cacheFirst(request))
  }
})

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

async function serveIGDBImage(request) {
  const imageCache = await caches.open(IGDB_IMAGE_CACHE)
  const metadataCache = await caches.open(IGDB_IMAGE_META_CACHE)
  const cacheKey = request
  const metaCacheKey = request.url

  const [cachedResponse, cachedAt] = await Promise.all([
    imageCache.match(cacheKey),
    readCachedAt(metadataCache, metaCacheKey)
  ])

  const isExpired = (cachedAt) => Date.now() - cachedAt >= IGDB_IMAGE_TTL_MS
  const isCacheValid = cachedAt && !isExpired(cachedAt)

  if (cachedResponse && isCacheValid) return cachedResponse

  try {
    const response = await fetch(request)

    const isCachable = response.ok || response.type === "opaque"

    if (isCachable) {
      await Promise.all([
        imageCache.put(cacheKey, response.clone()),
        writeCachedAt(metadataCache, metaCacheKey, Date.now())
      ])
    }

    return response
  } catch (error) {
    // Return stale cache if new response fails
    if (cachedResponse) return cachedResponse

    throw error
  }
}

async function readCachedAt(cache, cacheKey) {
  const response = await cache.match(cacheKey)

  if (!response) return null

  try {
    // Treat malformed metadata as a miss so the image is refreshed normally.
    const data = await response.json()
    const cachedAt = Number(data?.cachedAt)
    return Number.isFinite(cachedAt) ? cachedAt : null
  } catch {
    return null
  }
}

async function writeCachedAt(cache, cacheKey, cachedAt) {
  // Store only the timestamp we need for TTL checks; image bytes live in the
  // separate artwork cache.
  const response = new Response(JSON.stringify({ cachedAt }), {
    headers: {
      "content-type": "application/json"
    }
  })

  await cache.put(cacheKey, response)
}

function isBootStaticAsset(pathname) {
  // Keep this list intentionally narrow. `/_next/static/` contains the
  // hashed JS/CSS chunks needed to hydrate and navigate quickly on repeat
  // launches, without pulling dynamic HTML or user-specific data into SW.
  return pathname.startsWith("/_next/static/")
}

function shouldDeleteCache(cacheName) {
  // Rotate versioned caches within each namespace, but leave unrelated caches
  // untouched in case the browser stores entries from other features/origins.
  if (cacheName.startsWith("boot-cache-")) {
    return cacheName !== BOOT_CACHE
  }

  if (cacheName.startsWith("igdb-image-cache-")) {
    return cacheName !== IGDB_IMAGE_CACHE
  }

  if (cacheName.startsWith("igdb-image-meta-")) {
    return cacheName !== IGDB_IMAGE_META_CACHE
  }

  return false
}
