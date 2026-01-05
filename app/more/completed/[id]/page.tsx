import DeleteGameButton from "@/components/layout/DeleteGameButton"
import { Game } from "@/components/layout/Game"
import MoveToLibrary from "@/components/layout/Library/MoveToLibrary"
import MoveGameButton from "@/components/layout/MoveGameButton"
import MoveToWishlist from "@/components/layout/Wishlist/MoveToWishlist"
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

export default async function CompletedGamePage({ params }: Props) {
  const { id } = await params
  if (!id) notFound()

  const game = await prisma.game.findUnique({ where: { id } })
  if (!game) notFound()

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="absolute right-6 top-5 z-40">
            <EllipsisVertical />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mr-4 w-fit md:mr-0">
          <div className="flex flex-col">
            <MoveToWishlist
              igdbPlaystationUrlSegment={game.igdbPlaystationUrlSegment || null}
              igdbNintendoUrlSegment={game.igdbNintendoUrlSegment || null}
              gameId={game.id}
            >
              <ArrowRight />
              To Wishlist
            </MoveToWishlist>
            <MoveToLibrary game={game}>
              <ArrowRight />
              To Library
            </MoveToLibrary>
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
