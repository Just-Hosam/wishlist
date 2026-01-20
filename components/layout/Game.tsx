import { buildIGDBImageUrl } from "@/lib/igdb-store-links"
import { fetchTimeToBeat } from "@/server/actions/igdb"
import { Clock, Loader2 } from "lucide-react"
import Image from "next/image"
import { Suspense } from "react"
import { Skeleton } from "../ui/skeleton"
import NintendoPrice from "./NintendoPrice"
import PlaystationPrice from "./PlaystationPrice"
import SteamPrice from "./SteamPrice"
import { formatReleaseDate } from "@/lib/utils"
import { Separator } from "../ui/separator"

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
  igdbFirstReleaseDate
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
          />
        </div>
        <h1 className="mb-1 text-2xl font-bold">{name}</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock size={12} strokeWidth={1.85} className="mt-[-0.5px]" />
            <span>{length ? `${length} hours` : "-"}</span>
          </div>
          <span className="font-bold">•</span>
          {igdbFirstReleaseDate && (
            <p>{formatReleaseDate(igdbFirstReleaseDate)}</p>
          )}
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
        <p className="mt-2 text-sm text-muted-foreground">{summary}</p>
      </div>
    </div>
  )
}
