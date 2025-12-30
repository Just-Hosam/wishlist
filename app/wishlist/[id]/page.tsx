import DeleteGameButton from "@/components/layout/DeleteGameButton"
import { Game } from "@/components/layout/Game"
import MoveGameButton from "@/components/layout/MoveGameButton"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import prisma from "@/lib/prisma"
import { GameCategory } from "@/types"
import { ArrowRight, EllipsisVertical, Pencil } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function WishlistGamePage({ params }: Props) {
  const { id } = await params
  if (!id) notFound()

  const game = await prisma.game.findUnique({
    where: { id }
  })

  if (!game) notFound()

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-6 top-5 z-40"
          >
            <EllipsisVertical />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mr-4 w-fit md:mr-0">
          <div className="flex flex-col">
            <MoveGameButton
              gameId={game.id}
              fromCategory={GameCategory.WISHLIST}
              toCategory={GameCategory.LIBRARY}
              buttonText="To Library"
              icon={<ArrowRight />}
            />
            <MoveGameButton
              gameId={game.id}
              fromCategory={GameCategory.WISHLIST}
              toCategory={GameCategory.COMPLETED}
              buttonText="To Completed"
              icon={<ArrowRight />}
            />
            <div className="mx-[-12px] my-2 rounded-full border-[0.5px]"></div>
            <Link href={`/game/${game.id}/edit`}>
              <Button className="w-full justify-start" variant="ghost">
                <Pencil />
                Edit
              </Button>
            </Link>
            <DeleteGameButton gameId={game.id} />
          </div>
        </PopoverContent>
      </Popover>

      <Game
        imageId={game.igdbCoverImageId || ""}
        name={game.igdbName || ""}
        length={game.length || undefined}
        summary={game.igdbSummary || undefined}
        igdbPlaystationUrlSegment={game.igdbPlaystationUrlSegment || undefined}
        igdbNintendoUrlSegment={game.igdbNintendoUrlSegment || undefined}
      />
    </div>
  )
}
