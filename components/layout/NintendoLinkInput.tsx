"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type NintendoGameInfo } from "@/lib/nintendo-price"
import { CircleCheck, Link, Loader2, X } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import PriceLayout from "./PriceLayout"

interface NintendoLinkInputProps {
  onGameInfoFound: (gameInfo: NintendoGameInfo) => void
  onGameInfoCleared: () => void
  className?: string
  existingGameInfo?: NintendoGameInfo | null
}

export default function NintendoLinkInput({
  onGameInfoFound,
  onGameInfoCleared,
  className,
  existingGameInfo
}: NintendoLinkInputProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [gameInfo, setGameInfo] = useState<NintendoGameInfo | null>(null)

  // Initialize with existing game info if provided
  useEffect(() => {
    if (existingGameInfo) {
      setGameInfo(existingGameInfo)
    }
  }, [existingGameInfo])

  const handleFetchGameInfo = async () => {
    if (!url.trim()) {
      toast.error("Please enter a Nintendo store URL")
      return
    }

    // Basic URL validation for Nintendo store
    if (!url.includes("nintendo.com")) {
      toast.error("Please enter a valid Nintendo store URL")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/nintendo", {
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

      onGameInfoFound?.(info)
      toast.success("Game information fetched successfully!")
    } catch (error) {
      console.error("Error fetching game info:", error)
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

    const currentPrice =
      gameInfo.onSale && gameInfo.discounted_price_value
        ? parseFloat(gameInfo.discounted_price_value)
        : parseFloat(gameInfo.raw_price_value)

    const regularPrice = parseFloat(gameInfo.raw_price_value)

    return (
      <PriceLayout
        onSale={gameInfo.onSale}
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
        htmlFor="nintendo-url"
      >
        <Image
          src="/logos/nintendo-switch.svg"
          alt="Nintendo Switch Logo"
          width={18}
          height={18}
        />
        Nintendo
      </label>

      {gameInfo ? (
        <div className="mt-2 flex min-h-[40px] items-center justify-between gap-2 rounded-lg border border-input pl-3 pr-2">
          <div className="flex items-center gap-3">
            <CircleCheck size={19} className="rounded-full text-green-600" />
            <Price />
          </div>
          <X className="p-[3px]" onClick={clearGameInfo} />
        </div>
      ) : (
        <div className="mt-2 flex gap-2">
          <Input
            id="nintendo-url"
            type="url"
            placeholder="www.nintendo.com/en-ca/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
          <Button
            type="button"
            onClick={handleFetchGameInfo}
            disabled={isLoading || !url.trim()}
            className="w-fit bg-destructive"
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
