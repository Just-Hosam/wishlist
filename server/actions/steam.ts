"use server"

import { getSteamGameInfo } from "@/server/platforms/steam"
import { PriceInput } from "@/types"
import { getCachedPriceByUrl, setCachedPriceByUrl } from "@/server/cache/prices"
import { savePrice } from "./price"

export async function fetchSteamPrice(url: string | null): Promise<PriceInput> {
  try {
    if (!url) {
      throw new Error("URL is required")
    }

    // Basic URL validation for Nintendo store
    if (!url.includes("store.steampowered.com")) {
      throw new Error("Please provide a valid Steam store URL")
    }

    const gameInfo = await getSteamGameInfo(url)

    if (!gameInfo) throw new Error("Price not available")

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

export const getCachedSteamPrice = async (url: string): Promise<PriceInput> => {
  const cachedPrice = await getCachedPriceByUrl(url)
  if (cachedPrice) return cachedPrice

  const latestPrice = await fetchSteamPrice(url)
  await setCachedPriceByUrl(latestPrice)
  return latestPrice
}
