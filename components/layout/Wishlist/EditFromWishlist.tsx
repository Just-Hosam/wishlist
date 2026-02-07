"use client"

import { useRouter } from "@/components/navigation"
import Counter from "@/components/ui/counter"
import { Switch } from "@/components/ui/switch"
import {
  buildNintendoStoreUrl,
  buildPlayStationStoreUrl,
  buildSteamStoreUrl
} from "@/lib/igdb-store-links"
import { saveGame } from "@/server/actions/game"
import {
  getTrackedPlatformsForGame,
  linkPriceToGame,
  unlinkPriceFromGame
} from "@/server/actions/price"
import { GameInput, GameOutput, Platform } from "@/types"
import Image from "next/image"
import { useEffect, useState } from "react"
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
import NintendoPriceClient from "../NintendoPriceClient"
import PlaystationPriceClient from "../PlaystationPriceClient"
import SteamPriceClient from "../SteamPriceClient"

interface Props {
  game: GameOutput
  children: React.ReactNode
}

export default function EditFromWishlist({ game, children }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoadingLinkedState, setIsLoadingLinkedState] = useState(false)
  const [linkedStateLoaded, setLinkedStateLoaded] = useState(false)
  const [linkedStateError, setLinkedStateError] = useState<string | null>(null)

  const [timeToBeat, setTimeToBeat] = useState<number | null>(game.length)

  const [playstationOriginallyLinked, setPlaystationOriginallyLinked] =
    useState(false)
  const [playStationLinked, setPlayStationLinked] = useState(false)
  const [psSwitchDisabled, setPsSwitchDisabled] = useState(true)

  const [nintendoOriginallyLinked, setNintendoOriginallyLinked] =
    useState(false)
  const [nintendoLinked, setNintendoLinked] = useState(false)
  const [ntSwitchDisabled, setNtSwitchDisabled] = useState(true)
  const [steamOriginallyLinked, setSteamOriginallyLinked] = useState(false)
  const [steamLinked, setSteamLinked] = useState(false)
  const [steamSwitchDisabled, setSteamSwitchDisabled] = useState(true)

  useEffect(() => {
    if (!open || linkedStateLoaded) return

    let cancelled = false

    // We defer this DB read until the drawer opens so page render stays fast.
    const loadLinkedState = async () => {
      setIsLoadingLinkedState(true)
      setLinkedStateError(null)

      try {
        const trackedPlatforms = await getTrackedPlatformsForGame(game.id)
        if (cancelled) return

        const psLinked = trackedPlatforms.includes(Platform.PLAYSTATION)
        const nintendoLinked = trackedPlatforms.includes(Platform.NINTENDO)
        const steamLinked = trackedPlatforms.includes(Platform.PC)

        // Keep both "original" and "current" values so save can compute diffs.
        setPlaystationOriginallyLinked(psLinked)
        setPlayStationLinked(psLinked)
        setNintendoOriginallyLinked(nintendoLinked)
        setNintendoLinked(nintendoLinked)
        setSteamOriginallyLinked(steamLinked)
        setSteamLinked(steamLinked)

        setLinkedStateLoaded(true)
      } catch (error) {
        console.error("Error loading tracked platforms:", error)
        if (cancelled) return

        setLinkedStateError("Failed to load tracked stores. Close and retry.")
      } finally {
        if (cancelled) return
        setIsLoadingLinkedState(false)
      }
    }

    loadLinkedState()

    return () => {
      cancelled = true
    }
  }, [game.id, linkedStateLoaded, open])

  const handleSave = async () => {
    if (!linkedStateLoaded) {
      toast.error("Price links are still loading. Try again in a moment.")
      return
    }

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
            <div>
              <label className="text-sm font-medium">Prices</label>
              <p className="text-xs text-muted-foreground">
                Track prices for these stores.
              </p>
              <div className="mt-3 space-y-2">
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
                    disabled={
                      steamSwitchDisabled ||
                      isLoadingLinkedState ||
                      !!linkedStateError
                    }
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
                    disabled={
                      psSwitchDisabled ||
                      isLoadingLinkedState ||
                      !!linkedStateError
                    }
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
                    disabled={
                      ntSwitchDisabled ||
                      isLoadingLinkedState ||
                      !!linkedStateError
                    }
                    className="ml-auto data-[state=checked]:bg-red-600"
                  />
                </div>
              </div>
              {isLoadingLinkedState && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Loading your tracked store links...
                </p>
              )}
              {linkedStateError && (
                <p className="mt-2 text-xs text-red-600">{linkedStateError}</p>
              )}
            </div>
          </form>

          <DrawerFooter>
            <Button
              size="lg"
              disabled={isSaving || isLoadingLinkedState || !!linkedStateError}
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
