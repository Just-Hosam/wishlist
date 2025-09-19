import { NextRequest, NextResponse } from "next/server"
import { getPlayStationGamePrice } from "@/lib/playstation-price"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    // Basic URL validation for PlayStation store
    if (
      !url.includes("playstation.com") &&
      !url.includes("store.playstation.com")
    ) {
      return NextResponse.json(
        { error: "Please provide a valid PlayStation store URL" },
        { status: 400 }
      )
    }

    const gameInfo = await getPlayStationGamePrice(url)

    if (!gameInfo) {
      return NextResponse.json(
        { error: "Failed to fetch game information from PlayStation store" },
        { status: 404 }
      )
    }

    return NextResponse.json(gameInfo)
  } catch (error) {
    console.error("Error fetching PlayStation game info:", error)

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
