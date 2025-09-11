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
      <div className="pb-4 flex items-center justify-between gap-4 sticky bg-white top-[88px]">
        <BackButton />
        <div className="flex gap-2 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <EllipsisVertical />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit mr-6 md:mr-0">
              <div className="flex flex-col">
                <Link href={`/game/edit/${id}`}>
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
          <div className="flex gap-1 text-gray-600 text-sm items-center mt-2">
            <Clock size={14} /> {game?.length} hours
          </div>
        )}
      </header>
    </div>
  )
}
