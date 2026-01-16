import MoveToCompleted from "@/components/layout/Completed/MoveToCompleted"
import DeleteGameButton from "@/components/layout/DeleteGameButton"
import { Game } from "@/components/layout/Game"
import EditFromLibrary from "@/components/layout/Library/EditFromLibrary"
import ToggleNowPlayingButton from "@/components/layout/ToggleNowPlayingButton"
import MoveToWishlist from "@/components/layout/Wishlist/MoveToWishlist"
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

  const game = await prisma.game.findUnique({ where: { id } })
  if (!game) notFound()

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="absolute right-6 top-5 z-40">
            <EllipsisVertical />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mr-4 w-fit md:mr-0">
          <div className="flex flex-col">
            <ToggleNowPlayingButton
              gameId={game.id}
              nowPlaying={game.nowPlaying}
            />
            <div className="-mx-3 my-2 rounded-full border-[0.5px]"></div>
            <MoveToWishlist
              igdbPlaystationUrlSegment={game.igdbPlaystationUrlSegment || null}
              igdbNintendoUrlSegment={game.igdbNintendoUrlSegment || null}
              igdbSteamUrlSegment={game.igdbSteamUrlSegment || null}
              game={game}
            >
              <ArrowRight />
              To Wishlist
            </MoveToWishlist>
            <MoveToCompleted game={game}>
              <ArrowRight />
              To Completed
            </MoveToCompleted>
            <div className="-mx-3 my-2 rounded-full border-[0.5px]"></div>
            <EditFromLibrary game={game}>
              <Pencil />
              Edit
            </EditFromLibrary>
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
