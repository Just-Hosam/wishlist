import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { GameCategory } from "@prisma/client"

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

    // Check if game exists and belongs to the user
    const existingGame = await prisma.game.findFirst({
      where: {
        id,
        userId: user.id,
      },
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
        category: category || existingGame.category,
      },
    })

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
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if game exists and belongs to the user
    const existingGame = await prisma.game.findFirst({
      where: {
        id,
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
      where: { id },
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
