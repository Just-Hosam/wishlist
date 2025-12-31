import { Game } from "@/components/layout/Game"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { fetchTimeToBeat, getIGDBGameById } from "@/server/actions/igdb"
import { Plus } from "lucide-react"
import { notFound } from "next/navigation"

interface Props {
  params: Promise<{ igdbId: string }>
}

export default async function SearchGamePage({ params }: Props) {
  const { igdbId } = await params
  if (!igdbId) notFound()

  const igdbGame = await getIGDBGameById(parseInt(igdbId))
  if (!igdbGame) notFound()

  const timeToBeat = await fetchTimeToBeat(igdbId)

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button className="absolute right-6 top-5 z-40">Add Game</Button>
        </PopoverTrigger>
        <PopoverContent className="mr-6 w-fit md:mr-0">
          <div className="flex flex-col">
            <Button className="w-full justify-start" variant="ghost">
              <Plus />
              To Wishlist
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <Plus />
              To Library
            </Button>
            <Button className="w-full justify-start" variant="ghost">
              <Plus />
              To Completed
            </Button>
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
      />
    </div>
  )
}
