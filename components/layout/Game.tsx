import { Clock } from "lucide-react"
import Image from "next/image"
import PlayStationLinkInput from "./PlayStationLinkInput"
import {
  buildIGDBImageUrl,
  buildNintendoStoreUrl,
  buildPlayStationStoreUrl
} from "@/lib/igdb-store-links"
import NintendoLinkInput from "./NintendoLinkInput"
import { Suspense } from "react"
import { fetchTimeToBeat } from "@/server/actions/igdb"
import { Skeleton } from "../ui/skeleton"

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
    <div>
      <header className="mx-auto flex flex-col items-center text-center">
        <div className="mb-5 h-[213px] w-[160px] overflow-hidden rounded-2xl bg-gray-200 shadow-xl">
          <Image
            src={buildIGDBImageUrl(imageId || "", "1080p")}
            alt={name || "Game cover"}
            width={160}
            height={213}
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
          <PlayStationLinkInput
            url={buildPlayStationStoreUrl(igdbPlaystationUrlSegment || "")}
            onLinked={null}
            isInitiallyLinked={!!igdbPlaystationUrlSegment}
            hideSwitch
          />

          <NintendoLinkInput
            url={
              igdbNintendoUrlSegment
                ? buildNintendoStoreUrl(igdbNintendoUrlSegment)
                : ""
            }
            onLinked={null}
            isInitiallyLinked={!!igdbNintendoUrlSegment}
            hideSwitch
          />
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
