import { BackButton } from "@/components/layout/BackButton"
import DeleteGameButton from "@/components/layout/DeleteGameButton"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import prisma from "@/lib/prisma"
import { Clock, EllipsisVertical, Pencil } from "lucide-react"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

export default async function Game({ params }: Props) {
  const { id } = await params
  const game = await prisma?.game.findUnique({ where: { id } })

  return (
    <div>
      <div className="sticky top-[88px] flex items-center justify-between gap-4 bg-white pb-4">
        <BackButton />
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <EllipsisVertical />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="mr-6 w-fit md:mr-0">
              <div className="flex flex-col">
                <Link href={`/game/${id}/edit`}>
                  <Button className="w-full justify-start" variant="ghost">
                    <Pencil />
                    Edit
                  </Button>
                </Link>
                <DeleteGameButton gameId={id} />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <header>
        <h2 className="text-3xl font-semibold">{game?.name}</h2>
        {game?.length && (
          <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
            <Clock size={14} /> {game?.length} hours
          </div>
        )}
      </header>
    </div>
  )
}
