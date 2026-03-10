"use client"

import {
  clearLaunchHistory,
  getConnectionEffectiveType,
  getDisplayMode,
  LaunchDiagnostic,
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
              <article
                key={entry.id}
                className="rounded-2xl bg-secondary/40 p-3 text-sm"
              >
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
                </div>
              </article>
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

function formatRecordedAt(recordedAt: string | null) {
  if (!recordedAt) return "Unknown launch time"

  const date = new Date(recordedAt)
  if (Number.isNaN(date.getTime())) return "Unknown launch time"

  return date.toLocaleString()
}
