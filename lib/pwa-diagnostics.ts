export type LaunchCacheResult = "hit" | "miss" | "unknown"

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
}

const CURRENT_LAUNCH_KEY = "pwa:launch-current"
const LAUNCH_HISTORY_KEY = "pwa:launch-history"
const MAX_HISTORY = 10

export function readCurrentLaunch(): LaunchDiagnostic | null {
  if (typeof window === "undefined") return null

  const raw = sessionStorage.getItem(CURRENT_LAUNCH_KEY)
  return raw ? JSON.parse(raw) : null
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
  return raw ? JSON.parse(raw) : []
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
