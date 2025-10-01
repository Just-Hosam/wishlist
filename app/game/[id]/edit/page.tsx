import GameForm from "@/components/layout/GameForm"
import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { notFound, redirect } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditGame({ params }: Props) {
  const session = await getServerSession(authOptions)
  const isNotAuthenticated = !session?.user

  if (isNotAuthenticated) redirect("/")

  const { id } = await params

  // Fetch the game data with platform prices
  const gameData = await prisma.game.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      length: true,
      category: true,
      prices: {
        select: {
          platform: true,
          externalId: true,
          storeUrl: true,
          countryCode: true,
          currencyCode: true,
          regularPrice: true,
          currentPrice: true
        }
      }
    }
  })

  if (!gameData) {
    notFound()
  }

  // Convert Decimal values to numbers for serialization
  const game = {
    ...gameData,
    prices: gameData.prices.map((price) => ({
      ...price,
      storeUrl: price.storeUrl,
      regularPrice: price.regularPrice ? Number(price.regularPrice) : null,
      currentPrice: price.currentPrice ? Number(price.currentPrice) : null
    }))
  }

  return <GameForm game={game} isEdit={true} />
}
