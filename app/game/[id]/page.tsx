import { Button } from "@/components/ui/button"
import {
  buildIGDBImageUrl,
  buildNintendoStoreUrl,
  buildPlayStationStoreUrl
} from "@/lib/igdb-store-links"
import Image from "next/image"
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { ArrowRight, Clock, EllipsisVertical, Menu, Pencil } from "lucide-react"
import NintendoLinkInput from "@/components/layout/NintendoLinkInput"
import PlayStationLinkInput from "@/components/layout/PlayStationLinkInput"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import MoveGameButton from "@/components/layout/MoveGameButton"
import Link from "next/link"
import DeleteGameButton from "@/components/layout/DeleteGameButton"
import { GameCategory } from "@/types"

interface Props {
  params: Promise<{ id: string }>
}

export default async function GamePage({ params }: Props) {
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

      <header className="mx-auto flex flex-col items-center gap-2 text-center">
        <div className="mb-3 h-[320px] w-[240px] overflow-hidden rounded-xl bg-gray-200 shadow-lg">
          <Image
            src={buildIGDBImageUrl(game.igdbCoverImageId || "", "1080p")}
            alt={game.igdbName || "Game cover"}
            width={240}
            height={320}
          />
        </div>
        <h1 className="w-3/4 text-3xl font-medium">{game.igdbName}</h1>
        <p className="flex items-center gap-1 font-normal text-muted-foreground">
          <Clock size={15} strokeWidth={1.75} className="mt-[-0.5px]" />
          {game?.length ? `${game?.length} hours` : "-"}
        </p>
      </header>

      <div
        className="mt-4"
        style={{ animationDelay: "150ms", animationFillMode: "backwards" }}
      >
        <label className="font-medium" htmlFor="Prices">
          Prices
        </label>

        <div className="mt-3 space-y-3">
          <PlayStationLinkInput
            url={buildPlayStationStoreUrl(
              game?.igdbPlaystationUrlSegment || ""
            )}
            onLinked={null}
            isInitiallyLinked={!!game.igdbPlaystationUrlSegment}
            hideSwitch
          />

          <NintendoLinkInput
            url={
              game.igdbNintendoUrlSegment
                ? buildNintendoStoreUrl(game.igdbNintendoUrlSegment)
                : ""
            }
            onLinked={null}
            isInitiallyLinked={!!game.igdbNintendoUrlSegment}
            hideSwitch
          />
        </div>
      </div>
    </div>
  )
}
