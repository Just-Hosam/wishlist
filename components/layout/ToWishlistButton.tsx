"use client"

import { Loader2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  buildNintendoStoreUrl,
  buildPlayStationStoreUrl
} from "@/lib/igdb-store-links"
import { fetchNintendoGameInfo } from "@/server/actions/nintendo"
import { fetchPlayStationGameInfo } from "@/server/actions/playstation"
import { createGame } from "@/server/actions/game"
import { linkPriceToGame } from "@/server/actions/price"
import { GameCategory, IGDBGame, PriceInput } from "@/types"
import { toast } from "sonner"
import PriceLayout from "./PriceLayout"
import { Button } from "../ui/button"
import { Switch } from "../ui/switch"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "../ui/drawer"

interface Props {
  igdbPlaystationUrlSegment: string | null
  igdbNintendoUrlSegment: string | null
  igdbGame: IGDBGame
  timeToBeat: number | null
  children: React.ReactNode
  onSave?: (selection: { playstation: boolean; nintendo: boolean }) => void
}

export default function ToWishlistButton({
  igdbPlaystationUrlSegment,
  igdbNintendoUrlSegment,
  igdbGame,
  timeToBeat,
  children,
  onSave
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [playStationState, setPlayStationState] = useState<{
    loading: boolean
    price: PriceInput | null
    error: string | null
    unavailable: boolean
  }>({ loading: false, price: null, error: null, unavailable: false })

  const [nintendoState, setNintendoState] = useState<{
    loading: boolean
    price: PriceInput | null
    error: string | null
    unavailable: boolean
  }>({ loading: false, price: null, error: null, unavailable: false })

  const [playStationLinked, setPlayStationLinked] = useState(false)
  const [nintendoLinked, setNintendoLinked] = useState(false)

  useEffect(() => {
    let cancelled = false

    // reset switches whenever the referenced game changes
    setPlayStationLinked(false)
    setNintendoLinked(false)

    const urlPs = buildPlayStationStoreUrl(igdbPlaystationUrlSegment || "")
    const urlNt = buildNintendoStoreUrl(igdbNintendoUrlSegment || "")

    const playstationValid =
      !!urlPs &&
      (urlPs.includes("playstation.com") ||
        urlPs.includes("store.playstation.com"))
    const nintendoValid = !!urlNt && urlNt.includes("nintendo.com")

    setPlayStationState((prev) => ({
      ...prev,
      loading: playstationValid,
      price: null,
      error: playstationValid ? null : prev.error,
      unavailable: !playstationValid && !urlPs
    }))

    if (!playstationValid && urlPs) {
      setPlayStationState((prev) => ({
        ...prev,
        loading: false,
        price: null,
        error: "Invalid PS Store Link",
        unavailable: false
      }))
    }

    setNintendoState((prev) => ({
      ...prev,
      loading: nintendoValid,
      price: null,
      error: nintendoValid ? null : prev.error,
      unavailable: !nintendoValid && !urlNt
    }))

    if (!nintendoValid && urlNt) {
      setNintendoState((prev) => ({
        ...prev,
        loading: false,
        price: null,
        error: "Invalid Nintendo Store Link",
        unavailable: false
      }))
    }

    const run = async () => {
      const psPromise = playstationValid
        ? fetchPlayStationGameInfo(urlPs!)
        : null
      const ntPromise = nintendoValid ? fetchNintendoGameInfo(urlNt!) : null

      if (psPromise) {
        psPromise
          .then((info) => {
            if (cancelled) return
            setPlayStationState({
              loading: false,
              price: info,
              error: null,
              unavailable: false
            })
          })
          .catch((error) => {
            console.error("Error fetching PlayStation game info:", error)
            if (cancelled) return
            setPlayStationState({
              loading: false,
              price: null,
              error: "Failed to fetch game information",
              unavailable: false
            })
          })
      }

      if (ntPromise) {
        ntPromise
          .then((info) => {
            if (cancelled) return
            setNintendoState({
              loading: false,
              price: info,
              error: null,
              unavailable: false
            })
          })
          .catch((error) => {
            console.error("Error fetching Nintendo game info:", error)
            if (cancelled) return
            setNintendoState({
              loading: false,
              price: null,
              error: "Failed to fetch game information",
              unavailable: false
            })
          })
      }
    }

    run()

    return () => {
      cancelled = true
    }
  }, [igdbNintendoUrlSegment, igdbPlaystationUrlSegment])

  const handleSave = async () => {
    if (isSaving) return

    setIsSaving(true)

    try {
      const savedGame = await createGame({
        name: igdbGame.name,
        length: timeToBeat ? timeToBeat.toString() : undefined,
        category: GameCategory.WISHLIST,
        platforms: igdbGame.platforms || [],
        nowPlaying: false,
        igdbId: igdbGame.igdbId,
        igdbName: igdbGame.name,
        igdbSlug: igdbGame.slug,
        igdbSummary: igdbGame.summary,
        igdbCoverImageId: igdbGame.coverImageId,
        igdbScreenshotIds: igdbGame.screenshotImageIds || [],
        igdbVideoId: igdbGame.videoId,
        igdbPlatformIds: [],
        igdbFirstReleaseDate: igdbGame.firstReleaseDate,
        igdbNintendoUrlSegment: igdbNintendoUrlSegment,
        igdbPlaystationUrlSegment: igdbPlaystationUrlSegment,
        igdbSteamUrlSegment: igdbGame.steamUrlSegment ?? null
      })

      const linkPromises: Promise<void>[] = []
      if (playStationLinked && playStationState.price?.storeUrl) {
        linkPromises.push(
          linkPriceToGame(savedGame.id, playStationState.price.storeUrl)
        )
      }

      if (nintendoLinked && nintendoState.price?.storeUrl) {
        linkPromises.push(
          linkPriceToGame(savedGame.id, nintendoState.price.storeUrl)
        )
      }

      if (linkPromises.length) {
        await Promise.all(linkPromises)
      }

      toast.success("Added to wishlist")
      onSave?.({ playstation: playStationLinked, nintendo: nintendoLinked })
      setOpen(false)
      router.push("/wishlist")
      router.refresh()
    } catch (error) {
      console.error("Error saving wishlist game:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to save to wishlist"
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={(next) => !isSaving && setOpen(next)}>
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
            <DrawerTitle>Track Prices</DrawerTitle>
            <DrawerDescription>
              Choose which prices to track for this game
            </DrawerDescription>
          </DrawerHeader>
          <form className="space-y-3 px-4 pb-5 pt-3">
            <div className="flex items-center">
              <Image
                src="/logos/playstation.svg"
                alt="PlayStation Logo"
                width={20}
                height={20}
                className="mr-3"
              />
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {playStationState.loading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Fetching price...</span>
                  </div>
                )}

                {!playStationState.loading && playStationState.price && (
                  <PriceLayout
                    onSale={
                      (playStationState.price.currentPrice || 0) <
                      (playStationState.price.regularPrice || 0)
                    }
                    currentPrice={playStationState.price.currentPrice || 0}
                    regularPrice={playStationState.price.regularPrice || 0}
                    currency="CAD"
                  />
                )}

                {!playStationState.loading &&
                  !playStationState.error &&
                  playStationState.unavailable && (
                    <span className="text-sm text-muted-foreground">
                      Not available on Playstation
                    </span>
                  )}

                {!playStationState.loading && playStationState.error && (
                  <span className="text-sm text-red-600">
                    {playStationState.error}
                  </span>
                )}
              </div>

              <Switch
                checked={playStationLinked}
                onCheckedChange={setPlayStationLinked}
                disabled={
                  playStationState.unavailable ||
                  playStationState.loading ||
                  (!playStationState.price && !playStationState.error) ||
                  (!!playStationState.error && !playStationLinked)
                }
                className="data-[state=checked]:bg-blue-600"
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
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {nintendoState.loading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Fetching price...</span>
                  </div>
                )}

                {!nintendoState.loading && nintendoState.price && (
                  <PriceLayout
                    onSale={
                      (nintendoState.price.currentPrice || 0) <
                      (nintendoState.price.regularPrice || 0)
                    }
                    currentPrice={nintendoState.price.currentPrice || 0}
                    regularPrice={nintendoState.price.regularPrice || 0}
                    currency="CAD"
                  />
                )}

                {!nintendoState.loading &&
                  !nintendoState.error &&
                  nintendoState.unavailable && (
                    <span className="text-sm text-muted-foreground">
                      Not available on Nintendo
                    </span>
                  )}

                {!nintendoState.loading && nintendoState.error && (
                  <span className="text-sm text-red-600">
                    {nintendoState.error}
                  </span>
                )}
              </div>

              <Switch
                checked={nintendoLinked}
                onCheckedChange={setNintendoLinked}
                disabled={
                  nintendoState.unavailable ||
                  nintendoState.loading ||
                  (!nintendoState.price && !nintendoState.error) ||
                  (!!nintendoState.error && !nintendoLinked)
                }
                className="data-[state=checked]:bg-red-600"
              />
            </div>
          </form>

          <DrawerFooter>
            <Button type="button" disabled={isSaving} onClick={handleSave}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <DrawerClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
