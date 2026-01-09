import MoveToCompleted from "@/components/layout/Completed/MoveToCompleted"
import DeleteGameButton from "@/components/layout/DeleteGameButton"
import { Game } from "@/components/layout/Game"
import MoveToLibrary from "@/components/layout/Library/MoveToLibrary"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import prisma from "@/lib/prisma"
import { ArrowRight, EllipsisVertical, Pencil, Trash2 } from "lucide-react"
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
    <>
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
            <MoveToLibrary game={game}>
              <ArrowRight />
              To Library
            </MoveToLibrary>
            <MoveToCompleted game={game}>
              <ArrowRight />
              To Completed
            </MoveToCompleted>
            <div className="mx-[-12px] my-2 rounded-full border-[0.5px]"></div>
            <Link href={`/game/${game.id}/edit`}>
              <Button className="w-full justify-start" variant="ghost">
                <Pencil />
                Edit
              </Button>
            </Link>
            <DeleteGameButton gameId={game.id}>
              <Button
                className="justify-start text-destructive"
                variant="ghost"
              >
                <Trash2 />
                Delete
              </Button>
            </DeleteGameButton>
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
        igdbSteamUrlSegment={game.igdbSteamUrlSegment || undefined}
      />
    </>
  )
}
