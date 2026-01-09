import { buildSteamStoreUrl } from "@/lib/igdb-store-links"
import { fetchSteamGameInfo } from "@/server/actions/steam"
import PriceLayout from "./PriceLayout"

interface Props {
  igdbSteamUrlSegment: string | null
}

export default async function SteamPrice({ igdbSteamUrlSegment }: Props) {
  const url = buildSteamStoreUrl(igdbSteamUrlSegment || "")
  if (!url)
    return (
      <span className="text-sm text-muted-foreground">
        Not available on Steam
      </span>
    )

  if (!url.includes("store.steampowered.com")) {
    return (
      <span className="text-sm text-red-600">Invalid Steam Store Link</span>
    )
  }

  try {
    const info = await fetchSteamGameInfo(url)

    return (
      <PriceLayout
        onSale={(info.currentPrice || 0) < (info.regularPrice || 0)}
        currentPrice={info.currentPrice || 0}
        regularPrice={info.regularPrice || 0}
        currency="CAD"
      />
    )
  } catch (error) {
    console.error("Error fetching Steam game info:", error)
    return (
      <span className="text-sm text-red-600">
        Failed to fetch game information
      </span>
    )
  }
}
