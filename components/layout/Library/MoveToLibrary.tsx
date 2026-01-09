"use client"

import { ButtonGroup } from "@/components/ui/button-group"
import { Switch } from "@/components/ui/switch"
import { saveGame } from "@/server/actions/game"
import { GameCategory, GameInput, GameOutput, Platform } from "@/types"
import Image from "next/image"
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
        <div className="px-2">
          <DrawerHeader>
            <DrawerTitle>Move to Library</DrawerTitle>
            <DrawerDescription>Configure your settings.</DrawerDescription>
          </DrawerHeader>
          <form className="space-y-6 px-4 pb-5 pt-3">
            <div className="flex items-end justify-between">
              <div>
                <label className="text-sm font-medium" htmlFor="now-playing">
                  Currently playing
                </label>
                <p className="text-xs text-muted-foreground">
                  Keep this game marked as in progress.
                </p>
              </div>
              <Switch
                id="now-playing"
                checked={nowPlaying}
                onCheckedChange={setNowPlaying}
              ></Switch>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="category">
                Owned on
              </label>
              <p className="text-xs text-muted-foreground">
                Select every platform you own this title on.
              </p>
              <ButtonGroup className="mt-3 w-full">
                <Button
                  size="lg"
                  type="button"
                  className="flex-1"
                  variant={playstationSelected ? "default" : "outline"}
                  onClick={() => setPlaystationSelected(!playstationSelected)}
                >
                  <Image
                    src="/logos/playstation.svg"
                    alt="PlayStation"
                    width={18}
                    height={18}
                  />
                  <span className="hidden text-sm font-normal sm:inline-block">
                    Playstation
                  </span>
                </Button>
                <Button
                  size="lg"
                  type="button"
                  className="flex-1"
                  variant={steamSelected ? "default" : "outline"}
                  onClick={() => setSteamSelected(!steamSelected)}
                >
                  <Image
                    src="/logos/steam.svg"
                    alt="Steam"
                    width={18}
                    height={18}
                  />
                  <span className="hidden text-sm font-normal sm:inline-block">
                    Steam
                  </span>
                </Button>
                <Button
                  size="lg"
                  type="button"
                  className="flex-1"
                  variant={nintendoSelected ? "default" : "outline"}
                  onClick={() => setNintendoSelected(!nintendoSelected)}
                >
                  <Image
                    src="/logos/nintendo-switch.svg"
                    alt="Nintendo"
                    width={18}
                    height={18}
                  />
                  <span className="hidden text-sm font-normal sm:inline-block">
                    Nintendo
                  </span>
                </Button>
              </ButtonGroup>
            </div>
          </form>

          <DrawerFooter>
            <Button disabled={isSaving} onClick={handleSave}>
              {isSaving ? "Moving..." : "Move to Library"}
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
