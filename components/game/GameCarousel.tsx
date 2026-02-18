import { Link } from "@/components/navigation"
import { Platform } from "@/types"
import { Clock } from "lucide-react"
import Image from "next/image"

interface Props {
  games: {
    id: string
    name: string
    length: number | null
    coverImageUrl: string | null
    platforms?: Platform[]
  }[]
}

export default async function GameCarousel({ games }: Props) {
  return (
    <div
      className="hide-scrollbar w-[calc(100% + 32px)] -mx-4 snap-x snap-mandatory overflow-x-auto scroll-smooth"
      tabIndex={0}
      role="region"
      aria-label="Now Playing Games"
    >
      <div className="flex">
        {games.map((game, index) => (
          <div
            className="w-[150px] shrink-0 snap-start pl-4 last:w-[166px] last:pr-4"
            key={game.id}
          >
            <Link href={`/library/${game.id}`}>
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
    </div>
  )
}
