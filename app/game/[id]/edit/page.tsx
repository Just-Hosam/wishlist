import { BackButton } from "@/components/layout/BackButton"
import GameForm from "@/components/GameForm"
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
      category: true,
    },
  })

  if (!game) {
    notFound()
  }

  return (
    <div>
      <BackButton className="mb-4" />
      <h1 className="text-2xl font-semibold mb-6">Edit Game</h1>
      <GameForm game={game} isEdit={true} />
    </div>
  )
}
