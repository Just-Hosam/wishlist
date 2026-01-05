"use client"

import {
  buildNintendoStoreUrl,
  buildPlayStationStoreUrl
} from "@/lib/igdb-store-links"
import { moveGame, saveGame } from "@/server/actions/game"
import { linkPriceToGame } from "@/server/actions/price"
import { GameCategory, GameInput, GameOutput, IGDBGame } from "@/types"
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

interface Props {
  igdbPlaystationUrlSegment: string | null
  igdbNintendoUrlSegment: string | null
  gameId: string
  children: React.ReactNode
}

export default function MoveToWishlist({
  igdbPlaystationUrlSegment,
  igdbNintendoUrlSegment,
  gameId,
  children
}: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [playStationLinked, setPlayStationLinked] = useState(false)
  const [psSwitchDisabled, setPsSwitchDisabled] = useState(true)
  const [nintendoLinked, setNintendoLinked] = useState(false)
  const [ntSwitchDisabled, setNtSwitchDisabled] = useState(true)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      await moveGame(gameId, GameCategory.WISHLIST)

      let playstationPromise
      let nintendoPromise

      if (playStationLinked && igdbPlaystationUrlSegment) {
        const playstationStoreUrl = buildPlayStationStoreUrl(
          igdbPlaystationUrlSegment
        )
        if (playstationStoreUrl) {
          playstationPromise = linkPriceToGame(gameId, playstationStoreUrl)
        }
      }

      if (nintendoLinked && igdbNintendoUrlSegment) {
        const nintendoStoreUrl = buildNintendoStoreUrl(igdbNintendoUrlSegment)
        if (nintendoStoreUrl) {
          nintendoPromise = linkPriceToGame(gameId, nintendoStoreUrl)
        }
      }

      await Promise.all([playstationPromise, nintendoPromise])

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
