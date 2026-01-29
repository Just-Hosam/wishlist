"use server"

import { isPriceStale } from "@/lib/utils"
import { getSteamGameInfo } from "@/server/platforms/steam"
import { PriceInput } from "@/types"
import { getPrice, savePrice } from "./price"

export async function fetchSteamGameInfo(
  url: string | null
): Promise<PriceInput> {
  try {
    if (!url) {
      throw new Error("URL is required")
    }

    // Basic URL validation for Nintendo store
    if (!url.includes("store.steampowered.com")) {
      throw new Error("Please provide a valid Steam store URL")
    }

    const cachedPrice = await getPrice(url)
    const isStale = isPriceStale(cachedPrice)

    if (cachedPrice && !isStale) return cachedPrice

    const gameInfo = await getSteamGameInfo(url)

    if (!gameInfo) {
      throw new Error("Failed to fetch game information from Steam store")
    }

    // Save the price in the background without waiting
    savePrice(gameInfo).catch((error) => {
      console.error("Background save failed for Steam price:", error)
    })

    return gameInfo
  } catch (error) {
    console.error("Error fetching Steam game info:", error)

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch game information"
    )
  }
}
