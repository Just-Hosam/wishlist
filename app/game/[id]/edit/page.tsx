import GameForm from "@/components/layout/GameForm"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditGame({ params }: Props) {
  const { id } = await params

  // Fetch the game data
  const game = await prisma.game.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      length: true,
      category: true
    }
  })

  if (!game) {
    notFound()
  }

  return <GameForm game={game} isEdit={true} />
}
