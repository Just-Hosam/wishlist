"use client"

import NintendoLinkInput from "@/components/layout/NintendoLinkInput"
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
import { GameCategory } from "@prisma/client"
import {
  CircleCheckBig,
  FolderCheck,
  Save,
  ScrollText,
  Skull
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface Game {
  id?: string
  name: string
  length?: number | null
  category: GameCategory
}

interface GameFormProps {
  game?: Game
  isEdit?: boolean
}

export default function GameForm({ game, isEdit = false }: GameFormProps) {
  const router = useRouter()
  const { activeTab } = useTabContext()
  const [isLoading, setIsLoading] = useState(false)
  const [nintendoInfo, setNintendoInfo] = useState<NintendoGameInfo | null>(
    null
  )
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

    setIsLoading(true)

    try {
      const url = isEdit ? `/api/game/${game?.id}` : "/api/game"
      const method = isEdit ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          length: formData.length ? parseInt(formData.length) : null,
          category: formData.category,
          nintendo: nintendoInfo
            ? {
                nsuid: nintendoInfo.nsuid,
                countryCode: nintendoInfo.country,
                currencyCode: nintendoInfo.currency,
                regularPrice: nintendoInfo.raw_price_value
                  ? parseFloat(nintendoInfo.raw_price_value)
                  : null,
                currentPrice: nintendoInfo.discounted_price_value
                  ? parseFloat(nintendoInfo.discounted_price_value)
                  : nintendoInfo.raw_price_value
                    ? parseFloat(nintendoInfo.raw_price_value)
                    : null
              }
            : null
        })
      })

      if (!response.ok) {
        try {
          const errorData = await response.json()
          throw new Error(
            errorData.error ||
              errorData.message ||
              `Failed to ${isEdit ? "update" : "create"} game`
          )
        } catch (parseError) {
          throw new Error(`Failed to ${isEdit ? "update" : "create"} game`)
        }
      }

      toast.success(`Game ${isEdit ? "updated" : "added"} successfully!`)

      router.push("/" + activeTab.toLowerCase())
      router.refresh()
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "creating"} game:`, error)
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${isEdit ? "update" : "create"} game`
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="sticky top-[88px] flex justify-end bg-white pb-2">
        <Button type="submit" disabled={isLoading}>
          <Save />
          {isLoading ? "Saving..." : "Save"}
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

      <div className="mb-5">
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
            <SelectItem key="wishlist" value="WISHLIST">
              <div className="flex items-center gap-2">
                <ScrollText />
                Wishlist
              </div>
            </SelectItem>
            <SelectItem key="owned" value="OWNED">
              <div className="flex items-center gap-2">
                <FolderCheck />
                Owned
              </div>
            </SelectItem>
            <SelectItem key="completed" value="COMPLETED">
              <div className="flex items-center gap-2">
                <CircleCheckBig />
                Completed
              </div>
            </SelectItem>
            <SelectItem key="graveyard" value="GRAVEYARD">
              <div className="flex items-center gap-2">
                <Skull />
                Graveyard
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <NintendoLinkInput
        onGameInfoFound={(gameInfo) => setNintendoInfo(gameInfo)}
        onGameInfoCleared={() => setNintendoInfo(null)}
      />
    </form>
  )
}
