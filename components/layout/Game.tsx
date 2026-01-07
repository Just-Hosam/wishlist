import { buildIGDBImageUrl } from "@/lib/igdb-store-links"
import { fetchTimeToBeat } from "@/server/actions/igdb"
import { Clock, Loader2 } from "lucide-react"
import Image from "next/image"
import { Suspense } from "react"
import { Skeleton } from "../ui/skeleton"
import NintendoPrice from "./NintendoPrice"
import PlaystationPrice from "./PlaystationPrice"

interface Props {
  imageId: string
  name: string
  length?: number
  summary?: string
  igdbPlaystationUrlSegment?: string
  igdbNintendoUrlSegment?: string
  igdbId?: string | null
}

export function Game({
  imageId,
  name,
  length,
  summary,
  igdbPlaystationUrlSegment,
  igdbNintendoUrlSegment,
  igdbId
}: Props) {
  return (
    <div className="slide-fade-in">
      <header className="mx-auto flex flex-col items-center text-center">
        <div className="mb-5 h-[233px] w-[175px] overflow-hidden rounded-3xl bg-gray-200">
          <Image
            src={buildIGDBImageUrl(imageId || "", "1080p")}
            alt={name || "Game cover"}
            width={175}
            height={233}
          />
        </div>
        <h1 className="text-2xl font-medium">{name}</h1>
        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <Clock size={12} strokeWidth={1.75} className="mt-[-0.5px]" />
          <Suspense fallback={<Skeleton className="h-5 w-16" />}>
            <TimeToBeat length={length || null} igdbId={igdbId || null} />
          </Suspense>
        </div>
      </header>

      <div className="mt-8">
        <label className="font-medium">Prices</label>
        <div className="mt-3 space-y-3">
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

async function TimeToBeat({
  length,
  igdbId
}: {
  length: number | null
  igdbId: string | null
}) {
  if (length) return <span>{length} hours</span>

  if (!igdbId) return <span>-</span>

  const timeToBeat = await fetchTimeToBeat(igdbId)
  if (!timeToBeat) return <span>-</span>

  return <span>{timeToBeat} hours</span>
}
