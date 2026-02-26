"use server"

import { authOptions } from "@/lib/auth-options"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"
import { tryCatch } from "@/lib/utils"

export async function saveSearchQuery(query: string) {
  const trimmed = query.trim()
  if (!trimmed) return

  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return

  const { error } = await tryCatch(
    prisma.searchHistory.upsert({
      where: { userId_query: { userId, query: trimmed } },
      create: { userId, query: trimmed },
      update: { searchedAt: new Date() }
    })
  )

  if (error) console.error("Error saving search query:", error)
}

export async function deleteSearchQuery(query: string) {
  const trimmed = query.trim()
  if (!trimmed) return

  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return

  const { error } = await tryCatch(
    prisma.searchHistory.deleteMany({
      where: {
        query: trimmed,
        userId
      }
    })
  )

  if (error) console.error("Error deleting search query:", error)
}
