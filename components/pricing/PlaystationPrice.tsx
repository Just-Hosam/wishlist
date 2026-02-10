import { buildPlayStationStoreUrl } from "@/lib/igdb-store-links"
import { fetchPlayStationGameInfo } from "@/server/actions/playstation"
import PriceLayout from "./PriceLayout"

interface Props {
  igdbPlaystationUrlSegment: string | null
}

export default async function PlaystationPrice({
  igdbPlaystationUrlSegment
}: Props) {
  const url = buildPlayStationStoreUrl(igdbPlaystationUrlSegment || "")
  if (!url)
    return (
      <span className="text-sm text-muted-foreground">
        Not available on Playstation
      </span>
    )

  if (
    !url.includes("playstation.com") &&
    !url.includes("store.playstation.com")
  ) {
    return <span className="text-sm text-red-600">Invalid PS Store Link</span>
  }

  try {
    const info = await fetchPlayStationGameInfo(url)

    return (
      <PriceLayout
        onSale={(info.currentPrice || 0) < (info.regularPrice || 0)}
        currentPrice={info.currentPrice || 0}
        regularPrice={info.regularPrice || 0}
        currency="CAD"
      />
    )
  } catch (error) {
    console.error("Error fetching PlayStation game info:", error)
    return (
      <span className="text-sm text-red-600">
        Failed to fetch game information
      </span>
    )
  }
}
