"use client"

import GameLengthInput from "@/components/layout/GameLengthInput"
import NintendoLinkInput from "@/components/layout/NintendoLinkInput"
import PlayStationLinkInput from "@/components/layout/PlayStationLinkInput"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTabContext } from "@/contexts/TabContext"
import {
  buildIGDBImageUrl,
  buildNintendoStoreUrl
} from "@/lib/igdb-store-links"
import { buildPlayStationStoreUrl } from "@/lib/playstation/playstation-price"

import { createGame, saveGame, updateGame } from "@/server/actions/game"
import { linkPriceToGame, unlinkPriceFromGame } from "@/server/actions/price"
import {
  GameInput,
  GameCategory,
  Platform,
  PriceInput,
  PriceOutput,
  GameOutput
} from "@/types"

import clsx from "clsx"
import { CheckCircle2, FolderCheck, Heart } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useReducer, useState, useTransition } from "react"
import { toast } from "sonner"

interface Props {
  game?: GameInput & { id?: string }
  isEdit?: boolean
  isPlayStationLinked?: boolean | null
  isNintendoLinked?: boolean | null
}

type PlatformState = Record<Platform, boolean>

export default function GameForm({
  game,
  isEdit = false,
  isPlayStationLinked = false,
  isNintendoLinked = false
}: Props) {
  const router = useRouter()
  const { activeTab } = useTabContext()
  const [isPending, startTransition] = useTransition()
  const [isPsLinked, setIsPsLinked] = useState<boolean | null>(
    isPlayStationLinked
  )
  const [isNsLinked, setIsNsLinked] = useState<boolean | null>(isNintendoLinked)
  const [nowPlaying, setNowPlaying] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false)

  const platformReducer = (
    state: PlatformState,
    action: { type: "toggle" | "set"; platform: Platform; value?: boolean }
  ) => {
    switch (action.type) {
      case "toggle":
        return { ...state, [action.platform]: !state[action.platform] }
      case "set":
        return { ...state, [action.platform]: !!action.value }
      default:
        return state
    }
  }

  const [platforms, dispatchPlatforms] = useReducer(platformReducer, {
    [Platform.PLAYSTATION]: false,
    [Platform.NINTENDO]: false,
    [Platform.XBOX]: false,
    [Platform.PC]: false
  })

  const formReducer = (
    state: {
      name: string
      length: string
      category: GameCategory
    },
    action: { field: string; value: any }
  ) => {
    return {
      ...state,
      [action.field]: action.value
    }
  }

  const getInitialCategory = (): GameCategory => {
    if (activeTab === "WISHLIST") return GameCategory.WISHLIST
    if (activeTab === "LIBRARY") return GameCategory.LIBRARY
    return GameCategory.WISHLIST
  }

  const [formData, dispatch] = useReducer(formReducer, {
    name: "",
    length: "",
    category: getInitialCategory()
  })

  useEffect(() => {
    if (game) {
      const gameName = game.igdbName || ""
      dispatch({ field: "name", value: gameName })
      dispatch({ field: "length", value: game.length?.toString() || "" })
      // Only use game.category when editing an existing game
      // For new games from IGDB, use the activeTab context
      if (isEdit) {
        dispatch({ field: "category", value: game.category })
      }
      setNowPlaying(!!game.nowPlaying)
      if (game.platforms && Array.isArray(game.platforms)) {
        game.platforms.forEach((p) =>
          dispatchPlatforms({ type: "set", platform: p, value: true })
        )
      }

      // Mark data as loaded after all setup is complete
      setIsDataLoaded(true)
    } else {
      // For new games (not editing), mark as loaded immediately
      setIsDataLoaded(true)
    }
  }, [game])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.error("Game name is required")
      return
    }

    if (!(formData.category in GameCategory)) {
      toast.error("Invalid category selected")
      return
    }

    if (!formData.category) {
      toast.error("Category is required")
      return
    }

    startTransition(async () => {
      try {
        const gameData: GameInput = {
          length: formData.length ? Number(formData.length) : null,
          category: formData.category,
          platforms: Object.entries(platforms)
            .filter(([, v]) => v)
            .map(([k]) => k as Platform),
          nowPlaying:
            formData.category === GameCategory.LIBRARY ? nowPlaying : false,
          // IGDB metadata
          igdbId: game?.igdbId || null,
          igdbName: game?.igdbName || null,
          igdbSlug: game?.igdbSlug || null,
          igdbSummary: game?.igdbSummary || null,
          igdbCoverImageId: game?.igdbCoverImageId || null,
          igdbScreenshotIds: game?.igdbScreenshotIds || [],
          igdbVideoId: game?.igdbVideoId || null,
          igdbPlatformIds: game?.igdbPlatformIds || [],
          igdbFirstReleaseDate: game?.igdbFirstReleaseDate || null,
          igdbNintendoUrlSegment: game?.igdbNintendoUrlSegment || null,
          igdbPlaystationUrlSegment: game?.igdbPlaystationUrlSegment || null,
          igdbSteamUrlSegment: game?.igdbSteamUrlSegment || null
        }

        const savedGame = await saveGame(gameData, game?.id)

        // Handle PlayStation price linking/unlinking
        if (game?.igdbPlaystationUrlSegment) {
          const playstationStoreUrl = buildPlayStationStoreUrl(
            game.igdbPlaystationUrlSegment
          )
          if (isPsLinked) {
            await linkPriceToGame(savedGame.id, playstationStoreUrl)
          } else {
            await unlinkPriceFromGame(savedGame.id, playstationStoreUrl)
          }
        }

        // Handle Nintendo price linking/unlinking
        if (game?.igdbNintendoUrlSegment) {
          const nintendoStoreUrl = buildNintendoStoreUrl(
            game.igdbNintendoUrlSegment
          )
          if (isNsLinked) {
            await linkPriceToGame(savedGame.id, nintendoStoreUrl)
          } else {
            await unlinkPriceFromGame(savedGame.id, nintendoStoreUrl)
          }
        }

        toast.success(`Game ${isEdit ? "updated" : "added"} successfully!`)
        router.push("/lists")
      } catch (error) {
        console.error(`Error ${isEdit ? "updating" : "creating"} game:`, error)
        toast.error(
          error instanceof Error
            ? error.message
            : `Failed to ${isEdit ? "update" : "create"} game`
        )
      }
    })
  }

  const togglePlatformSelection = (platform: Platform) => {
    dispatchPlatforms({ type: "toggle", platform })
  }

  return (
    <form onSubmit={handleSubmit} className="pt-2">
      <Button
        className="absolute right-6 top-5 z-40"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Saving..." : "Save"}
      </Button>

      {game?.igdbCoverImageId && (
        <div
          className="mb-6 flex flex-col items-center text-center duration-500 animate-in fade-in slide-in-from-top-3"
          style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
        >
          <div className="mb-4 h-[160px] w-[120px] overflow-hidden rounded-xl bg-gray-200 shadow-lg">
            <Image
              src={buildIGDBImageUrl(game.igdbCoverImageId)}
              alt={game.igdbName || "Game cover"}
              width={120}
              height={160}
            />
          </div>
          <h2 className="w-2/3 text-xl font-medium text-gray-900">
            {game.igdbName}
          </h2>
        </div>
      )}

      <div
        className="mt-5 duration-500 animate-in fade-in slide-in-from-top-3"
        style={{ animationDelay: "50ms", animationFillMode: "backwards" }}
      >
        {(!isEdit || isDataLoaded) && (
          <GameLengthInput
            igdbGameId={game?.igdbId?.toString()}
            value={formData.length}
            onChange={(value) => dispatch({ field: "length", value })}
          />
        )}
      </div>

      <div
        className="mt-5 duration-500 animate-in fade-in slide-in-from-top-3"
        style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
      >
        <label className="text-sm font-semibold" htmlFor="category">
          Category <span className="text-xs">*</span>
        </label>
        <Tabs
          value={formData.category}
          onValueChange={(value) =>
            dispatch({ field: "category", value: value as GameCategory })
          }
        >
          <TabsList className="mt-2 w-full px-3 py-2">
            <TabsTrigger value={GameCategory.WISHLIST}>
              <Heart />
              {formData.category === GameCategory.WISHLIST && (
                <span className="md:hidden">Wishlist</span>
              )}
              <span className="hidden md:block">Wishlist</span>
            </TabsTrigger>
            <TabsTrigger value={GameCategory.LIBRARY}>
              <FolderCheck />
              {formData.category === GameCategory.LIBRARY && (
                <span className="md:hidden">Library</span>
              )}
              <span className="hidden md:block">Library</span>
            </TabsTrigger>
            <TabsTrigger value={GameCategory.COMPLETED}>
              <CheckCircle2 />
              {formData.category === GameCategory.COMPLETED && (
                <span className="md:hidden">Completed</span>
              )}
              <span className="hidden md:block">Completed</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {formData.category === GameCategory.WISHLIST && (
        <div
          className="mt-5 duration-500 animate-in fade-in slide-in-from-top-3"
          style={{ animationDelay: "150ms", animationFillMode: "backwards" }}
        >
          <label className="text-sm font-semibold" htmlFor="category">
            Stores
          </label>
          <div className="mt-3">
            <PlayStationLinkInput
              onLinked={(isLinked) => setIsPsLinked(isLinked)}
              url={buildPlayStationStoreUrl(
                game?.igdbPlaystationUrlSegment || ""
              )}
              isInitiallyLinked={isPlayStationLinked || false}
            />
          </div>
          <div className="mt-3">
            <NintendoLinkInput
              onLinked={(isLinked) => setIsNsLinked(isLinked)}
              url={buildNintendoStoreUrl(game?.igdbNintendoUrlSegment || "")}
              isInitiallyLinked={isNintendoLinked || false}
            />
          </div>
        </div>
      )}

      {formData.category === GameCategory.LIBRARY && (
        <div
          className="mt-5 duration-500 animate-in fade-in slide-in-from-top-3"
          style={{ animationDelay: "150ms", animationFillMode: "backwards" }}
        >
          <label className="text-sm font-semibold" htmlFor="nowPlayingToggle">
            Now Playing
          </label>
          <button
            id="nowPlayingToggle"
            type="button"
            className={clsx(
              "mt-2 flex w-full items-center rounded-[32px] border px-6 py-4 text-sm transition-colors",
              nowPlaying && "border-emerald-500 bg-emerald-100"
            )}
            onClick={() => setNowPlaying((prev) => !prev)}
            aria-pressed={nowPlaying}
          >
            <span>
              {nowPlaying ? "Currently being Played" : "Not being Played"}
            </span>
          </button>
        </div>
      )}

      {(formData.category === GameCategory.LIBRARY ||
        formData.category === GameCategory.COMPLETED) && (
        <div
          key={formData.category}
          className="mt-5 duration-500 animate-in fade-in slide-in-from-top-3"
          style={{
            animationDelay:
              formData.category === GameCategory.LIBRARY ? "200ms" : "150ms",
            animationFillMode: "backwards"
          }}
        >
          <label className="text-sm font-semibold" htmlFor="category">
            Owned on
          </label>
          <p className="text-xs text-muted-foreground">
            Select all platforms you own the game on.
          </p>
          <div
            className={clsx(
              "mt-2 flex cursor-pointer items-center rounded-[32px] border px-6 py-4 text-sm",
              platforms[Platform.PLAYSTATION] && "border-blue-500 bg-blue-100"
            )}
            onClick={() => togglePlatformSelection(Platform.PLAYSTATION)}
          >
            <Image
              src="/logos/playstation.svg"
              alt="PlayStation Logo"
              width={18}
              height={18}
              className="mr-2"
            />
            Playstation
          </div>
          <div
            className={clsx(
              "mt-2 flex cursor-pointer items-center rounded-[32px] border px-6 py-4 text-sm",
              platforms[Platform.NINTENDO] && "border-blue-500 bg-blue-100"
            )}
            onClick={() => togglePlatformSelection(Platform.NINTENDO)}
          >
            <Image
              src="/logos/nintendo-switch.svg"
              alt="Nintendo Switch Logo"
              width={18}
              height={18}
              className="mr-2"
            />
            Nintendo
          </div>
        </div>
      )}
    </form>
  )
}
