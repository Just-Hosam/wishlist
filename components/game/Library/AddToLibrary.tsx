"use client"

import useAutoPopulateHLTBTimeToBeat from "@/components/game/useAutoPopulateHLTBTimeToBeat"
import { useRouter } from "@/components/navigation"
import { ChoiceButton } from "@/components/ui/choice-button"
import Counter from "@/components/ui/counter"
import { saveGame } from "@/server/actions/game"
import { GameCategory, GameInput, IGDBGame, Platform } from "@/types"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../../ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "../../ui/drawer"

interface Props {
  igdbGame: IGDBGame
  redirectTo?: string

  children: React.ReactNode
}

export default function AddToLibrary({
  igdbGame,
  redirectTo,
  children
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [timeToBeat, setTimeToBeat] = useState<number | null>(null)
  const [nowPlaying, setNowPlaying] = useState<boolean | null>(null)
  const [playstationSelected, setPlaystationSelected] = useState(false)
  const [nintendoSelected, setNintendoSelected] = useState(false)
  const [steamSelected, setSteamSelected] = useState(false)
  const { isLoading: isLoadingTimeToBeat } = useAutoPopulateHLTBTimeToBeat({
    isOpen: open,
    name: igdbGame.name,
    setValue: setTimeToBeat
  })

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const platforms: Platform[] = []
      if (playstationSelected) platforms.push(Platform.PLAYSTATION)
      if (nintendoSelected) platforms.push(Platform.NINTENDO)
      if (steamSelected) platforms.push(Platform.PC)

      const game: GameInput = {
        igdbId: igdbGame.igdbId,
        igdbName: igdbGame.name,
        igdbSlug: igdbGame.slug,
        igdbSummary: igdbGame.summary,
        igdbCoverImageId: igdbGame.coverImageId,
        igdbScreenshotIds: igdbGame.screenshotImageIds,
        igdbVideoId: igdbGame.videoId,
        igdbVideoIds: igdbGame.videoIds,
        igdbPlatformIds: [],
        igdbFirstReleaseDate: igdbGame.firstReleaseDate,
        igdbNintendoUrlSegment: igdbGame.nintendoUrlSegment || null,
        igdbPlaystationUrlSegment: igdbGame.playstationUrlSegment || null,
        igdbSteamUrlSegment: igdbGame.steamUrlSegment || null,
        category: GameCategory.LIBRARY,
        platforms: platforms,
        length: timeToBeat || null,
        nowPlaying: nowPlaying ?? false
      }

      await saveGame(game)

      toast.success("Game added to library!")
      setOpen(false)
      if (redirectTo) router.push(redirectTo)
    } catch (error) {
      console.error("Error saving game to library:", error)
      toast.error("Failed to add game to library.")
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
        <DrawerHeader>
          <DrawerTitle>Add to Library</DrawerTitle>
        </DrawerHeader>
        <form className="space-y-5">
          <div>
            <header className="mb-2 pl-1">
              <label className="text-sm font-medium">Time to Beat</label>
              <p className="text-xs text-muted-foreground">
                Enter the length in hours.
              </p>
            </header>
            <Counter
              value={timeToBeat}
              onChange={(value) => setTimeToBeat(value)}
              disabled={isLoadingTimeToBeat}
            />
          </div>
          <div>
            <header className="mb-2 pl-1">
              <label className="text-sm font-medium" htmlFor="now-playing">
                Currently playing
              </label>
              <p className="text-xs text-muted-foreground">
                Keep this game marked as in progress.
              </p>
            </header>
            <div className="flex gap-[6px]">
              <ChoiceButton
                id="now-playing"
                selected={nowPlaying === true}
                onClick={() => setNowPlaying(true)}
              >
                Yes
              </ChoiceButton>
              <ChoiceButton
                selected={nowPlaying === false}
                onClick={() => setNowPlaying(false)}
              >
                No
              </ChoiceButton>
            </div>
          </div>
          <div>
            <header className="mb-2 pl-1">
              <label className="text-sm font-medium" htmlFor="category">
                Owned on
              </label>
              <p className="text-xs text-muted-foreground">
                Select every platform you own this title on.
              </p>
            </header>
            <div className="flex gap-[6px]">
              <ChoiceButton
                selected={steamSelected}
                onClick={() => setSteamSelected(!steamSelected)}
              >
                <Image
                  src="/logos/steam.svg"
                  alt="Steam Logo"
                  width={18}
                  height={18}
                  unoptimized
                />
              </ChoiceButton>
              <ChoiceButton
                selected={playstationSelected}
                onClick={() => setPlaystationSelected(!playstationSelected)}
              >
                <Image
                  src="/logos/playstation.svg"
                  alt="PlayStation Logo"
                  width={18}
                  height={18}
                  unoptimized
                />
              </ChoiceButton>
              <ChoiceButton
                selected={nintendoSelected}
                onClick={() => setNintendoSelected(!nintendoSelected)}
              >
                <Image
                  src="/logos/nintendo-switch.svg"
                  alt="Nintendo Logo"
                  width={18}
                  height={18}
                  unoptimized
                />
              </ChoiceButton>
            </div>
          </div>
        </form>

        <DrawerFooter>
          <Button
            size="lg"
            disabled={isSaving}
            variant="accent"
            onClick={handleSave}
          >
            {isSaving ? "Adding..." : "Add to Library"}
          </Button>
          <DrawerClose asChild>
            <Button size="lg" variant="ghost">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
