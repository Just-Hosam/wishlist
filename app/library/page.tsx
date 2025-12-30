import ListEmptyState from "@/components/layout/ListEmptyState"
import { authOptions } from "@/lib/auth-options"
import { getCachedLibraryGames } from "@/server/actions/lists"
import { Clock, Layers, PlayCircle } from "lucide-react"
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
  <Link href={`/library/${game.id}`}>
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

      <div className="pl-1 pr-2">
        <h3 className="line-clamp-2 font-semibold leading-tight text-gray-900 md:text-lg">
          {game.name}
        </h3>

        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground md:text-sm">
          <Clock size={11} />
          {game.length ? `${game.length} hours` : "-"}
        </p>
      </div>
    </div>
  </Link>
)
