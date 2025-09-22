import { NextRequest, NextResponse } from "next/server"
import { getNintendoGameInfo } from "@/lib/nintendo-price"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Basic URL validation for Nintendo store
    if (!url.includes("nintendo.com")) {
      return NextResponse.json(
        { error: "Please provide a valid Nintendo store URL" },
        { status: 400 }
      )
    }

    const gameInfo = await getNintendoGameInfo(url)

    if (!gameInfo) {
      return NextResponse.json(
        { error: "Failed to fetch game information from Nintendo store" },
        { status: 404 }
      )
    }

    return NextResponse.json(gameInfo)
  } catch (error) {
    console.error("Error fetching Nintendo game info:", error)

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch game information"
      },
      { status: 500 }
    )
  }
}
