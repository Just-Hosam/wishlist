"use server"

import { authOptions } from "@/lib/auth-options"
import { getServerSession } from "next-auth"
import prisma from "@/lib/prisma"

export async function getSearchQueries(): Promise<string[]> {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return []

  const results = await prisma.searchHistory.findMany({
    where: { userId },
    orderBy: { searchedAt: "desc" },
    take: 5,
    select: { query: true }
  })

  return results.map((r) => r.query)
}

export async function saveSearchQuery(query: string) {
  const trimmed = query.trim()
  if (!trimmed) return

  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return

  await prisma.searchHistory.upsert({
    where: { userId_query: { userId, query: trimmed } },
    create: { userId, query: trimmed },
    update: { searchedAt: new Date() }
  })
}

export async function deleteSearchQuery(query: string) {
  const trimmed = query.trim()
  if (!trimmed) return

  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return

  await prisma.searchHistory.deleteMany({
    where: {
      // userId_query: { userId, query: trimmed }
      query: trimmed,
      userId
    }
  })
}
