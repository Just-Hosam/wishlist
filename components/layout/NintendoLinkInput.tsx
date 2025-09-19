"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type NintendoGameInfo } from "@/lib/nintendo-price"
import { Loader2, Link, ExternalLink } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface NintendoLinkInputProps {
  onGameInfoFound?: (gameInfo: NintendoGameInfo) => void
  className?: string
}

export default function NintendoLinkInput({
  onGameInfoFound,
  className
}: NintendoLinkInputProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [gameInfo, setGameInfo] = useState<NintendoGameInfo | null>(null)

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
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold" htmlFor="nintendo-url">
            Nintendo Store URL
          </label>
          <p className="text-xs text-muted-foreground">
            Enter a Nintendo store URL and connect to fetch game information
            before submitting the form.
          </p>
          <div className="mt-3 flex flex-col gap-2">
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
              className="w-full flex-shrink-0 bg-red-600"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Link className="h-4 w-4" /> Connect Nintendo
                </>
              )}
            </Button>
          </div>
        </div>

        {gameInfo && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Game Information</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Price:</span>
                    <span
                      className={
                        gameInfo.onSale
                          ? "text-muted-foreground line-through"
                          : ""
                      }
                    >
                      {gameInfo.raw_price}
                    </span>
                    {gameInfo.onSale && gameInfo.discounted_price && (
                      <span className="font-medium text-green-600">
                        {gameInfo.discounted_price}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Currency:</span>
                    <span>{gameInfo.currency}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Region:</span>
                    <span>{gameInfo.country}</span>
                  </div>
                  {gameInfo.onSale && (
                    <div className="text-xs font-medium text-green-600">
                      🎉 On Sale!
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(url, "_blank")}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={clearGameInfo}
                >
                  ✕
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
