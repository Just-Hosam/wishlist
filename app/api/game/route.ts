import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { GameCategory, Platform } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, length, category, nintendo, playstation } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Game name is required" },
        { status: 400 }
      )
    }

    // Validate category
    if (category && !Object.values(GameCategory).includes(category)) {
      return NextResponse.json(
        { error: "Invalid game category" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create the game
    const game = await prisma.game.create({
      data: {
        name,
        length: length ? parseInt(length) : null,
        category: category || GameCategory.WISHLIST,
        userId: user.id
      }
    })

    // If Nintendo data is provided, create a GamePrice record
    if (nintendo && nintendo.nsuid) {
      await prisma.gamePrice.create({
        data: {
          gameId: game.id,
          platform: Platform.NINTENDO,
          externalId: nintendo.nsuid,
          countryCode: nintendo.countryCode || null,
          currencyCode: nintendo.currencyCode || null,
          regularPrice: nintendo.regularPrice || null,
          currentPrice: nintendo.currentPrice || nintendo.regularPrice || null,
          lastFetchedAt: new Date()
        }
      })
    }

    // If PlayStation data is provided, create a GamePrice record
    if (playstation) {
      await prisma.gamePrice.create({
        data: {
          gameId: game.id,
          platform: Platform.PLAYSTATION,
          externalId: game.id, // Use game ID as external ID for PlayStation for now
          countryCode: playstation.countryCode || null,
          currencyCode: playstation.currencyCode || null,
          regularPrice: playstation.regularPrice || null,
          currentPrice:
            playstation.currentPrice || playstation.regularPrice || null,
          lastFetchedAt: new Date()
        }
      })
    }

    return NextResponse.json(game, { status: 201 })
  } catch (error) {
    console.error("Error creating game:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
