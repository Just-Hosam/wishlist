"use client"

import DeleteGameButton from "@/components/layout/DeleteGameButton"
import ListEmptyState from "@/components/layout/ListEmptyState"
import MoveGameButton from "@/components/layout/MoveGameButton"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { GameCategory } from "@prisma/client"
import { ArrowRight, Clock, EllipsisVertical, Pencil } from "lucide-react"
import Link from "next/link"

type ArchivedGame = {
  id: string
  name: string
  length: number | null
  category: GameCategory
  createdAt: string
  updatedAt: string
}

interface ArchivedListProps {
  games: ArchivedGame[]
}

export default function ArchivedList({ games }: ArchivedListProps) {
  return (
    <>
      {games.length === 0 ? (
        <ListEmptyState />
      ) : (
        games.map((game, index) => (
          <div
            key={game.id}
            className="mb-4 rounded-3xl border px-6 py-5 duration-300 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "backwards"
            }}
          >
            <header className="flex items-center justify-between gap-4">
              <div className="flex-1 text-xl font-medium">
                <h3>{game.name}</h3>
                {game.length && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-normal text-gray-600">
                    <Clock size={12} /> {game?.length} hours
                  </p>
                )}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mr-[-4px] self-start px-2"
                  >
                    <EllipsisVertical />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="mr-4 w-fit md:mr-0">
                  <div className="flex flex-col">
                    <MoveGameButton
                      gameId={game.id}
                      fromCategory={GameCategory.ARCHIVED}
                      toCategory={GameCategory.WISHLIST}
                      buttonText="To Wishlist"
                      icon={<ArrowRight />}
                    />
                    <MoveGameButton
                      gameId={game.id}
                      fromCategory={GameCategory.ARCHIVED}
                      toCategory={GameCategory.LIBRARY}
                      buttonText="To Library"
                      icon={<ArrowRight />}
                    />
                    <MoveGameButton
                      gameId={game.id}
                      fromCategory={GameCategory.ARCHIVED}
                      toCategory={GameCategory.COMPLETED}
                      buttonText="To Completed"
                      icon={<ArrowRight />}
                    />
                    <div className="my-2 rounded-full border-[0.5px]"></div>
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
            </header>
          </div>
        ))
      )}
    </>
  )
}
