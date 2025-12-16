"use server"

import { getNintendoGameInfo } from "@/lib/nintendo-price"
import { PriceInput } from "@/types"
import { getPrice, savePrice } from "./price"

export async function fetchNintendoGameInfo(url: string): Promise<PriceInput> {
  try {
    if (!url) {
      throw new Error("URL is required")
    }

    // Basic URL validation for Nintendo store
    if (!url.includes("nintendo.com")) {
      throw new Error("Please provide a valid Nintendo store URL")
    }

    const cachedPrice = await getPrice(url)
    if (cachedPrice) return cachedPrice

    const gameInfo = await getNintendoGameInfo(url)

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
