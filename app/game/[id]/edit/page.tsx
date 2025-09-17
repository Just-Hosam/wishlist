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
    <>
      <div className="flex items-center gap-2 mb-4">
        <BackButton />
        <h3 className="text-lg font-medium">Edit Game</h3>
      </div>
      <GameForm game={game} isEdit={true} />
    </>
  )
}
