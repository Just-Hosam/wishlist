import { buildIGDBImageUrl } from "@/lib/igdb-store-links"
import { formatReleaseDate } from "@/lib/utils"
import { Clock, ExternalLink, Loader2 } from "lucide-react"
import Image from "next/image"
import { Suspense } from "react"
import { Button } from "../ui/button"
import { ExpandableText } from "../ui/expandable-text"
import NintendoPrice from "./NintendoPrice"
import PlaystationPrice from "./PlaystationPrice"
import SteamPrice from "./SteamPrice"
import { YoutubeVideo } from "./YoutubeVideo"

interface Props {
  imageId: string
  name: string
  length?: number
  summary?: string
  igdbId?: string | null
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
  length,
  summary,
  igdbId,
  igdbPlaystationUrlSegment,
  igdbNintendoUrlSegment,
  igdbSteamUrlSegment,
  igdbFirstReleaseDate,
  igdbScreenshotIds,
  igdbVideoIds
}: Props) {
  const youtubeReviewSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " review")}`
  const hltbSearchUrl = `https://howlongtobeat.com/?q=${encodeURIComponent(name)}`

  const isUpcoming = igdbFirstReleaseDate
    ? igdbFirstReleaseDate * 1000 > Date.now()
    : false

  return (
    <div className="custom-slide-fade-in">
      <header className="mx-auto flex flex-col items-center text-center">
        <div className="mb-5 h-[233px] w-[175px] overflow-hidden rounded-3xl bg-gray-200">
          <Image
            src={buildIGDBImageUrl(imageId || "")}
            alt={name || "Game cover"}
            width={175}
            height={233}
            sizes="175px"
          />
        </div>
        <h1 className="mb-1 text-2xl font-bold">{name}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {igdbFirstReleaseDate && (
            <p>{formatReleaseDate(igdbFirstReleaseDate)}</p>
          )}
          {!isUpcoming && (
            <>
              <span className="font-bold">•</span>
              <div className="flex items-center gap-1">
                <Clock size={12} className="mt-[-0.5px]" />
                <span>{length ? `${length} hours` : "-"}</span>
              </div>
            </>
          )}
        </div>
      </header>

      {/* PRICES */}
      <div className="mt-8">
        <label className="font-medium">Prices</label>
        <div className="mt-3 space-y-3 pl-1">
          <div className="flex items-center">
            <Image
              src="/logos/steam.svg"
              alt="Steam Logo"
              width={20}
              height={20}
              className="mr-3"
            />
            <Suspense
              fallback={
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
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
            />
            <Suspense
              fallback={
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
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
            />
            <Suspense
              fallback={
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
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
          <label className="font-medium">Summary</label>
          <ExpandableText
            text={summary}
            className="mt-2 text-sm text-muted-foreground"
          />
        </div>
      )}

      {/* SCREENSHOTS */}
      {igdbScreenshotIds && (
        <div className="mt-8 flex flex-col">
          <label className="mb-4 font-medium">Screenshots</label>
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
          <label className="mb-4 font-medium">Videos</label>
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
                    <YoutubeVideo videoId={videoId} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* MISC */}
      {name && (
        <div className="mt-8 flex flex-col">
          <label className="mb-4 font-medium">Miscellaneous</label>
          <a
            href={youtubeReviewSearchUrl}
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
                  src="/logos/youtube.svg"
                  alt="YouTube logo"
                  width={22}
                  height={22}
                  className="drop-shadow-2xl"
                />
                <span className="font-semibold">Reviews on Youtube</span>
              </div>
              <ExternalLink size={16} className="text-muted-foreground" />
            </Button>
          </a>
          <a
            href={hltbSearchUrl}
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
                  src="/logos/hltb.png"
                  alt="YouTube logo"
                  width={20}
                  height={20}
                  className="rounded-sm drop-shadow-2xl"
                />
                <span className="font-semibold">HLTB Time to Beat</span>
              </div>
              <ExternalLink size={16} className="text-muted-foreground" />
            </Button>
          </a>
        </div>
      )}
    </div>
  )
}
