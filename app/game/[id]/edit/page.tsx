import GameForm from "@/components/layout/GameForm"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditGame({ params }: Props) {
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
      regularPrice: price.regularPrice ? Number(price.regularPrice) : null,
      currentPrice: price.currentPrice ? Number(price.currentPrice) : null
    }))
  }

  return <GameForm game={game} isEdit={true} />
}
