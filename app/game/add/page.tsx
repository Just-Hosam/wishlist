"use client"

import { BackButton } from "@/components/layout/BackButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTabContext } from "@/contexts/TabContext"
import { GameCategory } from "@prisma/client"
import { CircleCheckBig, FolderCheck, ScrollText, Skull } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export default function NewGame() {
  const router = useRouter()
  const { activeTab } = useTabContext()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coverImageUrl: "",
    length: "",
    category: activeTab,
  })

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
      const response = await fetch("/api/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          length: formData.length ? parseInt(formData.length) : null,
          category: formData.category,
        }),
      })

      if (!response.ok) {
        const responseText = await response.text()
        console.error("Response not ok:", response.status, responseText)

        let error
        try {
          error = JSON.parse(responseText)
        } catch (e) {
          throw new Error(`Server error (${response.status}): ${responseText}`)
        }

        throw new Error(error.error || "Failed to create game")
      }

      toast.success("Game added successfully!")
      router.back()
      router.refresh()
    } catch (error) {
      console.error("Error creating game:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to create game"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <BackButton className="mb-4" />

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
            Category <span className="text-xs">*</span>
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

        <div className="flex flex-col items-stretch mt-8">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button
            type="button"
            className="mt-2 w-full"
            variant="ghost"
            disabled={isLoading}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
