import { buildIGDBImageUrl } from "@/lib/igdb-store-links"
import { formatReleaseDate } from "@/lib/utils"
import { Clock, Loader2 } from "lucide-react"
import Image from "next/image"
import { Suspense } from "react"
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel"
import { ExpandableText } from "../ui/expandable-text"
import NintendoPrice from "./NintendoPrice"
import PlaystationPrice from "./PlaystationPrice"
import SteamPrice from "./SteamPrice"

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
  igdbScreenshotIds
}: Props) {
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
          <span className="font-bold">•</span>
          <div className="flex items-center gap-1">
            <Clock size={12} className="mt-[-0.5px]" />
            <span>{length ? `${length} hours` : "-"}</span>
          </div>
        </div>
      </header>

      <div className="mt-8">
        <label className="font-medium">Prices</label>
        <div className="mt-3 space-y-3">
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

      <div className="mt-6">
        <label className="font-medium">Summary</label>
        <ExpandableText
          text={summary || ""}
          className="mt-2 text-sm text-muted-foreground"
        />
      </div>

      {igdbScreenshotIds && (
        <div className="mt-6 flex flex-col">
          <label className="mb-3 font-medium">Screenshots</label>
          <Carousel
            opts={{
              align: "start"
            }}
          >
            <CarouselContent>
              {igdbScreenshotIds.map((id, index) => {
                if (index >= 6) return null
                return (
                  <CarouselItem
                    key={id}
                    className="max-h-[180px] max-w-[336px] basis-[90%]"
                  >
                    <Image
                      src={buildIGDBImageUrl(id || "")}
                      alt={name || "Game cover"}
                      width={320}
                      height={180}
                      sizes="(max-width: 640px) 90vw, (max-width: 1024px) 60vw, 320px"
                      className="overflow-hidden rounded-xl"
                    />
                  </CarouselItem>
                )
              })}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </div>
  )
}
