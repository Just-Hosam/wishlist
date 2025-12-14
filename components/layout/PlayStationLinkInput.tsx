"use client"

import { Switch } from "@/components/ui/switch"
import { fetchPlayStationGameInfo } from "@/server/actions/playstation"
import { PriceInput } from "@/types"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import PriceLayout from "./PriceLayout"

interface PlayStationLinkInputProps {
  url: string | null
  onLinked: (isLinked: boolean | null) => void
  isInitiallyLinked?: boolean | null
}

export default function PlayStationLinkInput({
  url,
  onLinked,
  isInitiallyLinked = false
}: PlayStationLinkInputProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [priceData, setPriceData] = useState<PriceInput | null>(null)
  const [isLinked, setIsLinked] = useState(isInitiallyLinked)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPriceData(url || "")
  }, [url])

  const fetchPriceData = async (urlToFetch: string) => {
    if (!urlToFetch.trim()) {
      setError("URL is required")
      return
    }

    // Basic URL validation for PlayStation store
    if (
      !urlToFetch.includes("playstation.com") &&
      !urlToFetch.includes("store.playstation.com")
    ) {
      setError("Invalid PlayStation store URL")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const info = await fetchPlayStationGameInfo(urlToFetch)
      setPriceData(info)
      setError(null)
    } catch (error) {
      console.error("Error fetching PlayStation game info:", error)
      setError("Failed to fetch game information")
      setPriceData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = (checked: boolean) => {
    setIsLinked(checked)
    onLinked(checked)
  }

  const Price = () => {
    if (!priceData) return null

    const currentPrice = priceData.currentPrice || 0
    const regularPrice = priceData.regularPrice || 0
    const isOnSale = currentPrice < regularPrice

    return (
      <PriceLayout
        onSale={isOnSale}
        currentPrice={currentPrice}
        regularPrice={regularPrice}
        currency="USD"
      />
    )
  }

  return (
    <div>
      <div className="flex items-center">
        {/* Store Label */}
        <Image
          src="/logos/playstation.svg"
          alt="PlayStation Logo"
          width={20}
          height={20}
          className="mr-3"
        />

        {/* Spinner or Price Info */}
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Fetching price...</span>
            </div>
          )}

          {!isLoading && priceData && <Price />}

          {!isLoading && error && (
            <span className="text-sm text-red-600">{error}</span>
          )}
        </div>

        <Switch
          checked={isLinked ?? false}
          onCheckedChange={handleToggle}
          disabled={
            !url ||
            isLoading ||
            (!priceData && !error) ||
            (!!error && !isLinked)
          }
          className="data-[state=checked]:bg-blue-600"
        />
      </div>
    </div>
  )
}
