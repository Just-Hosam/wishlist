import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return NextResponse.json([])

  const results = await prisma.searchHistory.findMany({
    where: { userId },
    orderBy: { searchedAt: "desc" },
    take: 10,
    select: { query: true }
  })

  return NextResponse.json(results.map((r) => r.query))
}
