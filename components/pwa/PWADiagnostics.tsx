"use client"

import {
  clearLaunchHistory,
  getConnectionEffectiveType,
  getDisplayMode,
  LaunchDiagnostic,
  LaunchMarker,
  readLaunchHistory
} from "@/lib/pwa-diagnostics"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"

type DiagnosticSnapshot = {
  appVersion: string | null
  serviceWorkerSupported: boolean
  controlled: boolean
  scope: string | null
  activeScriptURL: string | null
  hasInstallingWorker: boolean
  hasWaitingWorker: boolean
  displayMode: "standalone" | "browser"
  online: boolean
  effectiveType: string | null
  bootCacheName: string | null
  launchCached: boolean
  staticAssetCount: number
  history: LaunchDiagnostic[]
}

const EMPTY_SNAPSHOT: DiagnosticSnapshot = {
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION ?? null,
  serviceWorkerSupported: false,
  controlled: false,
  scope: null,
  activeScriptURL: null,
  hasInstallingWorker: false,
  hasWaitingWorker: false,
  displayMode: "browser",
  online: true,
  effectiveType: null,
  bootCacheName: null,
  launchCached: false,
  staticAssetCount: 0,
  history: []
}

export function PWADiagnostics() {
  const [snapshot, setSnapshot] = useState<DiagnosticSnapshot>(EMPTY_SNAPSHOT)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshSnapshot = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const nextSnapshot: DiagnosticSnapshot = {
        ...EMPTY_SNAPSHOT,
        displayMode: getDisplayMode(),
        online: navigator.onLine,
        effectiveType: getConnectionEffectiveType(),
        serviceWorkerSupported: "serviceWorker" in navigator,
        controlled: !!navigator.serviceWorker?.controller,
        history: readLaunchHistory()
      }

      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.getRegistration()

        nextSnapshot.scope = registration?.scope ?? null
        nextSnapshot.activeScriptURL = registration?.active?.scriptURL ?? null
        nextSnapshot.hasInstallingWorker = !!registration?.installing
        nextSnapshot.hasWaitingWorker = !!registration?.waiting
      }

      if ("caches" in window) {
        const cacheNames = await caches.keys()
        const bootCacheName =
          cacheNames.find((name) => name.startsWith("boot-cache-")) ?? null

        nextSnapshot.bootCacheName = bootCacheName

        if (bootCacheName) {
          const cache = await caches.open(bootCacheName)
          const launchResponse = await cache.match("/launch")
          const requests = await cache.keys()

          nextSnapshot.launchCached = !!launchResponse
          nextSnapshot.staticAssetCount = requests.filter((request) => {
            try {
              return new URL(request.url).pathname.startsWith("/_next/static/")
            } catch {
              return false
            }
          }).length
        }
      }

      setSnapshot(nextSnapshot)
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Failed to load diagnostics"
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void refreshSnapshot()
  }, [])

  const handleClearHistory = () => {
    clearLaunchHistory()
    setSnapshot((prev) => ({ ...prev, history: [] }))
  }

  return (
    <div className="custom-slide-up-fade-in space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">PWA Diagnostics</h1>
        <p className="text-sm text-muted-foreground">
          Inspect the current service worker state, boot cache, and recent
          `/launch` timing samples.
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={() => void refreshSnapshot()} size="sm" variant="outline">
          Refresh
        </Button>
        <Button onClick={handleClearHistory} size="sm" variant="ghost">
          Clear History
        </Button>
      </div>

      {error && (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="rounded-3xl border p-4">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          Current
        </h2>
        <div className="grid gap-2 text-sm">
          <DiagnosticRow label="App version" value={snapshot.appVersion ?? "-"} />
          <DiagnosticRow
            label="Service worker support"
            value={snapshot.serviceWorkerSupported ? "yes" : "no"}
          />
          <DiagnosticRow
            label="Service worker controlled"
            value={snapshot.controlled ? "yes" : "no"}
          />
          <DiagnosticRow
            label="Installing worker"
            value={snapshot.hasInstallingWorker ? "yes" : "no"}
          />
          <DiagnosticRow
            label="Waiting worker"
            value={snapshot.hasWaitingWorker ? "yes" : "no"}
          />
          <DiagnosticRow label="Scope" value={snapshot.scope ?? "-"} />
          <DiagnosticRow
            label="Active script"
            value={snapshot.activeScriptURL ?? "-"}
          />
          <DiagnosticRow label="Display mode" value={snapshot.displayMode} />
          <DiagnosticRow label="Online" value={snapshot.online ? "yes" : "no"} />
          <DiagnosticRow
            label="Connection type"
            value={snapshot.effectiveType ?? "-"}
          />
        </div>
      </section>

      <section className="rounded-3xl border p-4">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          Boot Cache
        </h2>
        <div className="grid gap-2 text-sm">
          <DiagnosticRow
            label="Cache name"
            value={snapshot.bootCacheName ?? "-"}
          />
          <DiagnosticRow
            label="/launch cached"
            value={snapshot.launchCached ? "yes" : "no"}
          />
          <DiagnosticRow
            label="Static asset entries"
            value={String(snapshot.staticAssetCount)}
          />
        </div>
      </section>

      <section className="rounded-3xl border p-4">
        <div className="mb-3 flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Recent Launches
          </h2>
          <div className="text-xs text-muted-foreground">
            {isLoading ? "Loading..." : `${snapshot.history.length} samples`}
          </div>
        </div>

        {snapshot.history.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No launch samples recorded yet.
          </p>
        ) : (
          <div className="space-y-3">
            {snapshot.history.map((entry) => (
              <details
                key={entry.id}
                className="rounded-2xl bg-secondary/40 p-3 text-sm"
              >
                <summary className="cursor-pointer list-none">
                  <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-medium">
                      {formatDuration(entry.durationMs)}
                    </span>
                    <span className="text-muted-foreground">
                      {formatRecordedAt(entry.recordedAt)}
                    </span>
                  </div>
                  <div className="grid gap-1 text-muted-foreground">
                    <span>
                      cache {entry.launchCacheResult} | controlled{" "}
                      {entry.swControlled ? "yes" : "no"} | mode{" "}
                      {entry.displayMode}
                    </span>
                    <span>
                      sw {entry.swVersion ?? "-"} | app {entry.appVersion ?? "-"}
                    </span>
                    <span>
                      online {entry.online ? "yes" : "no"} | connection{" "}
                      {entry.effectiveType ?? "-"}
                    </span>
                    <span>{formatPhaseSummary(entry)}</span>
                  </div>
                </summary>

                <div className="mt-4 space-y-4 border-t pt-4">
                  <section className="space-y-2">
                    <h3 className="font-medium">Timeline</h3>
                    {entry.markers.length === 0 ? (
                      <p className="text-muted-foreground">No markers captured.</p>
                    ) : (
                      <div className="space-y-2">
                        {entry.markers.map((marker, index) => (
                          <div
                            key={`${entry.id}-${marker.label}-${index}`}
                            className="grid gap-1 rounded-xl bg-background/60 p-2"
                          >
                            <div className="flex items-baseline justify-between gap-3">
                              <span className="font-mono text-xs text-muted-foreground">
                                {formatOffset(marker.atMs)}
                              </span>
                              <span className="flex-1">{marker.label}</span>
                            </div>
                            {marker.detail && (
                              <div className="text-xs text-muted-foreground">
                                {marker.detail}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-medium">Navigation Timing</h3>
                    {entry.navigationTiming ? (
                      <div className="grid gap-2 rounded-xl bg-background/60 p-3 text-xs text-muted-foreground">
                        <span>
                          type {entry.navigationTiming.type} | redirects{" "}
                          {entry.navigationTiming.redirectCount}
                        </span>
                        <span>
                          fetch {formatOffset(entry.navigationTiming.fetchStart)} |
                          request {formatOffset(entry.navigationTiming.requestStart)} |
                          response start{" "}
                          {formatOffset(entry.navigationTiming.responseStart)} |
                          response end{" "}
                          {formatOffset(entry.navigationTiming.responseEnd)}
                        </span>
                        <span>
                          dom interactive{" "}
                          {formatOffset(entry.navigationTiming.domInteractive)} |
                          dcl{" "}
                          {formatOffset(
                            entry.navigationTiming.domContentLoadedEventEnd
                          )}{" "}
                          | load {formatOffset(entry.navigationTiming.loadEventEnd)}
                        </span>
                        <span>
                          transfer {formatBytes(entry.navigationTiming.transferSize)} |
                          encoded{" "}
                          {formatBytes(entry.navigationTiming.encodedBodySize)} |
                          decoded{" "}
                          {formatBytes(entry.navigationTiming.decodedBodySize)}
                        </span>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        No navigation timing captured.
                      </p>
                    )}
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-medium">Paint Timing</h3>
                    {entry.paintTimings.length === 0 ? (
                      <p className="text-muted-foreground">No paint entries captured.</p>
                    ) : (
                      <div className="grid gap-2 rounded-xl bg-background/60 p-3 text-xs text-muted-foreground">
                        {entry.paintTimings.map((paint) => (
                          <span key={`${entry.id}-${paint.name}`}>
                            {paint.name} {formatOffset(paint.startTime)}
                          </span>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="space-y-2">
                    <h3 className="font-medium">Relevant Requests</h3>
                    {entry.resourceTimings.length === 0 ? (
                      <p className="text-muted-foreground">
                        No matching resource timings captured.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {entry.resourceTimings.map((resource) => (
                          <div
                            key={`${entry.id}-${resource.name}-${resource.startTime}`}
                            className="grid gap-1 rounded-xl bg-background/60 p-2 text-xs text-muted-foreground"
                          >
                            <span className="break-all font-mono text-[11px]">
                              {resource.name}
                            </span>
                            <span>
                              {resource.initiatorType} | start{" "}
                              {formatOffset(resource.startTime)} | end{" "}
                              {formatOffset(resource.responseEnd)} | duration{" "}
                              {formatOffset(resource.duration)}
                            </span>
                            <span>
                              transfer {formatBytes(resource.transferSize)} |
                              encoded {formatBytes(resource.encodedBodySize)} |
                              decoded {formatBytes(resource.decodedBodySize)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              </details>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function DiagnosticRow({
  label,
  value
}: {
  label: string
  value: string
}) {
  return (
    <div className="grid gap-1 md:grid-cols-[180px_1fr] md:gap-4">
      <div className="text-muted-foreground">{label}</div>
      <div className="break-all font-mono text-xs md:text-sm">{value}</div>
    </div>
  )
}

function formatDuration(durationMs: number | null) {
  if (durationMs === null) return "- ms"
  return `${durationMs} ms`
}

function formatOffset(value: number | null) {
  if (value === null) return "- ms"
  return `${Math.round(value)} ms`
}

function formatRecordedAt(recordedAt: string | null) {
  if (!recordedAt) return "Unknown launch time"

  const date = new Date(recordedAt)
  if (Number.isNaN(date.getTime())) return "Unknown launch time"

  return date.toLocaleString()
}

function formatPhaseSummary(entry: LaunchDiagnostic) {
  const swMessage = findMarker(entry.markers, "sw-message-received")
  const replaceCalled = findMarker(entry.markers, "wishlist-replace-called")
  const wishlistMount = findMarker(entry.markers, "wishlist-marker-mounted")

  return [
    `sw ${formatMaybeMarker(swMessage)}`,
    `replace ${formatMaybeMarker(replaceCalled)}`,
    `mount ${formatMaybeMarker(wishlistMount)}`
  ].join(" | ")
}

function findMarker(markers: LaunchMarker[], label: string) {
  return markers.find((marker) => marker.label === label) ?? null
}

function formatMaybeMarker(marker: LaunchMarker | null) {
  if (!marker) return "-"
  return formatOffset(marker.atMs)
}

function formatBytes(value: number | null) {
  if (value === null || value === 0) return "-"

  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`

  return `${(value / (1024 * 1024)).toFixed(2)} MB`
}
