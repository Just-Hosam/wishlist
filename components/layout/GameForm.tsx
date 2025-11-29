"use client"

import GameLengthInput from "@/components/layout/GameLengthInput"
import NintendoLinkInput from "@/components/layout/NintendoLinkInput"
import PlayStationLinkInput from "@/components/layout/PlayStationLinkInput"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTabContext } from "@/contexts/TabContext"
import { buildIGDBImageUrl } from "@/lib/igdb-store-links"
import { type NintendoGameInfo } from "@/lib/nintendo-price"
import { type GamePrice } from "@/lib/playstation-price"
import { createGame, updateGame } from "@/server/actions/game"
import { GameCategory, Platform } from "@/types/game"
import clsx from "clsx"
import { Archive, CheckCircle2, FolderCheck, Heart, Save } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useReducer, useState, useTransition } from "react"
import { toast } from "sonner"
import { PageHeader } from "./PageHeader"

interface Game {
  id?: string

  // IGDB fields (stored directly on Game model now)
  igdbId?: number
  igdbName?: string
  igdbSlug?: string
  igdbSummary?: string
  igdbCoverImageId?: string
  igdbScreenshotIds?: string[]
  igdbVideoId?: string | null
  igdbPlatformIds?: number[]
  igdbFirstReleaseDate?: number
  igdbNintendoUrlSegment?: string | null
  igdbPlaystationUrlSegment?: string | null
  igdbSteamUrlSegment?: string | null

  // Legacy fields for backward compatibility
  name?: string
  length?: number | null
  category: GameCategory
  platforms?: Platform[]
  nowPlaying?: boolean

  // Store URLs (computed from URL segments, used for display)
  storeUrls?: {
    nintendo: string | null
    playstation: string | null
  }

  // Price data
  prices?: {
    platform: Platform
    externalId: string
    storeUrl: string | null
    countryCode: string | null
    currencyCode: string | null
    regularPrice: number | null
    currentPrice: number | null
  }[]
}

interface GameFormProps {
  game?: Game
  isEdit?: boolean
  isFromIGDB?: boolean
}

interface PlatformState {
  [Platform.PLAYSTATION]: boolean
  [Platform.NINTENDO]: boolean
  [Platform.XBOX]: boolean
  [Platform.PC]: boolean
}

