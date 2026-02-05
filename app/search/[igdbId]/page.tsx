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
import {
  fetchTimeToBeat,
  getCachedSearchIGDBGamesDirect
} from "@/server/actions/igdb"
import { CheckCircle2, Heart, LibraryBig, Plus } from "lucide-react"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ igdbId: string }>
  searchParams: Promise<{ q: string }>
}

export default async function SearchGamePage({ params, searchParams }: Props) {
  const [{ igdbId }, { q: query }] = await Promise.all([params, searchParams])

  if (!igdbId || !query) notFound()

  const games = await getCachedSearchIGDBGamesDirect(query)
  const igdbGame = games.find((game) => String(game.igdbId) === igdbId)
  const timeToBeat = await fetchTimeToBeat(igdbId)

  if (!igdbGame) notFound()

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="lg" className="absolute right-5 top-3 z-40">
            <Plus />
            Add to
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mr-3 w-fit">
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
        igdbVideoIds={igdbGame.videoIds}
      />
    </>
  )
}
