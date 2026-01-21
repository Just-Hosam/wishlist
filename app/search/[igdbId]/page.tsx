import AddToCompleted from "@/components/layout/Completed/AddToCompleted"
import { Game } from "@/components/layout/Game"
import AddToLibrary from "@/components/layout/Library/AddToLibrary"
import AddToWishlist from "@/components/layout/Wishlist/AddToWishlist"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { fetchTimeToBeat, getIGDBGameById } from "@/server/actions/igdb"
import { CheckCircle2, Heart, LibraryBig, Plus } from "lucide-react"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ igdbId: string }>
}

export default async function SearchGamePage({ params }: Props) {
  const { igdbId } = await params
  if (!igdbId) notFound()

  const [igdbGame, timeToBeat] = await Promise.all([
    getIGDBGameById(igdbId),
    fetchTimeToBeat(igdbId)
  ])

  if (!igdbGame) notFound()

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="absolute right-6 top-5 z-40">
            <Plus />
            Add to
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mr-4 w-fit md:mr-0">
          <div className="flex flex-col">
            <AddToWishlist
              igdbPlaystationUrlSegment={igdbGame.playstationUrlSegment || null}
              igdbNintendoUrlSegment={igdbGame.nintendoUrlSegment || null}
              igdbSteamUrlSegment={igdbGame.steamUrlSegment || null}
              timeToBeat={timeToBeat || null}
              igdbGame={igdbGame}
            >
              <Heart />
              Wishlist
            </AddToWishlist>

            <AddToLibrary timeToBeat={timeToBeat || null} igdbGame={igdbGame}>
              <LibraryBig />
              Library
            </AddToLibrary>

            <AddToCompleted timeToBeat={timeToBeat || null} igdbGame={igdbGame}>
              <CheckCircle2 />
              Completed
            </AddToCompleted>
          </div>
        </PopoverContent>
      </Popover>

      <Game
        imageId={igdbGame.coverImageId || ""}
        name={igdbGame.name || ""}
        length={timeToBeat || undefined}
        summary={igdbGame.summary || undefined}
        igdbPlaystationUrlSegment={igdbGame.playstationUrlSegment || undefined}
        igdbNintendoUrlSegment={igdbGame.nintendoUrlSegment || undefined}
        igdbSteamUrlSegment={igdbGame.steamUrlSegment || undefined}
        igdbFirstReleaseDate={igdbGame.firstReleaseDate || undefined}
        igdbScreenshotIds={igdbGame.screenshotImageIds}
        igdbVideoId={igdbGame.videoId || undefined}
      />
    </>
  )
}
