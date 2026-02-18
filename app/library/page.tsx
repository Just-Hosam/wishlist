import ListEmptyState from "@/components/game/ListEmptyState"
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

  if (!hasNowPlaying && !hasBacklog) return <ListEmptyState />

  return (
    <>
      {hasNowPlaying && (
        <div className="custom-slide-up-fade-in mb-7">
          <h2 className="mt-1 text-lg font-bold">Now Playing</h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Games you're playing right now.
          </p>
          <div
            className="hide-scrollbar -mx-4 snap-x snap-mandatory overflow-x-auto scroll-smooth"
            tabIndex={0}
            role="region"
            aria-label="Now Playing Games"
          >
            <div className="flex">
              {nowPlayingGames.map((game, index) => (
                <NowPlayingCard game={game} index={index} key={game.id} />
              ))}
            </div>
          </div>
        </div>
      )}
      {hasBacklog && (
        <div className="custom-slide-up-fade-in">
          {hasNowPlaying && (
            <>
              <h2 className="text-lg font-bold">Backlog</h2>
              <p className="mb-4 text-xs text-muted-foreground">
                Games you own.
              </p>
            </>
          )}
          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
            {backlogGames.map((game, index) => (
              <LibraryGameCard game={game} index={index} key={game.id} />
            ))}
          </div>
        </div>
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

const NowPlayingCard = ({ game, index }: LibraryGameCardProps) => (
  <div className="w-[162px] shrink-0 snap-start pl-4 last:w-[178px] last:pr-4">
    <Link href={`/library/${game.id}`}>
      <div className="relative mb-2 w-full overflow-hidden rounded-xl bg-gray-200 shadow-md">
        {game.coverImageUrl && (
          <Image
            src={game.coverImageUrl}
            alt={`${game.name} cover`}
            className="object-cover"
            priority={index < 8}
            width={150}
            height={200}
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
    </Link>
  </div>
)

const LibraryGameCard = ({ game, index }: LibraryGameCardProps) => (
  <Link href={`/library/${game.id}`}>
    <div className="flex flex-col">
      {/* Cover Image - Takes ~half of vertical space */}
      <div className="relative mb-2 aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-200 shadow-md">
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
