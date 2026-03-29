"use client"

import { buildPlayStationStoreUrl } from "@/lib/igdb-store-links"
import { getCachedPlaystationPrice } from "@/server/actions/playstation"
import { PriceInput } from "@/types"
import { LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import PriceLayout from "./PriceLayout"

export default function PlaystationPrice({
  igdbPlaystationUrlSegment,
  onFetchSuccess
}: {
  igdbPlaystationUrlSegment: string | null
  onFetchSuccess: () => void
}) {
  const [price, setPrice] = useState<PriceInput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [url] = useState<string | null>(
    buildPlayStationStoreUrl(igdbPlaystationUrlSegment || "")
  )

  if (!url)
    return (
      <span className="text-sm text-muted-foreground">
        Not available on Playstation
      </span>
    )

  if (
    !url.includes("playstation.com") &&
    !url.includes("store.playstation.com")
  ) {
    return <span className="text-sm text-red-600">Invalid PS Store Link</span>
  }

  useEffect(() => {
    let cancelled = false

    getCachedPlaystationPrice(url)
      .then((info) => {
        if (cancelled) return
        setPrice(info)
        setError(null)
        onFetchSuccess()
      })
      .catch((err) => {
        console.error("Error fetching PlayStation game info:", err)
        if (cancelled) return
        setPrice(null)

        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch game information"

        setError(
          message === "Price not available"
            ? "Price not available"
            : "Failed to fetch game information"
        )
      })

    return () => {
      cancelled = true
    }
  }, [url])

  return (
    <>
      {!price && !error && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          <span>Fetching price...</span>
        </div>
      )}

      {error && (
        <span
          className={
            error === "Price not available"
              ? "text-sm text-muted-foreground"
              : "text-sm text-red-600"
          }
        >
          {error}
        </span>
      )}

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
