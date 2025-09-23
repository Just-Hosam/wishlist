"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type GamePrice } from "@/lib/playstation-price"
import { CircleCheck, Link, Loader2, X } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import PriceLayout from "./PriceLayout"

interface PlayStationLinkInputProps {
  onGameInfoFound: (gameInfo: GamePrice) => void
  onGameInfoCleared: () => void
  className?: string
  existingGameInfo?: GamePrice | null
}

export default function PlayStationLinkInput({
  onGameInfoFound,
  onGameInfoCleared,
  className,
  existingGameInfo
}: PlayStationLinkInputProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [gameInfo, setGameInfo] = useState<GamePrice | null>(null)

  // Initialize with existing game info if provided
  useEffect(() => {
    if (existingGameInfo) {
      setGameInfo(existingGameInfo)
    }
  }, [existingGameInfo])

  const handleFetchGameInfo = async () => {
    if (!url.trim()) {
      toast.error("Please enter a PlayStation store URL")
      return
    }

    // Basic URL validation for PlayStation store
    if (
      !url.includes("playstation.com") &&
      !url.includes("store.playstation.com")
    ) {
      toast.error("Please enter a valid PlayStation store URL")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/playstation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch game information")
      }

      const info = await response.json()
      setGameInfo(info)
      console.log("PlayStation info :>>", info)

      onGameInfoFound?.(info)
      toast.success("Game information fetched successfully!")
    } catch (error) {
      console.error("Error fetching PlayStation game info:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to fetch game information"
      )
    } finally {
      setIsLoading(false)
    }
  }

  const clearGameInfo = () => {
    setGameInfo(null)
    setUrl("")
    onGameInfoCleared()
  }

  const Price = () => {
    if (!gameInfo) return null

    // Extract numeric values from price strings
    const currentPrice = parseFloat(
      gameInfo.currentPrice.replace(/[^0-9.]/g, "")
    )
    const regularPrice = parseFloat(gameInfo.basePrice.replace(/[^0-9.]/g, ""))
    const isOnSale = currentPrice < regularPrice

    return (
      <PriceLayout
        onSale={isOnSale}
        currentPrice={currentPrice}
        regularPrice={regularPrice}
        currency={gameInfo.currency}
      />
    )
  }

  return (
    <div className={className}>
      <label
        className="flex items-center gap-2 text-sm font-semibold"
        htmlFor="playstation-url"
      >
        <Image
          src="/playstation.svg"
          alt="PlayStation Logo"
          width={18}
          height={18}
        />
        PlayStation
      </label>

      {gameInfo ? (
        <div className="mt-2 flex min-h-[40px] items-center justify-between gap-2 rounded-lg border border-input pl-3 pr-2">
          <div className="flex items-center gap-2">
            <CircleCheck
              size={19}
              className="rounded-full bg-green-600 text-white"
            />
            <Price />
          </div>
          <X className="p-[3px]" onClick={clearGameInfo} />
        </div>
      ) : (
        <div className="mt-2 flex gap-2">
          <Input
            id="playstation-url"
            type="url"
            placeholder="store.playstation.com/en-ca/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="button"
            onClick={handleFetchGameInfo}
            disabled={isLoading || !url.trim()}
            className="w-fit bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Link className="h-4 w-4" />{" "}
                <span className="hidden md:block">Link</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
