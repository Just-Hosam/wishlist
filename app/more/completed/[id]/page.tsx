import EditFromCompleted from "@/components/layout/Completed/EditFromCompleted"
import DeleteGameButton from "@/components/layout/DeleteGameButton"
import { Game } from "@/components/layout/Game"
import MoveToLibrary from "@/components/layout/Library/MoveToLibrary"
import MoveToWishlist from "@/components/layout/Wishlist/MoveToWishlist"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import prisma from "@/lib/prisma"
import { ArrowRight, Ellipsis, Pencil, Trash2 } from "lucide-react"
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
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className="absolute right-5 top-3 z-40"
          >
            <Ellipsis />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mr-3 w-fit">
          <div className="flex flex-col">
            <MoveToWishlist
              igdbPlaystationUrlSegment={game.igdbPlaystationUrlSegment || null}
              igdbNintendoUrlSegment={game.igdbNintendoUrlSegment || null}
              igdbSteamUrlSegment={game.igdbSteamUrlSegment || null}
              game={game}
            >
              <ArrowRight />
              To Wishlist
            </MoveToWishlist>
            <MoveToLibrary game={game}>
              <ArrowRight />
              To Library
            </MoveToLibrary>
            <div className="-mx-3 my-2 rounded-full border-[0.5px]"></div>
            <EditFromCompleted game={game}>
              <Pencil />
              Edit
            </EditFromCompleted>
            <DeleteGameButton gameId={game.id} navigateTo="/more/completed">
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
        igdbFirstReleaseDate={game.igdbFirstReleaseDate || undefined}
        igdbScreenshotIds={game.igdbScreenshotIds}
        igdbVideoIds={game.igdbVideoIds}
      />
    </>
  )
}
