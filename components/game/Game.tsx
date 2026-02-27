import { buildIGDBImageUrl } from "@/lib/igdb-store-links"
import { formatReleaseDate, tryCatch } from "@/lib/utils"
import { getCachedSteamReviews } from "@/server/actions/reviews"
import {
  getCachedBackloggdTimeToBeat,
  getCachedIGDBTimeToBeat
} from "@/server/actions/time-to-beat"
import {
  ExternalLink,
  Frown,
  Laugh,
  LoaderCircle,
  Meh,
  Smile
} from "lucide-react"
import Image from "next/image"
import { Suspense } from "react"
import NintendoPrice from "../pricing/NintendoPrice"
import PlaystationPrice from "../pricing/PlaystationPrice"
import SteamPrice from "../pricing/SteamPrice"
import { Button } from "../ui/button"
import { ExpandableText } from "../ui/expandable-text"
import TimeToBeat from "./TimeToBeat"
import { YoutubeVideo } from "./YoutubeVideo"

interface Props {
  imageId: string
  name: string
  summary?: string
  igdbId: string
  igdbSlug: string
  igdbPlaystationUrlSegment?: string
  igdbNintendoUrlSegment?: string
  igdbSteamUrlSegment?: string
  igdbFirstReleaseDate?: number
  igdbScreenshotIds?: string[]
  igdbVideoIds?: string[]
}

