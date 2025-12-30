import { Clock } from "lucide-react"
import Image from "next/image"
import PlayStationLinkInput from "./PlayStationLinkInput"
import {
  buildIGDBImageUrl,
  buildNintendoStoreUrl,
  buildPlayStationStoreUrl
} from "@/lib/igdb-store-links"
import NintendoLinkInput from "./NintendoLinkInput"

interface Props {
  imageId: string
  name: string
  length?: number
  summary?: string
  igdbPlaystationUrlSegment?: string
  igdbNintendoUrlSegment?: string
}

export function Game({
  imageId,
  name,
  length,
  summary,
  igdbPlaystationUrlSegment,
  igdbNintendoUrlSegment
}: Props) {
  return (
    <div>
      <header className="mx-auto flex flex-col items-center text-center">
        <div className="mb-5 h-[240px] w-[180px] overflow-hidden rounded-2xl bg-gray-200 shadow-lg">
          <Image
            src={buildIGDBImageUrl(imageId || "", "1080p")}
            alt={name || "Game cover"}
            width={180}
            height={240}
          />
        </div>
        <h1 className="text-2xl font-medium">{name}</h1>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <Clock size={12} strokeWidth={1.75} className="mt-[-0.5px]" />
          {length ? `${length} hours` : "-"}
        </p>
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
