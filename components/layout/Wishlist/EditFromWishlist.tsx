"use client"

import { saveGame } from "@/server/actions/game"
import { GameInput, GameOutput, GameOutputWithPrices, Platform } from "@/types"
import { useRouter } from "@/components/navigation"
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
import Counter from "@/components/ui/counter"
import Image from "next/image"
import { Switch } from "@/components/ui/switch"
import NintendoPriceClient from "../NintendoPriceClient"
import PlaystationPriceClient from "../PlaystationPriceClient"
import SteamPriceClient from "../SteamPriceClient"
import {
  buildNintendoStoreUrl,
  buildPlayStationStoreUrl,
  buildSteamStoreUrl
} from "@/lib/igdb-store-links"
import { linkPriceToGame, unlinkPriceFromGame } from "@/server/actions/price"

interface Props {
  game: GameOutputWithPrices
  children: React.ReactNode
}

const isPriceLinked = (
  game: GameOutputWithPrices,
  platform: Platform
): boolean => {
  return !!game.trackedPrices.find((price) => price.platform === platform)
}

export default function EditFromWishlist({ game, children }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [timeToBeat, setTimeToBeat] = useState<number | null>(game.length)

  const [playstationOriginallyLinked] = useState<boolean>(
    isPriceLinked(game, Platform.PLAYSTATION)
  )
  const [playStationLinked, setPlayStationLinked] = useState(
    playstationOriginallyLinked
  )
  const [psSwitchDisabled, setPsSwitchDisabled] = useState(true)

  const [nintendoOriginallyLinked] = useState<boolean>(
    isPriceLinked(game, Platform.NINTENDO)
  )
  const [nintendoLinked, setNintendoLinked] = useState(nintendoOriginallyLinked)
  const [ntSwitchDisabled, setNtSwitchDisabled] = useState(true)
  const [steamOriginallyLinked] = useState<boolean>(
    isPriceLinked(game, Platform.PC)
  )
  const [steamLinked, setSteamLinked] = useState(steamOriginallyLinked)
  const [steamSwitchDisabled, setSteamSwitchDisabled] = useState(true)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const gameInput: GameInput = {
        ...game,
        length: timeToBeat
      }

      await saveGame(gameInput, game.id)

      let playstationPromise
      let nintendoPromise
      let steamPromise

      if (game.igdbNintendoUrlSegment) {
        const nintendoStoreUrl = buildNintendoStoreUrl(
          game.igdbNintendoUrlSegment
        )
        if (nintendoStoreUrl) {
          if (nintendoLinked && !nintendoOriginallyLinked) {
            nintendoPromise = linkPriceToGame(game.id, nintendoStoreUrl)
          } else if (!nintendoLinked && nintendoOriginallyLinked) {
            nintendoPromise = unlinkPriceFromGame(game.id, nintendoStoreUrl)
          }
        }
      }

      if (game.igdbPlaystationUrlSegment) {
        const playstationStoreUrl = buildPlayStationStoreUrl(
          game.igdbPlaystationUrlSegment
        )
        if (playstationStoreUrl) {
          if (playStationLinked && !playstationOriginallyLinked) {
            playstationPromise = linkPriceToGame(game.id, playstationStoreUrl)
          } else if (!playStationLinked && playstationOriginallyLinked) {
            playstationPromise = unlinkPriceFromGame(
              game.id,
              playstationStoreUrl
            )
          }
        }
      }

      if (game.igdbSteamUrlSegment) {
        const steamStoreUrl = buildSteamStoreUrl(game.igdbSteamUrlSegment)
        if (steamStoreUrl) {
          if (steamLinked && !steamOriginallyLinked) {
            steamPromise = linkPriceToGame(game.id, steamStoreUrl)
          } else if (!steamLinked && steamOriginallyLinked) {
            steamPromise = unlinkPriceFromGame(game.id, steamStoreUrl)
          }
        }
      }

      await Promise.all([playstationPromise, nintendoPromise, steamPromise])

      toast.success("Game saved!")
      setOpen(false)
      router.push("/wishlist")
    } catch (error) {
      console.error("Error saving game to wishlist:", error)
      toast.error("Failed to add game to wishlist.")
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
            <DrawerDescription>Configure your settings.</DrawerDescription>
          </DrawerHeader>
          <form className="space-y-6 px-4 pb-5 pt-3">
            <div>
              <label className="text-sm font-medium">Time to Beat</label>
              <p className="mb-2 text-xs text-muted-foreground">
                Enter the length in hours.
              </p>
              <Counter
                value={timeToBeat}
                onChange={(value) => setTimeToBeat(value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Prices</label>
              <p className="text-xs text-muted-foreground">
                Track prices for these stores.
              </p>
              <div className="mt-3 space-y-3">
                <div className="flex items-center">
                  <Image
                    src="/logos/steam.svg"
                    alt="Steam Logo"
                    width={20}
                    height={20}
                    className="mr-3"
                  />

                  <SteamPriceClient
                    igdbSteamUrlSegment={game.igdbSteamUrlSegment}
                    onFetchSuccess={() => setSteamSwitchDisabled(false)}
                  />

                  <Switch
                    checked={steamLinked}
                    onCheckedChange={setSteamLinked}
                    disabled={steamSwitchDisabled}
                    className="ml-auto data-[state=checked]:bg-slate-600"
                  />
                </div>
                <div className="flex items-center">
                  <Image
                    src="/logos/playstation.svg"
                    alt="PlayStation Logo"
                    width={20}
                    height={20}
                    className="mr-3"
                  />
                  <PlaystationPriceClient
                    igdbPlaystationUrlSegment={game.igdbPlaystationUrlSegment}
                    onFetchSuccess={() => setPsSwitchDisabled(false)}
                  />

                  <Switch
                    checked={playStationLinked}
                    onCheckedChange={setPlayStationLinked}
                    disabled={psSwitchDisabled}
                    className="ml-auto data-[state=checked]:bg-blue-600"
                  />
                </div>
                <div className="flex items-center">
                  <Image
                    src="/logos/nintendo-switch.svg"
                    alt="Nintendo Switch Logo"
                    width={20}
                    height={20}
                    className="mr-3"
                  />

                  <NintendoPriceClient
                    igdbNintendoUrlSegment={game.igdbNintendoUrlSegment}
                    onFetchSuccess={() => setNtSwitchDisabled(false)}
                  />

                  <Switch
                    checked={nintendoLinked}
                    onCheckedChange={setNintendoLinked}
                    disabled={ntSwitchDisabled}
                    className="ml-auto data-[state=checked]:bg-red-600"
                  />
                </div>
              </div>
            </div>
          </form>

          <DrawerFooter>
            <Button disabled={isSaving} onClick={handleSave}>
              {isSaving ? "Saving..." : "Save"}
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
