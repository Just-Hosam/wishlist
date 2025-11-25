"use client"

import DeleteGameButton from "@/components/layout/DeleteGameButton"
import ListEmptyState from "@/components/layout/ListEmptyState"
import MoveGameButton from "@/components/layout/MoveGameButton"
import ToggleNowPlayingButton from "@/components/layout/ToggleNowPlayingButton"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { GameCategory, Platform } from "@/types/game"
import {
  ArrowRight,
  Clock,
  EllipsisVertical,
  Layers,
  Pencil,
  PlayCircle
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type LibraryGame = {
  id: string
  name: string
  length: number | null
  category: GameCategory
  coverImageUrl: string | null
  platforms: Platform[] | null
  nowPlaying: boolean
  createdAt: string
  updatedAt: string
}

interface LibraryListProps {
  games: LibraryGame[]
}

export default function LibraryList({ games }: LibraryListProps) {
  const nowPlayingGames = games.filter((game) => game.nowPlaying)
  const backlogGames = games.filter((game) => !game.nowPlaying)
  const hasNowPlaying = nowPlayingGames.length > 0
  const hasBacklog = backlogGames.length > 0

  if (!hasNowPlaying && !hasBacklog) {
    return <ListEmptyState />
  }

  return (
    <>
      {hasNowPlaying && (
        <>
          <div className="flex items-center gap-2 pb-3 pt-1 font-medium">
            <PlayCircle size={17} /> Now Playing
          </div>
          {nowPlayingGames.map((game, index) => (
            <LibraryGameCard game={game} index={index} key={game.id} />
          ))}
        </>
      )}
      {hasBacklog && (
        <>
          {hasNowPlaying && (
            <div className="mt-1 flex items-center gap-2 pb-3 pt-2 font-medium">
              <Layers size={17} />
              Backlog
            </div>
          )}
          {backlogGames.map((game, index) => (
            <LibraryGameCard game={game} index={index} key={game.id} />
          ))}
        </>
      )}
    </>
  )
}

interface LibraryGameCardProps {
  game: LibraryGame
  index: number
}

const LibraryGameCard = ({ game, index }: LibraryGameCardProps) => (
  <div
    className="mx-[-24px] flex gap-4 px-[24px] pb-6 pt-1 duration-300 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
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
              <Clock size={12} strokeWidth={1.75} className="mt-[-0.5px]" />
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
              <ToggleNowPlayingButton
                gameId={game.id}
                nowPlaying={game.nowPlaying}
              />
              <div className="mx-[-12px] my-2 rounded-full border-[0.5px]"></div>
              <MoveGameButton
                gameId={game.id}
                fromCategory={GameCategory.LIBRARY}
                toCategory={GameCategory.WISHLIST}
                buttonText="To Wishlist"
                icon={<ArrowRight />}
              />
              <MoveGameButton
                gameId={game.id}
                fromCategory={GameCategory.LIBRARY}
                toCategory={GameCategory.COMPLETED}
                buttonText="To Completed"
                icon={<ArrowRight />}
              />
              <MoveGameButton
                gameId={game.id}
                fromCategory={GameCategory.LIBRARY}
                toCategory={GameCategory.ARCHIVED}
                buttonText="To Archived"
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
)
