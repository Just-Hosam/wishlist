"use server"

import { getPlayStationGamePrice } from "@/lib/playstation/playstation-price"

export async function fetchPlayStationGameInfo(url: string) {
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
