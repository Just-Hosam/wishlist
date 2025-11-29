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
import { GameCategory, Platform } from "@/types/game"
import { ArrowRight, Clock, EllipsisVertical, Pencil } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type ArchivedGame = {
  id: string
  name: string
  length: number | null
  category: GameCategory
  coverImageUrl: string | null
  platforms: Platform[] | null
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
            className="mx-[-24px] flex gap-4 px-[24px] pb-4 pt-2 duration-300 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "backwards"
            }}
          >
            {/* Cover Image */}
            {game.coverImageUrl && (
              <div className="h-[140px] w-[105px] flex-shrink-0 overflow-hidden rounded-xl bg-gray-200 shadow-lg dark:bg-gray-700">
                <Image
                  src={game.coverImageUrl}
                  alt={`${game.name} cover`}
                  width={105}
                  height={140}
                  className="h-full w-full object-cover"
                  priority={index < 5}
                />
              </div>
            )}

            {/* Main Content */}
            <div className="flex min-w-0 flex-1 flex-col">
              {/* Header with title and menu */}
              <header className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-1 line-clamp-2 text-lg font-medium text-gray-900">
                    {game.name}
                  </h3>
                  {game.length && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-normal text-gray-600">
                      <Clock
                        size={12}
                        strokeWidth={1.75}
                        className="mt-[-0.5px]"
                      />
                      {game?.length} hours
                    </p>
                  )}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mr-[-4px] mt-[-4px] self-start px-2"
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
                      <div className="mx-[-12px] my-2 rounded-full border-[0.5px]"></div>
                      <Link href={`/game/${game.id}/edit`}>
                        <Button
                          className="w-full justify-start"
                          variant="ghost"
                        >
                          <Pencil />
                          Edit
                        </Button>
                      </Link>
                      <DeleteGameButton gameId={game.id} />
                    </div>
                  </PopoverContent>
                </Popover>
              </header>

              {/* Platforms */}
              <div className="mt-auto flex gap-5 pb-1 pt-3 empty:pt-0">
                {game.platforms?.includes(Platform.NINTENDO) && (
                  <Image
                    src="/logos/nintendo-switch.svg"
                    alt="Nintendo Switch Logo"
                    width={25}
                    height={25}
                  />
                )}
                {game.platforms?.includes(Platform.PLAYSTATION) && (
                  <Image
                    src="/logos/playstation.svg"
                    alt="PlayStation Logo"
                    width={25}
                    height={25}
                  />
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </>
  )
}
