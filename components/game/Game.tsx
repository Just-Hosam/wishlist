import {
  buildIGDBImageUrl,
  buildSteamStorePageUrl
} from "@/lib/igdb-store-links"
import { formatReleaseDate, tryCatch } from "@/lib/utils"
import { getCachedSteamReviews } from "@/server/actions/reviews"
import {
  getCachedBackloggdTimeToBeat,
  getCachedIGDBTimeToBeat
} from "@/server/actions/time-to-beat"
import { ExternalLink, LoaderCircle, Star } from "lucide-react"
import Image from "next/image"
import { Suspense } from "react"
import NintendoPrice from "../pricing/NintendoPrice"
import PlaystationPrice from "../pricing/PlaystationPrice"
import SteamPrice from "../pricing/SteamPrice"
import { Button } from "../ui/button"
import { ExpandableText } from "../ui/expandable-text"
import { Skeleton } from "../ui/skeleton"
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

  const hasVideos = igdbVideoIds && igdbVideoIds.length > 0
  const hasScreenshots = igdbScreenshotIds && igdbScreenshotIds.length > 0

  const isUpcoming = igdbFirstReleaseDate
    ? new Date(igdbFirstReleaseDate * 1000) > new Date()
    : false

  return (
    <div className="custom-slide-up-fade-in">
      <header className="mx-auto flex flex-col items-center text-center">
        <div className="mb-5 h-[253px] w-[190px] overflow-hidden rounded-3xl bg-gray-200 shadow-md">
          <Image
            src={buildIGDBImageUrl(imageId || "")}
            alt={name || "Game cover"}
            width={190}
            height={253}
            sizes="190px"
            priority
            fetchPriority="high"
          />
        </div>
        <h1 className="mb-1 line-clamp-2 max-w-[85%] text-2xl font-bold">
          {name}
        </h1>
        <div className="flex items-center text-sm text-muted-foreground">
          {igdbFirstReleaseDate && (
            <p>{formatReleaseDate(igdbFirstReleaseDate)}</p>
          )}
          {!isUpcoming && steamId && (
            <div className="ml-[10px] empty:hidden">
              <Suspense fallback={<Skeleton className="h-5 w-14" />}>
                <SteamReviews steamId={steamId} />
              </Suspense>
            </div>
          )}
        </div>
      </header>

      {/* PRICES */}
      <div className="mt-10 space-y-3 pl-2">
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

      {/* SUMMARY */}
      {summary && (
        <div className="mt-7 rounded-2xl border px-4 py-3">
          <ExpandableText
            text={summary}
            className="text-sm text-muted-foreground"
          />
        </div>
      )}

      {/* MEDIA */}
      {(hasVideos || hasScreenshots) && (
        <div className="mt-8 flex flex-col">
          <label className="mb-3 text-lg font-bold">Media</label>
          <div
            className="hide-scrollbar -mx-4 snap-x snap-mandatory overflow-x-auto scroll-smooth"
            data-scroll-restore-id="media"
            tabIndex={0}
            role="region"
            aria-label="media"
          >
            <div className="flex">
              {hasVideos &&
                igdbVideoIds.map((videoId, index) => {
                  if (index >= 3) return null
                  return (
                    <div
                      key={videoId}
                      // 356px = 348px (image) + 8px (2x 4px horizontal padding)
                      // 368px = 348px (image) + 4px (horizontal padding) + 16px (first or last element, 16px)
                      className="w-[95%] max-w-[356px] shrink-0 snap-center px-1 first:max-w-[368px] first:pl-4 last:max-w-[368px] last:pr-4"
                    >
                      <YoutubeVideo
                        videoId={videoId}
                        width={348}
                        height={196}
                      />
                    </div>
                  )
                })}
              {hasScreenshots &&
                igdbScreenshotIds.map((screenshotId, index) => {
                  if (index >= 6) return null
                  return (
                    <div
                      key={screenshotId}
                      // 356px = 348px (image) + 8px (2x 4px horizontal padding)
                      // 368px = 348px (image) + 4px (horizontal padding) + 16px (first or last element, 16px)
                      className="w-[95%] max-w-[356px] shrink-0 snap-center px-1 first:max-w-[368px] first:pl-4 last:max-w-[368px] last:pr-4"
                    >
                      <Image
                        src={buildIGDBImageUrl(screenshotId || "")}
                        alt={name || "Game cover"}
                        width={348}
                        height={196}
                        className="overflow-hidden rounded-2xl"
                        unoptimized
                      />
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      )}

      {/* TIME TO BEAT */}
      {!isUpcoming && (
        <div className="mt-8">
          <label className="mb-3 block text-lg font-bold">Time to Beat</label>
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
      )}

      {/* MISC */}
      {!isUpcoming && name && (
        <div className="mt-8 flex flex-col">
          <label className="mb-3 text-lg font-bold">External</label>
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

  if (error) {
    console.error("Error fetching Steam reviews:", error)
    return null
  }

  const starRatio =
    Math.round((Math.abs(data.positive / data.total) * 100) / 2) / 10

  if (Number.isNaN(starRatio)) {
    console.error("Error calculating Steam star ratio:", data)
    return null
  }

  const storeUrl = buildSteamStorePageUrl(steamId) || ""

  return (
    <div className="flex items-center text-sm">
      <span className="mr-2 font-bold">•</span>
      <a
        href={storeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center text-sm hover:opacity-90"
      >
        <Star className="mr-1 h-4 w-4 fill-[#fbc113] text-[#fbc113]" />
        <span>{starRatio}</span>
      </a>
    </div>
  )
}
