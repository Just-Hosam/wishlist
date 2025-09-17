import prisma from "@/lib/prisma"
import { Clock } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default async function Game({ params }: Props) {
  const { id } = await params
  const game = await prisma?.game.findUnique({ where: { id } })

  return (
    <header>
      <h2 className="text-3xl font-semibold">{game?.name}</h2>
      {game?.length && (
        <div className="flex gap-1 text-gray-600 text-sm items-center mt-2">
          <Clock size={14} /> {game?.length} hours
        </div>
      )}
    </header>
  )
}
