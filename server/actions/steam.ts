"use server"

import { getSteamGameInfo } from "@/server/platforms/steam"
import { PriceInput } from "@/types"
import { unstable_cache } from "next/cache"
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

export const getCachedSteamPrice = async (url: string): Promise<PriceInput> => {
  return unstable_cache(
    async () => {
      return await fetchSteamPrice(url)
    },
    [url],
    {
      tags: [`steam-price-${url}`, "steam-prices", "prices"],
      revalidate: 24 * 60 * 60 // 24 hours
    }
  )()
}
