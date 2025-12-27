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
import { authOptions } from "@/lib/auth-options"
import { getCachedLibraryGames } from "@/server/actions/lists"
import { GameCategory } from "@/types"
import {
  ArrowRight,
  Clock,
  EllipsisVertical,
  Layers,
  Pencil,
  PlayCircle
} from "lucide-react"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function LibraryPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/")

  const libraryGames = await getCachedLibraryGames(session.user.id)

  const nowPlayingGames = libraryGames.filter((game) => game.nowPlaying)
  const backlogGames = libraryGames.filter((game) => !game.nowPlaying)
  const hasNowPlaying = nowPlayingGames.length > 0
  const hasBacklog = backlogGames.length > 0

  if (!hasNowPlaying && !hasBacklog) {
    return <ListEmptyState />
  }

  return (
    <>
      {hasNowPlaying && (
        <>
          <div className="flex items-center gap-2 pb-4 pt-1 text-xl font-medium">
            <PlayCircle size={21} /> Now Playing
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
            {nowPlayingGames.map((game, index) => (
              <LibraryGameCard game={game} index={index} key={game.id} />
            ))}
          </div>
        </>
      )}
      {hasBacklog && (
        <>
          {hasNowPlaying && (
            <div className="mt-6 flex items-center gap-2 pb-4 pt-2 text-xl font-medium">
              <Layers size={21} />
              Backlog
            </div>
          )}
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
            {backlogGames.map((game, index) => (
              <LibraryGameCard game={game} index={index} key={game.id} />
            ))}
          </div>
        </>
      )}
    </>
  )
}

interface LibraryGameCardProps {
  game: {
    id: string
    name: string
    length: number | null
    coverImageUrl: string | null
    nowPlaying: boolean
  }
  index: number
}

const LibraryGameCard = ({ game, index }: LibraryGameCardProps) => (
  <div
    className="flex flex-col duration-300 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
    style={{
      animationDelay: `${index * 50}ms`,
      animationFillMode: "backwards"
    }}
  >
    {/* Cover Image - Takes ~half of vertical space */}
    <div className="relative mb-3 aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-200 shadow-md">
      {game.coverImageUrl && (
        <Image
          src={game.coverImageUrl}
          alt={`${game.name} cover`}
          fill
          className="object-cover"
          priority={index < 8}
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      )}
    </div>

    {/* Game Info Section */}
    <div className="flex flex-1 flex-col px-1">
      {/* Title, Length, and Menu Container */}
      <div className="flex gap-2">
        <div className="flex-1">
          {/* Game Name */}
          <h3 className="line-clamp-2 text-sm font-medium leading-tight text-gray-900 md:text-lg">
            {game.name}
          </h3>

          {/* Game Length */}
          {game.length && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground md:text-sm">
              <Clock size={10} className="flex-shrink-0" />
              {game.length} hours
            </p>
          )}
        </div>

        {/* Menu */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="-mr-1 -mt-[2px] h-6 w-6 flex-shrink-0 p-0"
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
      </div>
    </div>
  </div>
)
