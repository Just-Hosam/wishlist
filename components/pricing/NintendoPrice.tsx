import { buildNintendoStoreUrl } from "@/lib/igdb-store-links"
import { getCachedNintendoPrice } from "@/server/actions/nintendo"
import PriceLayout from "./PriceLayout"

export default async function NintendoPrice({
  igdbNintendoUrlSegment
}: {
  igdbNintendoUrlSegment: string | null
}) {
  const url = buildNintendoStoreUrl(igdbNintendoUrlSegment || "")
  if (!url)
    return (
      <span className="text-sm text-muted-foreground">
        Not available on Nintendo
      </span>
    )

  if (!url.includes("nintendo.com")) {
    return (
      <span className="text-sm text-red-600">Invalid Nintendo Store Link</span>
    )
  }

  try {
    const info = await getCachedNintendoPrice(url)

    return (
      <PriceLayout
        onSale={(info.currentPrice || 0) < (info.regularPrice || 0)}
        currentPrice={info.currentPrice || 0}
        regularPrice={info.regularPrice || 0}
        currency="CAD"
      />
    )
  } catch (error) {
    console.error("Error fetching Nintendo game info:", error)
    return (
      <span className="text-sm text-red-600">
        Failed to fetch game information
      </span>
    )
  }
}
