import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { GameCategory, Platform } from "@prisma/client"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

interface Params {
  id: string
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
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

    // Check if game exists and belongs to the user
    const existingGame = await prisma.game.findFirst({
      where: {
        id,
        userId: user.id
      }
    })

    if (!existingGame) {
      return NextResponse.json(
        { error: "Game not found or you don't have permission to edit it" },
        { status: 404 }
      )
    }

    // Update the game
    const updatedGame = await prisma.game.update({
      where: { id },
      data: {
        name,
        length: length ? parseInt(length) : null,
        category: category || existingGame.category
      }
    })

    // Handle Nintendo price data
    if (nintendo && nintendo.nsuid) {
      // Check if a Nintendo price record already exists for this game
      const existingPrice = await prisma.gamePrice.findFirst({
        where: {
          gameId: id,
          platform: Platform.NINTENDO
        }
      })

      if (existingPrice) {
        // Update existing price record
        await prisma.gamePrice.update({
          where: { id: existingPrice.id },
          data: {
            externalId: nintendo.nsuid,
            countryCode: nintendo.countryCode || null,
            currencyCode: nintendo.currencyCode || null,
            regularPrice: nintendo.regularPrice || null,
            currentPrice:
              nintendo.currentPrice || nintendo.regularPrice || null,
            lastFetchedAt: new Date()
          }
        })
      } else {
        // Create new price record
        await prisma.gamePrice.create({
          data: {
            gameId: id,
            platform: Platform.NINTENDO,
            externalId: nintendo.nsuid,
            countryCode: nintendo.countryCode || null,
            currencyCode: nintendo.currencyCode || null,
            regularPrice: nintendo.regularPrice || null,
            currentPrice:
              nintendo.currentPrice || nintendo.regularPrice || null,
            lastFetchedAt: new Date()
          }
        })
      }
    }

    // Handle PlayStation price data
    if (playstation) {
      // Check if a PlayStation price record already exists for this game
      const existingPrice = await prisma.gamePrice.findFirst({
        where: {
          gameId: id,
          platform: Platform.PLAYSTATION
        }
      })

      if (existingPrice) {
        // Update existing price record
        await prisma.gamePrice.update({
          where: { id: existingPrice.id },
          data: {
            externalId: id, // Use game ID as external ID for PlayStation for now
            countryCode: playstation.countryCode || null,
            currencyCode: playstation.currencyCode || null,
            regularPrice: playstation.regularPrice || null,
            currentPrice:
              playstation.currentPrice || playstation.regularPrice || null,
            lastFetchedAt: new Date()
          }
        })
      } else {
        // Create new price record
        await prisma.gamePrice.create({
          data: {
            gameId: id,
            platform: Platform.PLAYSTATION,
            externalId: id, // Use game ID as external ID for PlayStation for now
            countryCode: playstation.countryCode || null,
            currencyCode: playstation.currencyCode || null,
            regularPrice: playstation.regularPrice || null,
            currentPrice:
              playstation.currentPrice || playstation.regularPrice || null,
            lastFetchedAt: new Date()
          }
        })
      }
    }

    return NextResponse.json(updatedGame, { status: 200 })
  } catch (error) {
    console.error("Error updating game:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if game exists and belongs to the user
    const existingGame = await prisma.game.findFirst({
      where: {
        id,
        userId: user.id
      }
    })

    if (!existingGame) {
      return NextResponse.json(
        { error: "Game not found or you don't have permission to delete it" },
        { status: 404 }
      )
    }

    // Delete the game
    await prisma.game.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: "Game deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting game:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