export function Game({
  imageId,
  name,
  summary,
  igdbId,
  igdbSlug,
  igdbPlaystationUrlSegment,
  igdbNintendoUrlSegment,
  igdbSteamUrlSegment,
  igdbFirstReleaseDate,
  igdbScreenshotIds,
  igdbVideoIds
}: Props) {
  const youtubeReviewSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " review")}`
  const hltbSearchUrl = `https://howlongtobeat.com/?q=${encodeURIComponent(name)}`
  const steamId = igdbSteamUrlSegment?.split("/")?.[1]
  const steamDBUrl = `https://steamdb.info/app/${steamId}/`

  return (
    <div className="custom-slide-up-fade-in">
      <header className="mx-auto flex flex-col items-center text-center">
        <div className="mb-5 h-[246px] w-[185px] overflow-hidden rounded-3xl bg-gray-200 shadow-md">
          <Image
            src={buildIGDBImageUrl(imageId || "")}
            alt={name || "Game cover"}
            width={185}
            height={246}
            sizes="185px"
            priority
          />
        </div>
        <h1 className="mb-1 max-w-[80%] text-2xl font-bold">{name}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {igdbFirstReleaseDate && (
            <p>{formatReleaseDate(igdbFirstReleaseDate)}</p>
          )}
        </div>
      </header>

      {/* PRICES */}
      <div className="mt-8">
        <label className="font-semibold">Prices</label>
        <div className="mt-4 space-y-3 pl-2">
          <div className="flex items-center">
            <Image
              src="/logos/steam.svg"
              alt="Steam Logo"
              width={20}
              height={20}
              className="mr-3"
              unoptimized
            />
            <Suspense
              fallback={
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span>Fetching price...</span>
                </div>
              }
            >
              <SteamPrice igdbSteamUrlSegment={igdbSteamUrlSegment || null} />
            </Suspense>
          </div>
          <div className="flex items-center">
            <Image
              src="/logos/playstation.svg"
              alt="PlayStation Logo"
              width={20}
              height={20}
              className="mr-3"
              unoptimized
            />
            <Suspense
              fallback={
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span>Fetching price...</span>
                </div>
              }
            >
              <PlaystationPrice
                igdbPlaystationUrlSegment={igdbPlaystationUrlSegment || null}
              />
            </Suspense>
          </div>
          <div className="flex items-center">
            <Image
              src="/logos/nintendo-switch.svg"
              alt="Nintendo Switch Logo"
              width={20}
              height={20}
              className="mr-3"
              unoptimized
            />
            <Suspense
              fallback={
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  <span>Fetching price...</span>
                </div>
              }
            >
              <NintendoPrice
                igdbNintendoUrlSegment={igdbNintendoUrlSegment || null}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* SUMMARY */}
      {summary && (
        <div className="mt-8">
          <label className="font-semibold">Summary</label>
          <ExpandableText
            text={summary}
            className="mt-2 text-sm text-muted-foreground"
          />
        </div>
      )}

      {/* SCREENSHOTS */}
      {igdbScreenshotIds && (
        <div className="mt-8 flex flex-col">
          <label className="mb-4 font-semibold">Screenshots</label>
          <div
            className="hide-scrollbar -mx-4 snap-x snap-mandatory overflow-x-auto scroll-smooth"
            tabIndex={0}
            role="region"
            aria-label="Screenshots"
          >
            <div className="flex">
              {igdbScreenshotIds.map((id, index) => {
                if (index >= 8) return null
                return (
                  <div
                    key={id}
                    // 320px = 308px (image) + 12px (2x 6px horizontal padding)
                    // 330px = 308px (image) + 6px (horizontal padding) + 10px (first or last element, 16px - 6px)
                    className="w-[90%] max-w-[320px] shrink-0 snap-center px-[6px] first:max-w-[330px] first:pl-4 last:max-w-[330px] last:pr-4"
                  >
                    <Image
                      src={buildIGDBImageUrl(id || "")}
                      alt={name || "Game cover"}
                      width={308}
                      height={173}
                      sizes="(max-width: 640px) 90vw, 308px"
                      className="overflow-hidden rounded-2xl"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIDEOS */}
      {igdbVideoIds && igdbVideoIds.length > 0 && (
        <div className="mt-8 flex flex-col">
          <label className="mb-4 font-semibold">Videos</label>
          <div
            className="hide-scrollbar -mx-4 snap-x snap-mandatory overflow-x-auto scroll-smooth"
            tabIndex={0}
            role="region"
            aria-label="Videos"
          >
            <div className="flex">
              {igdbVideoIds.map((videoId, index) => {
                if (index >= 6) return null
                return (
                  <div
                    key={videoId}
                    // 320px = 308px (image) + 12px (2x 6px horizontal padding)
                    // 330px = 308px (image) + 6px (horizontal padding) + 10px (first or last element, 16px - 6px)
                    className="w-[90%] max-w-[320px] shrink-0 snap-center px-[6px] first:max-w-[330px] first:pl-4 last:max-w-[330px] last:pr-4"
                  >
                    <YoutubeVideo
                      videoId={videoId}
                      width={308}
                      height={173}
                      sizes="(max-width: 640px) 90vw, 308px"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      {steamId && (
        <div className="mt-8">
          <label className="mb-4 block font-semibold">Reviews</label>
          <Suspense
            fallback={
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span>Fetching reviews...</span>
              </div>
            }
          >
            <SteamReviews steamId={steamId} />
          </Suspense>
        </div>
      )}

      {/* TIME TO BEAT */}
      <div className="mt-8">
        <label className="mb-4 block font-semibold">Time to Beat</label>
        <div className="space-y-2">
          {igdbSlug && (
            <Suspense fallback={<TimeToBeat title="Backloggd" loading />}>
              <BackloggdTimeToBeat slug={igdbSlug} />
            </Suspense>
          )}
          <Suspense fallback={<TimeToBeat title="IGDB API" loading />}>
            <IGDBTimeToBeat igdbGameId={igdbId} />
          </Suspense>
        </div>
      </div>

      {/* MISC */}
      {name && (
        <div className="mt-8 flex flex-col">
          <label className="mb-4 font-semibold">External</label>
          <a
            href={hltbSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button
              size="lg"
              variant="outline"
              className="h-auto w-full justify-between gap-3 px-6 py-4"
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/logos/hltb.png"
                  alt="HLTB logo"
                  width={19}
                  height={19}
                  className="rounded-sm drop-shadow-2xl"
                  unoptimized
                />
                <span className="font-semibold">HLTB Time to Beat</span>
              </div>
              <ExternalLink size={16} className="text-muted-foreground" />
            </Button>
          </a>
          <a
            href={youtubeReviewSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex-1"
          >
            <Button
              size="lg"
              variant="outline"
              className="h-auto w-full justify-between gap-3 px-6 py-4"
            >
              <div className="flex items-center gap-2">
                <Image
                  src="/logos/youtube.svg"
                  alt="YouTube logo"
                  width={22}
                  height={22}
                  className="drop-shadow-2xl"
                  unoptimized
                />
                <span className="font-semibold">Reviews on Youtube</span>
              </div>
              <ExternalLink size={16} className="text-muted-foreground" />
            </Button>
          </a>
          {steamId && (
            <a
              href={steamDBUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex-1"
            >
              <Button
                size="lg"
                variant="outline"
                className="h-auto w-full justify-between gap-3 px-6 py-4"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/logos/steam-db.svg"
                    alt="SteamDB logo"
                    width={17}
                    height={17}
                    className="rounded-sm drop-shadow-2xl"
                    unoptimized
                  />
                  <span className="font-semibold">Steam Price History</span>
                </div>
                <ExternalLink size={16} className="text-muted-foreground" />
              </Button>
            </a>
          )}
        </div>
      )}
    </div>
  )
}

async function IGDBTimeToBeat({ igdbGameId }: { igdbGameId: string }) {
  const { data: timeToBeat, error } = await tryCatch(
    getCachedIGDBTimeToBeat(igdbGameId)
  )

  if (error) {
    console.error("Error fetching IGDB time to beat info:", error)
    return <TimeToBeat title="IGDB API" />
  }

  return (
    <TimeToBeat
      story={timeToBeat?.story || 0}
      extra={timeToBeat?.extra || 0}
      complete={timeToBeat?.complete || 0}
      title="IGDB API"
    />
  )
}

async function BackloggdTimeToBeat({ slug }: { slug: string }) {
  const { data: timeToBeat, error } = await tryCatch(
    getCachedBackloggdTimeToBeat(slug)
  )

  if (error) {
    console.error("Error fetching Backloggd time to beat info:", error)
    return <TimeToBeat title="Backloggd" />
  }

  return (
    <TimeToBeat
      story={timeToBeat?.story || 0}
      extra={timeToBeat?.extra || 0}
      complete={timeToBeat?.complete || 0}
      title="Backloggd"
    />
  )
}

async function SteamReviews({ steamId }: { steamId: string }) {
  const { data, error } = await tryCatch(getCachedSteamReviews(steamId))

  if (error) return <div>Error: {error.message}</div>

  let icon

  switch (data.description) {
    case "Overwhelmingly Positive":
    case "Very Positive":
      icon = <Laugh className="h-4 w-4 text-blue-500" />
      break
    case "Positive":
    case "Mostly Positive":
      icon = <Smile className="h-4 w-4 text-blue-500" />
      break
    case "Mixed":
      icon = <Meh className="h-4 w-4 text-yellow-500" />
      break
    case "Mostly Negative":
    case "Negative":
    case "Overwhelmingly Negative":
      icon = <Frown className="h-4 w-4 text-red-500" />
      break
    default:
      icon = null
  }

  return (
    <div className="flex items-center pl-1 text-sm">
      {icon}
      <span className="ml-2">{data.description}</span>
      <span className="ml-2 text-muted-foreground">({data.total} reviews)</span>
    </div>
  )
}
