import { BackButton } from "@/components/layout/BackButton"
import prisma from "@/lib/prisma"

interface Props {
  params: Promise<{ id: string }>
}

export default async function Event({ params }: Props) {
  const { id } = await params
  const game = await prisma?.game.findUnique({ where: { id } })

  return (
    <div>
      <BackButton className="mb-4" />
      <div>{game?.name}</div>
      <div>about {game?.length} hours</div>
    </div>
  )
}
