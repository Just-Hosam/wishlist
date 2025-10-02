"use client"

import NintendoLinkInput from "@/components/layout/NintendoLinkInput"
import PlayStationLinkInput from "@/components/layout/PlayStationLinkInput"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { useTabContext } from "@/contexts/TabContext"
import { type NintendoGameInfo } from "@/lib/nintendo-price"
import { type GamePrice } from "@/lib/playstation-price"
import { createGame, updateGame } from "@/server/actions/game"
import { GameCategory, Platform } from "@prisma/client"
import { Archive, CheckCircle2, FolderCheck, Heart, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import { BackButton } from "./BackButton"

interface Game {
  id?: string
  name: string
  length?: number | null
  category: GameCategory
  prices?: {
    platform: Platform
    externalId: string
    storeUrl: string | null
    countryCode: string | null
    currencyCode: string | null
    regularPrice: number | null
    currentPrice: number | null
  }[]
}

interface GameFormProps {
  game?: Game
  isEdit?: boolean
}

export default function GameForm({ game, isEdit = false }: GameFormProps) {
  const router = useRouter()
  const { activeTab } = useTabContext()
  const [isPending, startTransition] = useTransition()
  const [nintendoInfo, setNintendoInfo] = useState<NintendoGameInfo | null>(
    null
  )
  const [playstationInfo, setPlaystationInfo] = useState<GamePrice | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    length: "",
    category: activeTab
  })

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.name,
        length: game.length?.toString() || "",
        category: game.category
      })

      // Set existing platform data if available
      if (game.prices) {
        const nintendoPrice = game.prices.find(
          (p) => p.platform === Platform.NINTENDO
        )
        const playstationPrice = game.prices.find(
          (p) => p.platform === Platform.PLAYSTATION
        )

        if (nintendoPrice) {
          // Create Nintendo game info from existing price data
          const regularPrice = nintendoPrice.regularPrice || 0
          const currentPrice = nintendoPrice.currentPrice || 0

          const nintendoInfo: NintendoGameInfo = {
            nsuid: nintendoPrice.externalId,
            storeUrl: nintendoPrice.storeUrl || "",
            country: nintendoPrice.countryCode || "",
            currency: nintendoPrice.currencyCode || "",
            raw_price_value: regularPrice.toString(),
            discounted_price_value:
              currentPrice !== regularPrice
                ? currentPrice.toString()
                : undefined,
            raw_price: `$${regularPrice}`,
            discounted_price:
              currentPrice !== regularPrice ? `$${currentPrice}` : undefined,
            onSale: currentPrice !== regularPrice
          }
          setNintendoInfo(nintendoInfo)
        }

        if (playstationPrice) {
          // Create PlayStation game info from existing price data
          const regularPrice = playstationPrice.regularPrice || 0
          const currentPrice = playstationPrice.currentPrice || 0

          const playstationInfo: GamePrice = {
            name: game.name,
            storeUrl: playstationPrice.storeUrl || "",
            currency: playstationPrice.currencyCode || "",
            basePrice: `$${regularPrice}`,
            currentPrice: `$${currentPrice}`,
            savings: regularPrice - currentPrice
          }
          setPlaystationInfo(playstationInfo)
        }
      }
    }
  }, [game])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error("Game name is required")
      return
    }

    if (!(formData.category in GameCategory)) {
      toast.error("Invalid category selected")
      return
    }

    if (!formData.category) {
      toast.error("Category is required")
      return
    }

    startTransition(async () => {
      try {
        const gameData = {
          name: formData.name.trim(),
          length: formData.length,
          category: formData.category,
          nintendo: nintendoInfo
            ? {
                nsuid: nintendoInfo.nsuid,
                storeUrl: nintendoInfo.storeUrl,
                countryCode: nintendoInfo.country,
                currencyCode: nintendoInfo.currency,
                regularPrice: nintendoInfo.raw_price_value
                  ? parseFloat(nintendoInfo.raw_price_value)
                  : undefined,
                currentPrice: nintendoInfo.discounted_price_value
                  ? parseFloat(nintendoInfo.discounted_price_value)
                  : nintendoInfo.raw_price_value
                    ? parseFloat(nintendoInfo.raw_price_value)
                    : undefined
              }
            : undefined,
          playstation: playstationInfo
            ? {
                storeUrl: playstationInfo.storeUrl,
                countryCode: undefined, // PlayStation API doesn't provide country code
                currencyCode: playstationInfo.currency,
                regularPrice: (() => {
                  const cleaned = playstationInfo.basePrice.replace(
                    /[^0-9.]/g,
                    ""
                  )
                  return cleaned ? parseFloat(cleaned) : undefined
                })(),
                currentPrice: (() => {
                  const cleaned = playstationInfo.currentPrice.replace(
                    /[^0-9.]/g,
                    ""
                  )
                  return cleaned ? parseFloat(cleaned) : undefined
                })()
              }
            : undefined
        }

        if (isEdit && game?.id) {
          await updateGame(game.id, gameData)
        } else {
          await createGame(gameData)
        }

        toast.success(`Game ${isEdit ? "updated" : "added"} successfully!`)
        router.push("/" + activeTab.toLowerCase())
      } catch (error) {
        console.error(`Error ${isEdit ? "updating" : "creating"} game:`, error)
        toast.error(
          error instanceof Error
            ? error.message
            : `Failed to ${isEdit ? "update" : "create"} game`
        )
      }
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="sticky top-[72px] flex min-h-[64px] items-center justify-between gap-2 bg-white pb-5">
        <BackButton />
        <Button type="submit" disabled={isPending}>
          <Save />
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>

      <div className="mb-5">
        <label className="text-sm font-semibold" htmlFor="name">
          Game Name <span className="text-xs">*</span>
        </label>
        <Input
          id="name"
          type="text"
          className="mt-2"
          placeholder="e.g. The Last Faith"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>

      <div className="mb-5">
        <label className="text-sm font-semibold" htmlFor="length">
          Game Length (hours)
        </label>
        <Input
          id="length"
          type="number"
          className="mt-2"
          placeholder="e.g. 20"
          min="0"
          value={formData.length}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, length: e.target.value }))
          }
        />
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold" htmlFor="category">
          Category <span className="text-xs">*</span>
        </label>
        <Select
          value={formData.category}
          onValueChange={(value: GameCategory) =>
            setFormData((prev) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger className="mt-2 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="wishlist" value={GameCategory.WISHLIST}>
              <div className="flex items-center gap-2">
                <Heart />
                Wishlist
              </div>
            </SelectItem>
            <SelectItem key="library" value={GameCategory.LIBRARY}>
              <div className="flex items-center gap-2">
                <FolderCheck />
                Library
              </div>
            </SelectItem>
            <SelectItem key="completed" value={GameCategory.COMPLETED}>
              <div className="flex items-center gap-2">
                <CheckCircle2 />
                Completed
              </div>
            </SelectItem>
            <SelectItem key="archived" value={GameCategory.ARCHIVED}>
              <div className="flex items-center gap-2">
                <Archive />
                Archived
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <PlayStationLinkInput
        className="mb-6"
        onGameInfoFound={(gameInfo) => setPlaystationInfo(gameInfo)}
        onGameInfoCleared={() => setPlaystationInfo(null)}
        existingGameInfo={playstationInfo}
      />
      <NintendoLinkInput
        onGameInfoFound={(gameInfo) => setNintendoInfo(gameInfo)}
        onGameInfoCleared={() => setNintendoInfo(null)}
        existingGameInfo={nintendoInfo}
      />
    </form>
  )
}
