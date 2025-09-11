import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { GameCategory } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, coverImageUrl, length, category } = body

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
      where: { email: session.user.email },
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
        userId: user.id,
      },
    })

    return NextResponse.json(game, { status: 201 })
  } catch (error) {
    console.error("Error creating game:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get game ID from query parameters
    const { searchParams } = new URL(request.url)
    const gameId = searchParams.get("id")

    if (!gameId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      )
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if game exists and belongs to the user
    const existingGame = await prisma.game.findFirst({
      where: {
        id: gameId,
        userId: user.id,
      },
    })

    if (!existingGame) {
      return NextResponse.json(
        { error: "Game not found or you don't have permission to delete it" },
        { status: 404 }
      )
    }

    // Delete the game
    await prisma.game.delete({
      where: {
        id: gameId,
      },
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
