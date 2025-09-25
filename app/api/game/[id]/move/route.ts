import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { GameCategory } from "@prisma/client"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { gameId, toCategory } = await request.json()

    if (!gameId) {
      return NextResponse.json(
        { error: "Game ID is required" },
        { status: 400 }
      )
    }

    if (!Object.values(GameCategory).includes(toCategory)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const game = await prisma.game.findFirst({
      where: {
        id: gameId,
        userId: user.id
      }
    })

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 })
    }

    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        category: toCategory,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedGame)
  } catch (error) {
    console.error("Error moving game:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
