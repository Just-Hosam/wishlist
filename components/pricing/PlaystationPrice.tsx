import { buildPlayStationStoreUrl } from "@/lib/igdb-store-links"
import { getCachedPlaystationPrice } from "@/server/actions/playstation"
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
    const info = await getCachedPlaystationPrice(url)

    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-90"
      >
        <PriceLayout
          onSale={(info.currentPrice || 0) < (info.regularPrice || 0)}
          currentPrice={info.currentPrice || 0}
          regularPrice={info.regularPrice || 0}
          currency="CAD"
        />
      </a>
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
