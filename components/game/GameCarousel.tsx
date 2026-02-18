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

export default function GameCarousel({
  games,
  baseHref,
  showLength = false,
  showDate = false,
  showPlatforms = false
}: Props) {
  return (
    <div
      className="hide-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto scroll-smooth px-4"
      tabIndex={0}
      role="region"
      aria-label="Game Carousel"
    >
      {games.map((game, index) => (
        <div className="w-[166px] shrink-0 snap-start pl-4" key={game.id}>
          <Link href={`${baseHref}/${game.id}`}>
            <div className="relative mb-2 w-full overflow-hidden rounded-xl bg-gray-200 shadow-md">
              {game.coverImageUrl && (
                <Image
                  src={game.coverImageUrl}
                  alt={`${game.name} cover`}
                  className="object-cover"
                  priority={index < 4}
                  width={150}
                  height={200}
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

              {/* Platforms - Show unique platform icons */}
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
          </Link>
        </div>
      ))}
    </div>
  )
}
