import ListEmptyState from "@/components/layout/ListEmptyState"
import { ScrollToTopListener } from "@/components/layout/ScrollToTopListener"
import { getCachedLibraryGames } from "@/server/actions/lists"
import { Platform } from "@/types"
import { Clock, Layers, PlayCircle } from "lucide-react"
import { headers } from "next/headers"
import Image from "next/image"
import { Link } from "@/components/navigation"
import { redirect } from "next/navigation"

export default async function LibraryPage() {
  const userId = (await headers()).get("x-user-id")
  if (!userId) redirect("/")

  const libraryGames = await getCachedLibraryGames(userId)

  const nowPlayingGames = libraryGames.filter((game) => game.nowPlaying)
  const backlogGames = libraryGames.filter((game) => !game.nowPlaying)
  const hasNowPlaying = nowPlayingGames.length > 0
  const hasBacklog = backlogGames.length > 0

  if (!hasNowPlaying && !hasBacklog) {
    return <ListEmptyState />
  }

  return (
    <>
      <ScrollToTopListener />
      {hasNowPlaying && (
        <div className="custom-slide-fade-in relative">
          <div className="flex items-center gap-2 pb-4 font-semibold">
            <PlayCircle size={17} strokeWidth={2.5} /> Now Playing
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
            {nowPlayingGames.map((game, index) => (
              <LibraryGameCard game={game} index={index} key={game.id} />
            ))}
          </div>
        </div>
      )}
      {hasBacklog && (
        <>
          {hasNowPlaying && (
            <div className="custom-slide-fade-in mt-8 flex items-center gap-2 bg-background pb-4 font-semibold">
              <Layers size={17} strokeWidth={2.5} />
              Backlog
            </div>
          )}
          <div className="custom-slide-fade-in grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
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
    platforms: Platform[]
  }
  index: number
}

const LibraryGameCard = ({ game, index }: LibraryGameCardProps) => (
  <Link href={`/library/${game.id}`}>
    <div className="flex flex-col">
      {/* Cover Image - Takes ~half of vertical space */}
      <div className="relative mb-2 aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-200">
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

      <div className="px-1">
        <h3 className="line-clamp-2 text-sm font-medium leading-tight">
          {game.name}
        </h3>

        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground md:text-sm">
          <Clock size={11} />
          {game.length ? `${game.length} hours` : "-"}
        </p>

        {/* Platforms - Show unique platform icons */}
        {game.platforms && game.platforms.length > 0 && (
          <div className="mt-3 flex items-center gap-2">
            {game.platforms.includes(Platform.PC) && (
              <Image
                src="/logos/steam.svg"
                alt="Steam Logo"
                width={13}
                height={13}
              />
            )}
            {game.platforms.includes(Platform.PLAYSTATION) && (
              <Image
                src="/logos/playstation.svg"
                alt="PlayStation Logo"
                width={13}
                height={13}
              />
            )}
            {game.platforms.includes(Platform.NINTENDO) && (
              <Image
                src="/logos/nintendo-switch.svg"
                alt="Nintendo Switch Logo"
                width={13}
                height={13}
              />
            )}
            {game.platforms.includes(Platform.XBOX) && (
              <Image src="/logos/xbox.svg" alt="Xbox" width={13} height={13} />
            )}
          </div>
        )}
      </div>
    </div>
  </Link>
)
