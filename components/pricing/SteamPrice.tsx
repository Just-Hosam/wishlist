import {
  buildSteamStorePageUrl,
  buildSteamStoreUrl
} from "@/lib/igdb-store-links"
import { getCachedSteamPrice } from "@/server/actions/steam"
import PriceLayout from "./PriceLayout"

interface Props {
  igdbSteamUrlSegment: string | null
}

export default async function SteamPrice({ igdbSteamUrlSegment }: Props) {
  const storeUrl = buildSteamStorePageUrl(igdbSteamUrlSegment || "")
  const apiUrl = buildSteamStoreUrl(igdbSteamUrlSegment || "")
  if (!storeUrl || !apiUrl)
    return (
      <span className="text-sm text-muted-foreground">
        Not available on Steam
      </span>
    )

  if (!apiUrl.includes("store.steampowered.com")) {
    return (
      <span className="text-sm text-red-600">Invalid Steam Store Link</span>
    )
  }

  try {
    const info = await getCachedSteamPrice(apiUrl)

    return (
      <a
        href={storeUrl}
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
    console.error("Error fetching Steam game info:", error)
    return (
      <span className="text-sm text-red-600">
        Failed to fetch game information
      </span>
    )
  }
}
