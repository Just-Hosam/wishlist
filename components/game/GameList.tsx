import { Link } from "@/components/navigation"
import { formatReleaseDate } from "@/lib/utils"
import { Platform } from "@/types"
import { Clock } from "lucide-react"
import Image from "next/image"

interface Props {
  showLength?: boolean
  showDate?: boolean
  showPlatforms?: boolean

  baseHref: string

  games: {
    id: string
    name: string
    coverImageUrl: string | null
    releaseDate?: number | null
    length?: number | null
    platforms?: Platform[] | null
  }[]
}

export default async function GameList({
  games,
  baseHref,
  showLength = false,
  showDate = false,
  showPlatforms = false
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
      {games.map((game, index) => (
        <Link href={`${baseHref}/${game.id}`} key={game.id}>
          <div className="flex flex-col">
            {/* Cover Image - Takes ~half of vertical space */}
            <div className="relative mb-2 aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-200 shadow-md">
              {game.coverImageUrl && (
                <Image
                  src={game.coverImageUrl}
                  alt={`${game.name} cover`}
                  fill
                  className="object-cover"
                  priority={index < 6}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              )}
            </div>

            <div className="px-1">
              <h3 className="line-clamp-2 text-sm font-medium leading-tight">
                {game.name}
              </h3>

              {showDate && game.releaseDate && (
                <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                  {formatReleaseDate(game.releaseDate)}
                </p>
              )}

              {showLength && (
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground md:text-sm">
                  <Clock size={11} />
                  {game.length ? `${game.length} hours` : "-"}
                </p>
              )}

              {showPlatforms && game.platforms && game.platforms.length > 0 && (
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
                    <Image
                      src="/logos/xbox.svg"
                      alt="Xbox"
                      width={13}
                      height={13}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
