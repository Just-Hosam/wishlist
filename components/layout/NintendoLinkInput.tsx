"use client"

import { Switch } from "@/components/ui/switch"
import { fetchNintendoGameInfo } from "@/server/actions/nintendo"
import { PriceInput } from "@/types"
import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import PriceLayout from "./PriceLayout"

interface NintendoLinkInputProps {
  url: string | null
  onLinked: ((isLinked: boolean | null) => void) | null
  isInitiallyLinked?: boolean | null
  hideSwitch?: boolean
}

export default function NintendoLinkInput({
  url,
  onLinked,
  isInitiallyLinked = false,
  hideSwitch = false
}: NintendoLinkInputProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [priceData, setPriceData] = useState<PriceInput | null>(null)
  const [isLinked, setIsLinked] = useState(isInitiallyLinked)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPriceData(url || "")
  }, [url])

  const fetchPriceData = async (urlToFetch: string) => {
    if (!urlToFetch.trim()) return

    if (!urlToFetch.includes("nintendo.com")) {
      setError("Invalid Nintendo store URL")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const info = await fetchNintendoGameInfo(urlToFetch)
      setPriceData(info)
      setError(null)
    } catch (error) {
      console.error("Error fetching Nintendo game info:", error)
      setError("Failed to fetch game information")
      setPriceData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = (checked: boolean) => {
    setIsLinked(checked)
    onLinked?.(checked)
  }

  return (
    <div>
      <div className="flex items-center">
        <Image
          src="/logos/nintendo-switch.svg"
          alt="Nintendo Switch Logo"
          width={20}
          height={20}
          className="mr-3"
        />

        <div className="flex min-w-0 flex-1 items-center gap-2">
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Fetching price...</span>
            </div>
          )}

          {!isLoading && priceData && (
            <PriceLayout
              onSale={
                (priceData.currentPrice || 0) < (priceData.regularPrice || 0)
              }
              currentPrice={priceData.currentPrice || 0}
              regularPrice={priceData.regularPrice || 0}
              currency="CAD"
            />
          )}

          {!isLoading && !error && !url && (
            <span className="text-sm text-muted-foreground">
              Not available on Nintendo
            </span>
          )}

          {!isLoading && error && (
            <span className="text-sm text-red-600">{error}</span>
          )}
        </div>

        {!hideSwitch && (
          <Switch
            checked={isLinked ?? false}
            onCheckedChange={handleToggle}
            disabled={
              !url ||
              isLoading ||
              (!priceData && !error) ||
              (!!error && !isLinked)
            }
            className="data-[state=checked]:bg-red-600"
          />
        )}
      </div>
    </div>
  )
}
