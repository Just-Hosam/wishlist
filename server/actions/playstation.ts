"use server"

import { getPlayStationGamePrice } from "@/server/platforms/playstation"
import { PriceInput } from "@/types"
import { unstable_cache } from "next/cache"
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
      throw new Error("Failed to fetch game information from PlayStation store")
    }

    // Save the price in the background without waiting
    savePrice(gameInfo).catch((error) => {
      console.error("Background save failed for PlayStation price:", error)
    })

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
  return unstable_cache(
    async () => {
      return await fetchPlayStationPrice(url)
    },
    [url],
    {
      tags: [`playstation-price-${url}`, "playstation-prices", "prices"],
      revalidate: 24 * 60 * 60 // 24 hours
    }
  )()
}
