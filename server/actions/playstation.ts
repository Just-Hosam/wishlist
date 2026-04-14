"use server"

import { getPlayStationGamePrice } from "@/server/platforms/playstation"
import { PriceInput } from "@/types"
import { getCachedPriceByUrl, setCachedPriceByUrl } from "@/server/cache/prices"
import { savePrice } from "./price"

export async function fetchPlayStationPrice(
  url: string | null
): Promise<PriceInput> {
  try {
    if (!url) {
      throw new Error("URL is required")
    }

    // Basic URL validation for PlayStation store
    if (
      !url.includes("playstation.com") &&
      !url.includes("store.playstation.com")
    ) {
      throw new Error("Please provide a valid PlayStation store URL")
    }

    const gameInfo = await getPlayStationGamePrice(url)

    if (!gameInfo) {
      throw new Error("Price not available")
    }

    try {
      await savePrice(gameInfo)
    } catch (error) {
      console.error("Error saving PlayStation game info:", error)
      throw new Error(
        `Failed to save game information: ${error instanceof Error ? error.message : String(error)}`
      )
    }

    return gameInfo
  } catch (error) {
    console.error("Error fetching PlayStation game info:", error)

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch game information"
    )
  }
}

export const getCachedPlaystationPrice = async (
  url: string
): Promise<PriceInput> => {
  const cachedPrice = await getCachedPriceByUrl(url)
  if (cachedPrice) return cachedPrice

  const latestPrice = await fetchPlayStationPrice(url)
  await setCachedPriceByUrl(latestPrice)
  return latestPrice
}
