"use client"

import { useRouter } from "@/components/navigation"
import { ChoiceButton } from "@/components/ui/choice-button"
import {
  buildNintendoStoreUrl,
  buildPlayStationStoreUrl,
  buildSteamStoreUrl
} from "@/lib/igdb-store-links"
import { saveGame } from "@/server/actions/game"
import { unlinkPriceFromGame } from "@/server/actions/price"
import { GameCategory, GameInput, GameOutput, Platform } from "@/types"
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
  game: GameOutput
  children: React.ReactNode
}

export default function MoveToLibrary({ game, children }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [nowPlaying, setNowPlaying] = useState(false)
  const [playstationSelected, setPlaystationSelected] = useState(false)
  const [nintendoSelected, setNintendoSelected] = useState(false)
  const [steamSelected, setSteamSelected] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const oldCategory = game.category
      const newCategory = GameCategory.LIBRARY
      const platforms: Platform[] = []
      if (playstationSelected) platforms.push(Platform.PLAYSTATION)
      if (nintendoSelected) platforms.push(Platform.NINTENDO)
      if (steamSelected) platforms.push(Platform.PC)

      const gameInput: GameInput = {
        ...game,
        category: newCategory,
        platforms,
        nowPlaying
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

      await Promise.allSettled(pricePromises)

      toast.success("Game moved to library!")
      setOpen(false)
      router.push("/library")
    } catch (error) {
      console.error("Error moving game to library:", error)
      toast.error("Failed to move game to library.")
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
          <DrawerTitle>Move to Library</DrawerTitle>
        </DrawerHeader>
        <form className="space-y-5">
          <div>
            <header className="mb-2 pl-1">
              <label className="text-sm font-medium" htmlFor="now-playing">
                Currently playing
              </label>
              <p className="text-xs text-muted-foreground">
                Keep this game marked as in progress.
              </p>
            </header>
            <div className="flex gap-2">
              <ChoiceButton
                id="now-playing"
                selected={nowPlaying}
                onClick={() => setNowPlaying(true)}
              >
                Yes
              </ChoiceButton>
              <ChoiceButton
                selected={!nowPlaying}
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
            <div className="flex gap-2">
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
            {isSaving ? "Moving..." : "Move to Library"}
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
