"use client"

import { buildSteamStoreUrl } from "@/lib/igdb-store-links"
import { getCachedSteamPrice } from "@/server/actions/steam"
import { PriceInput } from "@/types"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import PriceLayout from "./PriceLayout"

export default function SteamPrice({
  igdbSteamUrlSegment,
  onFetchSuccess
}: {
  igdbSteamUrlSegment: string | null
  onFetchSuccess: () => void
}) {
  const [price, setPrice] = useState<PriceInput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [url] = useState<string | null>(
    buildSteamStoreUrl(igdbSteamUrlSegment || "")
  )

  if (!url)
    return (
      <span className="text-sm text-muted-foreground">
        Not available on Steam
      </span>
    )

  if (!url.includes("store.steampowered.com")) {
    return (
      <span className="text-sm text-red-600">Invalid Steam Store Link</span>
    )
  }

  useEffect(() => {
    let cancelled = false

    getCachedSteamPrice(url)
      .then((info) => {
        if (cancelled) return
        setPrice(info)
        setError(null)
        onFetchSuccess()
      })
      .catch((err) => {
        console.error("Error fetching Steam game info:", err)
        if (cancelled) return
        setPrice(null)
        setError("Failed to fetch game information")
      })

    return () => {
      cancelled = true
    }
  }, [url])

  return (
    <>
      {!price && !error && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Fetching price...</span>
        </div>
      )}

      {error && <span className="text-sm text-red-600">{error}</span>}

      {!error && price && (
        <PriceLayout
          onSale={(price.currentPrice || 0) < (price.regularPrice || 0)}
          currentPrice={price.currentPrice || 0}
          regularPrice={price.regularPrice || 0}
          currency="CAD"
        />
      )}
    </>
  )
}
