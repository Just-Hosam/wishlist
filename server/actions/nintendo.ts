"use server"

import { getNintendoGameInfo } from "@/lib/nintendo-price"

export async function fetchNintendoGameInfo(url: string) {
  try {
    if (!url) {
      throw new Error("URL is required")
    }

    // Basic URL validation for Nintendo store
    if (!url.includes("nintendo.com")) {
      throw new Error("Please provide a valid Nintendo store URL")
    }

    const gameInfo = await getNintendoGameInfo(url)

    if (!gameInfo) {
      throw new Error("Failed to fetch game information from Nintendo store")
    }

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
