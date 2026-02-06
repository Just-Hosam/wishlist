"use client"

import { useRouter } from "@/components/navigation"
import { ButtonGroup } from "@/components/ui/button-group"
import Counter from "@/components/ui/counter"
import { Switch } from "@/components/ui/switch"
import { saveGame } from "@/server/actions/game"
import { GameInput, GameOutput, Platform } from "@/types"
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

export default function EditFromLibrary({ game, children }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form
  const [timeToBeat, setTimeToBeat] = useState<number | null>(game.length)
  const [nowPlaying, setNowPlaying] = useState(game.nowPlaying)
  const [playstationSelected, setPlaystationSelected] = useState(
    game.platforms.includes(Platform.PLAYSTATION)
  )
  const [nintendoSelected, setNintendoSelected] = useState(
    game.platforms.includes(Platform.NINTENDO)
  )
  const [steamSelected, setSteamSelected] = useState(
    game.platforms.includes(Platform.PC)
  )

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const platforms: Platform[] = []
      if (playstationSelected) platforms.push(Platform.PLAYSTATION)
      if (nintendoSelected) platforms.push(Platform.NINTENDO)
      if (steamSelected) platforms.push(Platform.PC)

      const gameInput: GameInput = {
        ...game,
        length: timeToBeat,
        platforms,
        nowPlaying
      }

      await saveGame(gameInput, game.id)

      toast.success("Game saved!")
      setOpen(false)
      router.push("/library")
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
        <div className="px-2">
          <DrawerHeader>
            <DrawerTitle>Edit Game</DrawerTitle>
          </DrawerHeader>
          <form className="space-y-6 px-4 pb-5 pt-3">
            <div>
              <label className="text-sm font-medium">Time to Beat</label>
              <p className="mb-3 text-xs text-muted-foreground">
                Enter the length in hours.
              </p>
              <Counter
                value={timeToBeat}
                onChange={(value) => setTimeToBeat(value)}
              />
            </div>
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
                  variant={steamSelected ? "accent" : "outline"}
                  onClick={() => setSteamSelected(!steamSelected)}
                >
                  <Image
                    src="/logos/steam.svg"
                    alt="Steam Logo"
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
                  variant={playstationSelected ? "accent" : "outline"}
                  onClick={() => setPlaystationSelected(!playstationSelected)}
                >
                  <Image
                    src="/logos/playstation.svg"
                    alt="PlayStation Logo"
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
                  variant={nintendoSelected ? "accent" : "outline"}
                  onClick={() => setNintendoSelected(!nintendoSelected)}
                >
                  <Image
                    src="/logos/nintendo-switch.svg"
                    alt="Nintendo Logo"
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
            <Button
              size="lg"
              disabled={isSaving}
              variant="accent"
              onClick={handleSave}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <DrawerClose asChild>
              <Button size="lg" variant="ghost">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