export default function GameForm({
  game,
  isEdit = false,
  isFromIGDB = false
}: GameFormProps) {
  const router = useRouter()
  const { activeTab } = useTabContext()
  const [isPending, startTransition] = useTransition()
  const [nintendoInfo, setNintendoInfo] = useState<NintendoGameInfo | null>(
    null
  )
  const [playstationInfo, setPlaystationInfo] = useState<GamePrice | null>(null)
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

  const [formData, dispatch] = useReducer(formReducer, {
    name: "",
    length: "",
    category: activeTab
  })

  useEffect(() => {
    if (game) {
      // Use igdbName if available (from IGDB), otherwise use legacy name field
      const gameName = game.igdbName || game.name || ""
      dispatch({ field: "name", value: gameName })
      dispatch({ field: "length", value: game.length?.toString() || "" })
      dispatch({ field: "category", value: game.category })
      setNowPlaying(!!game.nowPlaying)
      if (game.platforms && Array.isArray(game.platforms)) {
        game.platforms.forEach((p) =>
          dispatchPlatforms({ type: "set", platform: p, value: true })
        )
      }

       // Set existing platform data if available
      // Set existing platform data if available
      if (game.prices) {
        const nintendoPrice = game.prices.find(
          (p) => p.platform === Platform.NINTENDO
        )
        const playstationPrice = game.prices.find(
          (p) => p.platform === Platform.PLAYSTATION
        )

        if (nintendoPrice) {
          // Create Nintendo game info from existing price data
          const regularPrice = nintendoPrice.regularPrice || 0
          const currentPrice = nintendoPrice.currentPrice || 0

          const nintendoInfo: NintendoGameInfo = {
            nsuid: nintendoPrice.externalId,
            storeUrl: nintendoPrice.storeUrl || "",
            country: nintendoPrice.countryCode || "",
            currency: nintendoPrice.currencyCode || "",
            raw_price_value: regularPrice.toString(),
            discounted_price_value:
              currentPrice !== regularPrice
                ? currentPrice.toString()
                : undefined,
            raw_price: `$${regularPrice}`,
            discounted_price:
              currentPrice !== regularPrice ? `$${currentPrice}` : undefined,
            onSale: currentPrice !== regularPrice
          }
          setNintendoInfo(nintendoInfo)
        }

        if (playstationPrice) {
          // Create PlayStation game info from existing price data
          const regularPrice = playstationPrice.regularPrice || 0
          const currentPrice = playstationPrice.currentPrice || 0

          const gameName = game.igdbName || game.name || ""
          const playstationInfo: GamePrice = {
            name: gameName,
            storeUrl: playstationPrice.storeUrl || "",
            currency: playstationPrice.currencyCode || "",
            basePrice: `$${regularPrice}`,
            currentPrice: `$${currentPrice}`,
            savings: regularPrice - currentPrice
          }
          setPlaystationInfo(playstationInfo)
        }
      }

      // Handle IGDB store URLs (pre-populated from IGDB data)
      if (game.storeUrls && isFromIGDB) {
        // Note: We don't set price info for IGDB games initially
        // The user can fetch prices later if they want
        // Store URLs are just for display/reference
      }

      // Mark data as loaded after all setup is complete
      setIsDataLoaded(true)
    } else {
      // For new games (not editing), mark as loaded immediately
      setIsDataLoaded(true)
    }
  }, [game, isFromIGDB])

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
        const gameData = {
          name: formData.name.trim(),
          length: formData.length,
          category: formData.category,
          platforms: Object.entries(platforms)
            .filter(([, v]) => v)
            .map(([k]) => k as Platform),
          nowPlaying:
            formData.category === GameCategory.LIBRARY ? nowPlaying : false,
          // IGDB metadata
          igdbId: game?.igdbId,
          igdbName: game?.igdbName,
          igdbSlug: game?.igdbSlug,
          igdbSummary: game?.igdbSummary,
          igdbCoverImageId: game?.igdbCoverImageId,
          igdbScreenshotIds: game?.igdbScreenshotIds,
          igdbVideoId: game?.igdbVideoId,
          igdbPlatformIds: game?.igdbPlatformIds,
          igdbFirstReleaseDate: game?.igdbFirstReleaseDate,
          igdbNintendoUrlSegment: game?.igdbNintendoUrlSegment,
          igdbPlaystationUrlSegment: game?.igdbPlaystationUrlSegment,
          igdbSteamUrlSegment: game?.igdbSteamUrlSegment,
          nintendo: nintendoInfo
            ? {
                nsuid: nintendoInfo.nsuid,
                storeUrl: nintendoInfo.storeUrl,
                countryCode: nintendoInfo.country,
                currencyCode: nintendoInfo.currency,
                regularPrice: nintendoInfo.raw_price_value
                  ? parseFloat(nintendoInfo.raw_price_value)
                  : undefined,
                currentPrice: nintendoInfo.discounted_price_value
                  ? parseFloat(nintendoInfo.discounted_price_value)
                  : nintendoInfo.raw_price_value
                    ? parseFloat(nintendoInfo.raw_price_value)
                    : undefined
              }
            : undefined,
          playstation: playstationInfo
            ? {
                storeUrl: playstationInfo.storeUrl,
                countryCode: undefined, // PlayStation API doesn't provide country code
                currencyCode: playstationInfo.currency,
                regularPrice: (() => {
                  const cleaned = playstationInfo.basePrice.replace(
                    /[^0-9.]/g,
                    ""
                  )
                  return cleaned ? parseFloat(cleaned) : undefined
                })(),
                currentPrice: (() => {
                  const cleaned = playstationInfo.currentPrice.replace(
                    /[^0-9.]/g,
                    ""
                  )
                  return cleaned ? parseFloat(cleaned) : undefined
                })()
              }
            : undefined
        }

        if (isEdit && game?.id) {
          await updateGame(game.id, gameData)
        } else {
          await createGame(gameData)
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
    <form onSubmit={handleSubmit}>
      <PageHeader>
        <Button className="ml-auto" type="submit" disabled={isPending}>
          <Save />
          {isPending ? "Saving..." : "Save"}
        </Button>
      </PageHeader>

      {/* Cover Image Display for IGDB Games */}
      {isFromIGDB && game?.igdbCoverImageId && (
        <div
          className="mb-6 flex flex-col items-center text-center duration-500 animate-in fade-in slide-in-from-top-3"
          style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
        >
          <div className="mb-4 h-[160px] w-[120px] overflow-hidden rounded-xl bg-gray-200 shadow-lg">
            <Image
              src={buildIGDBImageUrl(game.igdbCoverImageId)}
              alt={game.igdbName || game.name || "Game cover"}
              width={120}
              height={160}
            />
          </div>
          <h2 className="w-2/3 text-xl font-medium text-gray-900 dark:text-gray-100">
            {game.igdbName || game.name}
          </h2>
        </div>
      )}

      {!isFromIGDB && (
        <div
          className="duration-500 animate-in fade-in slide-in-from-top-3"
          style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
        >
          <label className="text-sm font-semibold" htmlFor="name">
            Game Name <span className="text-xs">*</span>
          </label>
          <Input
            id="name"
            type="text"
            className="mt-2"
            placeholder="e.g. The Last Faith"
            value={formData.name}
            onChange={(e) => dispatch({ field: "name", value: e.target.value })}
            required
          />
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
            <TabsTrigger value={GameCategory.ARCHIVED}>
              <Archive />
              {formData.category === GameCategory.ARCHIVED && (
                <span className="md:hidden">Archived</span>
              )}
              <span className="hidden md:block">Archived</span>
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
              onGameInfoFound={(gameInfo) => setPlaystationInfo(gameInfo)}
              onGameInfoCleared={() => setPlaystationInfo(null)}
              existingGameInfo={playstationInfo}
              initialUrl={game?.storeUrls?.playstation || null}
            />
          </div>
          <div className="mt-3">
            <NintendoLinkInput
              onGameInfoFound={(gameInfo) => setNintendoInfo(gameInfo)}
              onGameInfoCleared={() => setNintendoInfo(null)}
              existingGameInfo={nintendoInfo}
              initialUrl={game?.storeUrls?.nintendo || null}
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
