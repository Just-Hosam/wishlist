import DeleteGameButton from "@/components/layout/DeleteGameButton"
import ListEmptyState from "@/components/layout/ListEmptyState"
import MoveGameButton from "@/components/layout/MoveGameButton"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/user"
import { Game, GameCategory, Platform } from "@prisma/client"
import {
  ArrowRight,
  Clock,
  EllipsisVertical,
  Layers,
  Pencil,
  PlayCircle
} from "lucide-react"
import { unstable_cache } from "next/cache"
import Image from "next/image"
import Link from "next/link"

interface LibraryGame {
  id: string
  name: string
  length: number | null
  category: GameCategory
  platforms: Platform[] | null
  nowPlaying: boolean
  createdAt: string
  updatedAt: string
}

const getCachedLibraryGames = (userId: string) =>
  unstable_cache(
    async (): Promise<LibraryGame[][]> => {
      const games = await prisma.game.findMany({
        where: {
          userId,
          category: GameCategory.LIBRARY
        },
        orderBy: [{ nowPlaying: "desc" }, { updatedAt: "desc" }]
      })

      const libraryGames = games.map(
        (game: Game): LibraryGame => ({
          id: game.id,
          name: game.name,
          length: game.length,
          category: game.category,
          platforms: game.platforms,
          nowPlaying: game.nowPlaying,
          createdAt: game.createdAt.toISOString(),
          updatedAt: game.updatedAt.toISOString()
        })
      )

      const nowPlayingGames = libraryGames.filter((game) => game.nowPlaying)
      const backlogGames = libraryGames.filter((game) => !game.nowPlaying)

      return [nowPlayingGames, backlogGames]
    },
    [userId],
    {
      tags: ["user-library-games"],
      revalidate: 1800 // 30 minutes
    }
  )

export default async function Library() {
  const userId = await getUserId()
  const [nowPlayingGames, backlogGames] = await getCachedLibraryGames(userId)()
  const hasNowPlaying = nowPlayingGames.length > 0
  const hasBacklog = backlogGames.length > 0

  if (!hasNowPlaying && !hasBacklog) {
    return <ListEmptyState />
  }

  return (
    <>
      {hasNowPlaying && (
        <>
          <div className="flex items-center gap-[6px] pb-4 pt-1 text-sm font-medium">
            <PlayCircle size={16} /> Now Playing
          </div>
          {nowPlayingGames.map((game: LibraryGame, index: number) => (
            <LibraryGameCard game={game} index={index} key={game.id} />
          ))}
        </>
      )}
      {hasBacklog && (
        <>
          {hasNowPlaying && (
            <div className="flex items-center gap-[6px] pb-4 pt-2 text-sm font-medium">
              <Layers size={16} />
              Backlog
            </div>
          )}
          {backlogGames.map((game: LibraryGame, index: number) => (
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
    className="mb-4 overflow-hidden rounded-3xl border px-6 py-5 duration-500 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
    style={{
      animationDelay: `${index * 100}ms`,
      animationFillMode: "backwards"
    }}
  >
    <header className="flex items-center justify-between gap-4">
      <div className="flex-1 text-xl font-medium">
        <h3>{game.name}</h3>
        {game.length && (
          <p className="mt-1 flex items-center gap-1 text-xs font-normal text-gray-600">
            <Clock size={14} /> {game?.length} hours
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

    <div className="mt-6 flex gap-5 empty:hidden">
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
)
