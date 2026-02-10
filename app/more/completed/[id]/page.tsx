import EditFromCompleted from "@/components/game/Completed/EditFromCompleted"
import DeleteGameButton from "@/components/game/DeleteGameButton"
import { Game } from "@/components/game/Game"
import MoveToLibrary from "@/components/game/Library/MoveToLibrary"
import MoveToWishlist from "@/components/game/Wishlist/MoveToWishlist"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { getCachedGameDetail } from "@/server/actions/lists"
import { GameCategory } from "@/types"
import { ArrowRight, Ellipsis, Pencil, Trash2 } from "lucide-react"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"

interface Props {
  params: Promise<{ id: string }>
}

export default async function CompletedGamePage({ params }: Props) {
  const [headersTest, paramsTest] = await Promise.all([headers(), params])
  const id = paramsTest.id
  const userId = headersTest.get("x-user-id")

  if (!id) notFound()
  if (!userId) redirect("/")

  const game = await getCachedGameDetail(id, userId)
  if (!game) notFound()

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" className="absolute right-5 top-3 z-40">
            <Ellipsis />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
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
        summary={game.igdbSummary || undefined}
        igdbId={game.igdbId!.toString()}
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
