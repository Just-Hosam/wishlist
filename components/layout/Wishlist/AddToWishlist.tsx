"use client"

import { useRouter } from "@/components/navigation"
import {
  buildNintendoStoreUrl,
  buildPlayStationStoreUrl,
  buildSteamStoreUrl
} from "@/lib/igdb-store-links"
import { saveGame } from "@/server/actions/game"
import { linkPriceToGame } from "@/server/actions/price"
import { GameCategory, GameInput, IGDBGame } from "@/types"
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
import { Switch } from "../../ui/switch"
import NintendoPriceClient from "../NintendoPriceClient"
import PlaystationPriceClient from "../PlaystationPriceClient"
import SteamPriceClient from "../SteamPriceClient"

interface Props {
  igdbPlaystationUrlSegment: string | null
  igdbNintendoUrlSegment: string | null
  igdbSteamUrlSegment: string | null
  igdbGame: IGDBGame
  timeToBeat: number | null
  children: React.ReactNode
}

export default function AddToWishlist({
  igdbPlaystationUrlSegment,
  igdbNintendoUrlSegment,
  igdbSteamUrlSegment,
  igdbGame,
  timeToBeat,
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
        category: GameCategory.WISHLIST,
        platforms: [],
        length: timeToBeat || null,
        nowPlaying: false
      }

      const savedGame = await saveGame(game)

      let playstationPromise
      let nintendoPromise
      let steamPromise

      if (playStationLinked && igdbPlaystationUrlSegment) {
        const playstationStoreUrl = buildPlayStationStoreUrl(
          igdbPlaystationUrlSegment
        )
        if (playstationStoreUrl) {
          playstationPromise = linkPriceToGame(
            savedGame.id,
            playstationStoreUrl
          )
        }
      }

      if (nintendoLinked && igdbNintendoUrlSegment) {
        const nintendoStoreUrl = buildNintendoStoreUrl(igdbNintendoUrlSegment)
        if (nintendoStoreUrl) {
          nintendoPromise = linkPriceToGame(savedGame.id, nintendoStoreUrl)
        }
      }

      if (steamLinked && igdbSteamUrlSegment) {
        const steamStoreUrl = buildSteamStoreUrl(igdbSteamUrlSegment)
        if (steamStoreUrl) {
          steamPromise = linkPriceToGame(savedGame.id, steamStoreUrl)
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
            <DrawerTitle>Add to Wishlist</DrawerTitle>
          </DrawerHeader>
          <form className="px-4 pb-5 pt-3">
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
                  igdbSteamUrlSegment={igdbSteamUrlSegment}
                  onFetchSuccess={() => setSteamSwitchDisabled(false)}
                />

                <Switch
                  checked={steamLinked}
                  onCheckedChange={setSteamLinked}
                  disabled={steamSwitchDisabled}
                  className="ml-auto data-[state=checked]:bg-[#134376]"
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
                  igdbPlaystationUrlSegment={igdbPlaystationUrlSegment}
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
                  igdbNintendoUrlSegment={igdbNintendoUrlSegment}
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
          </form>

          <DrawerFooter>
            <Button
              size="lg"
              disabled={isSaving}
              variant="accent"
              onClick={handleSave}
            >
              {isSaving ? "Adding..." : "Add to Wishlist"}
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
