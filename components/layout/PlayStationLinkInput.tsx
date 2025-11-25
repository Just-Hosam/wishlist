"use client"

import { Switch } from "@/components/ui/switch"
import { type GamePrice } from "@/lib/playstation-price"
import { fetchPlayStationGameInfo } from "@/server/actions/playstation"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import PriceLayout from "./PriceLayout"

interface PlayStationLinkInputProps {
  onGameInfoFound: (gameInfo: GamePrice) => void
  onGameInfoCleared: () => void
  className?: string
  existingGameInfo?: GamePrice | null
  initialUrl?: string | null
}

export default function PlayStationLinkInput({
  onGameInfoFound,
  onGameInfoCleared,
  className,
  existingGameInfo,
  initialUrl
}: PlayStationLinkInputProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [priceData, setPriceData] = useState<GamePrice | null>(null)
  const [isLinked, setIsLinked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize with existing game info if provided
  useEffect(() => {
    if (existingGameInfo) {
      setPriceData(existingGameInfo)
      setIsLinked(true)
      // Set URL from existing game info so the unlink button isn't disabled
      if (existingGameInfo.storeUrl) {
        setUrl(existingGameInfo.storeUrl)
      }
    }
  }, [existingGameInfo])

  // Initialize URL from initialUrl prop and auto-fetch
  useEffect(() => {
    if (initialUrl && !url) {
      setUrl(initialUrl)
      // Auto-fetch price data if we have an initial URL and not already linked
      if (!existingGameInfo) {
        fetchPriceData(initialUrl)
      }
    }
  }, [initialUrl, existingGameInfo])

  const fetchPriceData = async (urlToFetch: string) => {
    if (!urlToFetch.trim()) {
      return
    }

    // Basic URL validation for PlayStation store
    if (
      !urlToFetch.includes("playstation.com") &&
      !urlToFetch.includes("store.playstation.com")
    ) {
      setError("Please enter a valid PlayStation store URL")
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
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch game information"
      )
      setPriceData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLink = () => {
    if (priceData) {
      setIsLinked(true)
      onGameInfoFound?.(priceData)
    }
  }

  const handleUnlink = () => {
    setIsLinked(false)
    onGameInfoCleared()
  }

  const handleToggle = (checked: boolean) => {
    if (checked) {
      handleLink()
    } else {
      handleUnlink()
    }
  }

  const Price = () => {
    if (!priceData) return null

    // Extract numeric values from price strings
    const currentPrice = parseFloat(
      priceData.currentPrice.replace(/[^0-9.]/g, "")
    )
    const regularPrice = parseFloat(priceData.basePrice.replace(/[^0-9.]/g, ""))
    const isOnSale = currentPrice < regularPrice

    return (
      <PriceLayout
        onSale={isOnSale}
        currentPrice={currentPrice}
        regularPrice={regularPrice}
        currency={priceData.currency}
      />
    )
  }

  return (
    <div className={className}>
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

          {!isLoading && !priceData && !error && !url && (
            <span className="text-sm text-muted-foreground">
              No store URL available
            </span>
          )}
        </div>

        {/* Link/Unlink Switch */}
        <Switch
          checked={isLinked}
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
