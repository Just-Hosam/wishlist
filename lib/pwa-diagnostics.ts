export type LaunchCacheResult = "hit" | "miss" | "unknown"

export type LaunchMarker = {
  label: string
  atMs: number
  detail: string | null
}

export type LaunchNavigationTiming = {
  type: string
  redirectCount: number
  workerStart: number
  fetchStart: number
  requestStart: number
  responseStart: number
  responseEnd: number
  domInteractive: number
  domContentLoadedEventEnd: number
  loadEventEnd: number
  transferSize: number | null
  encodedBodySize: number | null
  decodedBodySize: number | null
}

export type LaunchPaintTiming = {
  name: string
  startTime: number
}

export type LaunchResourceTiming = {
  name: string
  initiatorType: string
  startTime: number
  responseEnd: number
  duration: number
  transferSize: number | null
  encodedBodySize: number | null
  decodedBodySize: number | null
}

export type LaunchDiagnostic = {
  id: string
  recordedAt: string | null
  startedAt: number
  completedAt: number | null
  durationMs: number | null
  appVersion: string | null
  swControlled: boolean
  swVersion: string | null
  launchCacheResult: LaunchCacheResult
  displayMode: "standalone" | "browser"
  online: boolean
  effectiveType: string | null
  documentReadyState: DocumentReadyState | null
  markers: LaunchMarker[]
  navigationTiming: LaunchNavigationTiming | null
  paintTimings: LaunchPaintTiming[]
  resourceTimings: LaunchResourceTiming[]
}

const CURRENT_LAUNCH_KEY = "pwa:launch-current"
const LAUNCH_HISTORY_KEY = "pwa:launch-history"
const MAX_HISTORY = 10

export function readCurrentLaunch(): LaunchDiagnostic | null {
  if (typeof window === "undefined") return null

  const raw = sessionStorage.getItem(CURRENT_LAUNCH_KEY)
  if (!raw) return null

  return normalizeLaunchDiagnostic(JSON.parse(raw))
}

export function writeCurrentLaunch(value: LaunchDiagnostic) {
  sessionStorage.setItem(CURRENT_LAUNCH_KEY, JSON.stringify(value))
}

export function clearCurrentLaunch() {
  sessionStorage.removeItem(CURRENT_LAUNCH_KEY)
}

export function readLaunchHistory(): LaunchDiagnostic[] {
  if (typeof window === "undefined") return []

  const raw = localStorage.getItem(LAUNCH_HISTORY_KEY)
  return raw
    ? (JSON.parse(raw) as LaunchDiagnostic[]).map(normalizeLaunchDiagnostic)
    : []
}

export function appendLaunchHistory(value: LaunchDiagnostic) {
  const prev = readLaunchHistory()
  const next = [value, ...prev].slice(0, MAX_HISTORY)

  localStorage.setItem(LAUNCH_HISTORY_KEY, JSON.stringify(next))
}

export function clearLaunchHistory() {
  localStorage.removeItem(LAUNCH_HISTORY_KEY)
}

export function getDisplayMode(): "standalone" | "browser" {
  return window.matchMedia("(display-mode: standalone)").matches
    ? "standalone"
    : "browser"
}

export function getConnectionEffectiveType(): string | null {
  const connection = (
    navigator as Navigator & {
      connection?: { effectiveType?: string }
    }
  ).connection

  return connection?.effectiveType ?? null
}

export function updateCurrentLaunch(
  updater: (current: LaunchDiagnostic) => LaunchDiagnostic
) {
  const current = readCurrentLaunch()
  if (!current) return

  writeCurrentLaunch(updater(current))
}

export function appendCurrentLaunchMarker(label: string, detail?: string | null) {
  updateCurrentLaunch((current) => ({
    ...current,
    markers: [
      ...current.markers,
      {
        label,
        atMs: roundTiming(performance.now() - current.startedAt),
        detail: detail ?? null
      }
    ]
  }))
}

export function captureNavigationTiming(): LaunchNavigationTiming | null {
  const navigationEntry = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming | undefined

  if (!navigationEntry) return null

  return {
    type: navigationEntry.type,
    redirectCount: navigationEntry.redirectCount,
    workerStart: roundTiming(navigationEntry.workerStart),
    fetchStart: roundTiming(navigationEntry.fetchStart),
    requestStart: roundTiming(navigationEntry.requestStart),
    responseStart: roundTiming(navigationEntry.responseStart),
    responseEnd: roundTiming(navigationEntry.responseEnd),
    domInteractive: roundTiming(navigationEntry.domInteractive),
    domContentLoadedEventEnd: roundTiming(
      navigationEntry.domContentLoadedEventEnd
    ),
    loadEventEnd: roundTiming(navigationEntry.loadEventEnd),
    transferSize: roundSize(navigationEntry.transferSize),
    encodedBodySize: roundSize(navigationEntry.encodedBodySize),
    decodedBodySize: roundSize(navigationEntry.decodedBodySize)
  }
}

export function capturePaintTimings(): LaunchPaintTiming[] {
  return performance
    .getEntriesByType("paint")
    .map((entry) => ({
      name: entry.name,
      startTime: roundTiming(entry.startTime)
    }))
}

export function captureRelevantResourceTimings(): LaunchResourceTiming[] {
  return performance
    .getEntriesByType("resource")
    .filter((entry): entry is PerformanceResourceTiming => {
      if (!(entry instanceof PerformanceResourceTiming)) return false

      try {
        const url = new URL(entry.name, window.location.origin)
        return (
          url.origin === window.location.origin &&
          (url.pathname === "/launch" ||
            url.pathname.startsWith("/wishlist") ||
            url.pathname.startsWith("/_next/static/"))
        )
      } catch {
        return false
      }
    })
    .sort((left, right) => left.startTime - right.startTime)
    .slice(-20)
    .map((entry) => {
      const url = new URL(entry.name, window.location.origin)

      return {
        name: `${url.pathname}${url.search}`,
        initiatorType: entry.initiatorType || "unknown",
        startTime: roundTiming(entry.startTime),
        responseEnd: roundTiming(entry.responseEnd),
        duration: roundTiming(entry.duration),
        transferSize: roundSize(entry.transferSize),
        encodedBodySize: roundSize(entry.encodedBodySize),
        decodedBodySize: roundSize(entry.decodedBodySize)
      }
    })
}

function normalizeLaunchDiagnostic(value: LaunchDiagnostic): LaunchDiagnostic {
  return {
    ...value,
    documentReadyState: value.documentReadyState ?? null,
    markers: value.markers ?? [],
    navigationTiming: value.navigationTiming ?? null,
    paintTimings: value.paintTimings ?? [],
    resourceTimings: value.resourceTimings ?? []
  }
}

function roundTiming(value: number) {
  return Math.round(value)
}

function roundSize(value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return null
  return Math.round(value)
}
