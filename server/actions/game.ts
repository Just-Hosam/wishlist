"use server"

import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { GameCategory } from "@prisma/client"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

export async function deleteGame(id: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    throw new Error("Unauthorized.")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    throw new Error("User not found.")
  }

  const game = await prisma.game.findFirst({
    where: {
      id,
      userId: user.id
    }
  })

  if (!game) {
    throw new Error("Game not found.")
  }

  await prisma.game.delete({
    where: {
      id: game.id
    }
  })

  if (game.category === GameCategory.WISHLIST) {
    revalidatePath("/(lists)/wishlist")
  }
  if (game.category === GameCategory.OWNED) {
    revalidatePath("/(lists)/owned")
  }
  if (game.category === GameCategory.COMPLETED) {
    revalidatePath("/(lists)/completed")
  }
  if (game.category === GameCategory.GRAVEYARD) {
    revalidatePath("/(lists)/graveyard")
  }
}
