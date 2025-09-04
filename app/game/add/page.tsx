"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GameCategory } from "@prisma/client"
import {
  ArrowLeftIcon,
  CircleCheck,
  Gamepad2,
  ListCheck,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

export default function NewGame() {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImageUrl: "",
    length: "",
    category: "WISHLIST" as GameCategory,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error("Game name is required")
      return
    }

    setIsLoading(true)

    // setIsLoading(false)
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Link href="/wishlist">
          <Button variant="ghost" size="icon">
            <ArrowLeftIcon />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Add Game</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-sm font-semibold" htmlFor="name">
            Game Name <span className="text-xs">*</span>
          </label>
          <Input
            id="name"
            type="text"
            className="mt-2"
            placeholder="e.g. The Last Faith"
            value={formData.name}
            onChange={e =>
              setFormData(prev => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-semibold" htmlFor="coverImageUrl">
            Cover Image URL
          </label>
          <Input
            id="coverImageUrl"
            type="url"
            className="mt-2"
            placeholder="https://example.com/image.jpg"
            value={formData.coverImageUrl}
            onChange={e =>
              setFormData(prev => ({ ...prev, coverImageUrl: e.target.value }))
            }
          />
        </div>

        <div className="mb-4">
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
            onChange={e =>
              setFormData(prev => ({ ...prev, length: e.target.value }))
            }
          />
        </div>

        <div>
          <label className="text-sm font-semibold" htmlFor="category">
            Category
          </label>
          <Select
            value={formData.category}
            onValueChange={(value: GameCategory) =>
              setFormData(prev => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger className="mt-2 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="wishlist" value="WISHLIST">
                <div className="flex items-center gap-2">
                  <ListCheck />
                  Wishlist
                </div>
              </SelectItem>
              <SelectItem key="owned" value="OWNED">
                <div className="flex items-center gap-2">
                  <Gamepad2 />
                  Owned
                </div>
              </SelectItem>
              <SelectItem key="completed" value="COMPLETED">
                <div className="flex items-center gap-2">
                  <CircleCheck />
                  Completed
                </div>
              </SelectItem>
              <SelectItem key="graveyard" value="GRAVEYARD">
                <div className="flex items-center gap-2">
                  <Trash2 />
                  Graveyard
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col items-stretch mt-8">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Link href="/wishlist">
            <Button
              type="button"
              className="mt-2 w-full"
              variant="ghost"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
