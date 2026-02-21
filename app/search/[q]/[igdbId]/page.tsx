import AddToCompleted from "@/components/game/Completed/AddToCompleted"
import { Game } from "@/components/game/Game"
import AddToLibrary from "@/components/game/Library/AddToLibrary"
import AddToWishlist from "@/components/game/Wishlist/AddToWishlist"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { decodePathSegment } from "@/lib/path"
import { getCachedSearchIGDBGamesDirect } from "@/server/actions/igdb"
import { CheckCircle2, Heart, LibraryBig, Plus } from "lucide-react"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ q: string; igdbId: string }>
}

export default async function SearchGamePage({ params }: Props) {
  const { q, igdbId } = await params
  const query = decodePathSegment(q)

  if (!igdbId || !query) notFound()

  const games = await getCachedSearchIGDBGamesDirect(query)
  const igdbGame = games.find((game) => String(game.igdbId) === igdbId)

  if (!igdbGame) notFound()

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            size="lg"
            variant="accent"
            className="absolute right-5 top-4 z-40"
          >
            <Plus />
            Add
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-fit">
          <div className="flex flex-col">
            <AddToWishlist
              igdbPlaystationUrlSegment={igdbGame.playstationUrlSegment || null}
              igdbNintendoUrlSegment={igdbGame.nintendoUrlSegment || null}
              igdbSteamUrlSegment={igdbGame.steamUrlSegment || null}
              igdbGame={igdbGame}
              redirectTo="/wishlist"
            >
              <Heart />
              Wishlist
            </AddToWishlist>

            <AddToLibrary redirectTo="/library" igdbGame={igdbGame}>
              <LibraryBig />
              Library
            </AddToLibrary>

            <AddToCompleted redirectTo="/more/completed" igdbGame={igdbGame}>
              <CheckCircle2 />
              Completed
            </AddToCompleted>
          </div>
        </PopoverContent>
      </Popover>

      <Game
        imageId={igdbGame.coverImageId || ""}
        name={igdbGame.name || ""}
        summary={igdbGame.summary || undefined}
        igdbId={igdbGame.igdbId!.toString()}
        igdbSlug={igdbGame.slug || ""}
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
