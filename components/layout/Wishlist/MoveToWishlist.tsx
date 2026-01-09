"use client"

import {
  buildNintendoStoreUrl,
  buildPlayStationStoreUrl,
  buildSteamStoreUrl
} from "@/lib/igdb-store-links"
import { saveGame } from "@/server/actions/game"
import { linkPriceToGame } from "@/server/actions/price"
import { GameCategory, GameInput, GameOutput } from "@/types"
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
import { Switch } from "../../ui/switch"
import NintendoPriceClient from "../NintendoPriceClient"
import PlaystationPriceClient from "../PlaystationPriceClient"
import SteamPriceClient from "../SteamPriceClient"

interface Props {
  igdbPlaystationUrlSegment: string | null
  igdbNintendoUrlSegment: string | null
  igdbSteamUrlSegment: string | null
  game: GameOutput
  children: React.ReactNode
}

export default function MoveToWishlist({
  igdbPlaystationUrlSegment,
  igdbNintendoUrlSegment,
  igdbSteamUrlSegment,
  game,
  children
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [playStationLinked, setPlayStationLinked] = useState(false)
  const [psSwitchDisabled, setPsSwitchDisabled] = useState(true)
  const [nintendoLinked, setNintendoLinked] = useState(false)
  const [ntSwitchDisabled, setNtSwitchDisabled] = useState(true)
  const [steamLinked, setSteamLinked] = useState(false)
  const [steamSwitchDisabled, setSteamSwitchDisabled] = useState(true)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const oldCategory = game.category
      const newCategory = GameCategory.WISHLIST

      const gameInput: GameInput = {
        ...game,
        category: newCategory,
        platforms: [],
        nowPlaying: false
      }

      await saveGame(gameInput, game.id, [oldCategory, newCategory])

      let playstationPromise
      let nintendoPromise
      let steamPromise

      if (playStationLinked && igdbPlaystationUrlSegment) {
        const playstationStoreUrl = buildPlayStationStoreUrl(
          igdbPlaystationUrlSegment
        )
        if (playstationStoreUrl) {
          playstationPromise = linkPriceToGame(game.id, playstationStoreUrl)
        }
      }

      if (nintendoLinked && igdbNintendoUrlSegment) {
        const nintendoStoreUrl = buildNintendoStoreUrl(igdbNintendoUrlSegment)
        if (nintendoStoreUrl) {
          nintendoPromise = linkPriceToGame(game.id, nintendoStoreUrl)
        }
      }

      if (steamLinked && igdbSteamUrlSegment) {
        const steamStoreUrl = buildSteamStoreUrl(igdbSteamUrlSegment)
        if (steamStoreUrl) {
          steamPromise = linkPriceToGame(game.id, steamStoreUrl)
        }
      }

      await Promise.all([playstationPromise, nintendoPromise, steamPromise])

      toast.success("Game added to wishlist!")
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
            <DrawerTitle>Move to Wishlist</DrawerTitle>
            <DrawerDescription>Configure your settings.</DrawerDescription>
          </DrawerHeader>
          <form className="px-4 pb-5 pt-3">
            <label className="text-sm font-medium">Prices</label>
            <p className="text-xs text-muted-foreground">
              Track prices for these stores.
            </p>
            <div className="mt-3 space-y-3">
              <div className="flex items-center">
                <Image
                  src="/logos/playstation.svg"
                  alt="PlayStation Logo"
                  width={20}
                  height={20}
                  className="mr-3"
                />
                <PlaystationPriceClient
                  igdbPlaystationUrlSegment={igdbPlaystationUrlSegment}
                  onFetchDone={(status) => {
                    if (status === "success") {
                      setPsSwitchDisabled(false)
                    }
                  }}
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
                  igdbNintendoUrlSegment={igdbNintendoUrlSegment}
                  onFetchDone={(status) => {
                    if (status === "success") {
                      setNtSwitchDisabled(false)
                    }
                  }}
                />

                <Switch
                  checked={nintendoLinked}
                  onCheckedChange={setNintendoLinked}
                  disabled={ntSwitchDisabled}
                  className="ml-auto data-[state=checked]:bg-red-600"
                />
              </div>
              <div className="flex items-center">
                <Image
                  src="/logos/steam.svg"
                  alt="Steam Logo"
                  width={20}
                  height={20}
                  className="mr-3"
                />

                <SteamPriceClient
                  igdbSteamUrlSegment={igdbSteamUrlSegment}
                  onFetchDone={(status) => {
                    if (status === "success") {
                      setSteamSwitchDisabled(false)
                    }
                  }}
                />

                <Switch
                  checked={steamLinked}
                  onCheckedChange={setSteamLinked}
                  disabled={steamSwitchDisabled}
                  className="ml-auto data-[state=checked]:bg-slate-600"
                />
              </div>
            </div>
          </form>

          <DrawerFooter>
            <Button disabled={isSaving} onClick={handleSave}>
              {isSaving ? "Moving..." : "Move to Wishlist"}
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
