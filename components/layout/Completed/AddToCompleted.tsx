"use client"

import { saveGame } from "@/server/actions/game"
import { GameCategory, GameInput, IGDBGame } from "@/types"
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

interface Props {
  igdbGame: IGDBGame
  timeToBeat: number | null
  children: React.ReactNode
}

export default function AddToLibrary({
  igdbGame,
  timeToBeat,
  children
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const game: GameInput = {
        igdbId: igdbGame.igdbId,
        igdbName: igdbGame.name,
        igdbSlug: igdbGame.slug,
        igdbSummary: igdbGame.summary,
        igdbCoverImageId: igdbGame.coverImageId,
        igdbScreenshotIds: igdbGame.screenshotImageIds,
        igdbVideoId: igdbGame.videoId,
        igdbPlatformIds: [],
        igdbFirstReleaseDate: igdbGame.firstReleaseDate,
        igdbNintendoUrlSegment: igdbGame.nintendoUrlSegment || null,
        igdbPlaystationUrlSegment: igdbGame.playstationUrlSegment || null,
        igdbSteamUrlSegment: igdbGame.steamUrlSegment || null,
        category: GameCategory.COMPLETED,
        platforms: [],
        length: timeToBeat || null,
        nowPlaying: false
      }

      await saveGame(game)

      toast.success("Game added to completed!")
      setOpen(false)
      router.push("/more/completed")
    } catch (error) {
      console.error("Error saving game to completed:", error)
      toast.error("Failed to add game to completed.")
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
            <DrawerTitle>Add to Completed</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>
            <Button disabled={isSaving} onClick={handleSave}>
              {isSaving ? "Adding..." : "Add to Completed"}
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
