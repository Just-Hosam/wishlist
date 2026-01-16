"use client"

import { saveGame } from "@/server/actions/game"
import { GameCategory, GameInput, GameOutput } from "@/types"
import { revalidateTag } from "next/cache"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../../ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "../../ui/drawer"
import {
  buildNintendoStoreUrl,
  buildPlayStationStoreUrl,
  buildSteamStoreUrl
} from "@/lib/igdb-store-links"
import { unlinkPriceFromGame } from "@/server/actions/price"

interface Props {
  game: GameOutput
  children: React.ReactNode
}

export default function MoveToCompleted({ game, children }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const oldCategory = game.category
      const newCategory = GameCategory.COMPLETED

      const gameInput: GameInput = {
        ...game,
        category: newCategory,
        nowPlaying: false
      }

      await saveGame(gameInput, game.id, [oldCategory, newCategory])

      const links = [
        game.igdbPlaystationUrlSegment
          ? buildPlayStationStoreUrl(game.igdbPlaystationUrlSegment)
          : null,
        game.igdbNintendoUrlSegment
          ? buildNintendoStoreUrl(game.igdbNintendoUrlSegment)
          : null,
        game.igdbSteamUrlSegment
          ? buildSteamStoreUrl(game.igdbSteamUrlSegment)
          : null
      ]

      const pricePromises = links
        .filter(Boolean)
        .map((url) => unlinkPriceFromGame(game.id, url!))

      await Promise.all(pricePromises)

      toast.success("Game moved to completed!")
      setOpen(false)
      router.push("/more/completed")
    } catch (error) {
      console.error("Error moving game to completed:", error)
      toast.error("Failed to move game to completed.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={(next) => setOpen(next)}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => setOpen(true)}
        >
          {children}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="px-2">
          <DrawerHeader>
            <DrawerTitle>Move to Completed</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>
            <Button disabled={isSaving} onClick={handleSave}>
              {isSaving ? "Moving..." : "Move to Completed"}
            </Button>
            <DrawerClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
