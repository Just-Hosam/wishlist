"use server"

import { getNintendoGameInfo } from "@/server/platforms/nintendo"
import { PriceInput } from "@/types"
import { getPrice, savePrice } from "./price"
import { unstable_cache } from "next/cache"

export async function fetchNintendoPrice(
  url: string | null
): Promise<PriceInput> {
  try {
    if (!url) {
      throw new Error("URL is required")
    }

    // Basic URL validation for Nintendo store
    if (!url.includes("nintendo.com")) {
      throw new Error("Please provide a valid Nintendo store URL")
    }

    const cachedPrice = await getPrice(url)
    const gameInfo = await getNintendoGameInfo(url, cachedPrice?.externalId)

    if (!gameInfo) {
      throw new Error("Failed to fetch game information from Nintendo store")
    }

    // Save the price in the background without waiting
    savePrice(gameInfo).catch((error) => {
      console.error("Background save failed for Nintendo price:", error)
    })

    return gameInfo
  } catch (error) {
    console.error("Error fetching Nintendo game info:", error)

    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch game information"
    )
  }
}

export const getCachedNintendoPrice = async (
  url: string
): Promise<PriceInput> => {
  return unstable_cache(
    async () => {
      return await fetchNintendoPrice(url)
    },
    [url],
    {
      tags: [`nintendo-price-${url}`, "nintendo-prices", "prices"],
      revalidate: 24 * 60 * 60 // 24 hours
    }
  )()
}
