import AddToCompleted from "@/components/game/Completed/AddToCompleted"
import AddToLibrary from "@/components/game/Library/AddToLibrary"
import AddToWishlist from "@/components/game/Wishlist/AddToWishlist"
import { Link } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { decodePathSegment, encodePathSegment } from "@/lib/path"
import { buildIGDBImageUrl } from "@/lib/igdb-store-links"
import { tryCatch } from "@/lib/try-catch"
import { formatReleaseDate } from "@/lib/utils"
import { getCachedSearchIGDBGamesDirect } from "@/server/actions/igdb"
import { Platform } from "@/types"
import { CheckCircle2, Heart, LibraryBig, Plus, Search } from "lucide-react"
import Image from "next/image"

interface Props {
  params: Promise<{ q: string }>
}

export default async function SearchResultsPage({ params }: Props) {
  const { q } = await params
  const query = decodePathSegment(q)

  const { data: results, error } = await tryCatch(
    getCachedSearchIGDBGamesDirect(query)
  )

  if (error) {
    return (
      <div className="custom-slide-up-fade-in flex flex-col items-center justify-center pt-20 text-center">
        <Search className="mb-4 h-16 w-16 text-gray-300" />
        <h2 className="mb-2 text-xl font-semibold text-destructive">
          Something went wrong
        </h2>
        <p className="text-sm text-gray-500">Try searching again</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="custom-slide-up-fade-in flex flex-col items-center justify-center pt-20 text-center">
        <Search className="mb-4 h-16 w-16 text-gray-300" />
        <h2 className="mb-2 text-xl font-semibold text-gray-700">
          No games found
        </h2>
        <p className="text-sm text-gray-500">
          Try a different search term for "{query}"
        </p>
      </div>
    )
  }

  return (
    <div className="custom-slide-up-fade-in grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
      {results.map((game, index) => (
        <div className="relative" key={game.id}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                className="absolute right-2 top-2 z-10 size-8"
              >
                <Plus />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <div className="flex flex-col">
                <AddToWishlist
                  igdbPlaystationUrlSegment={game.playstationUrlSegment || null}
                  igdbNintendoUrlSegment={game.nintendoUrlSegment || null}
                  igdbSteamUrlSegment={game.steamUrlSegment || null}
                  igdbGame={game}
                >
                  <Heart />
                  Wishlist
                </AddToWishlist>

                <AddToLibrary igdbGame={game}>
                  <LibraryBig />
                  Library
                </AddToLibrary>

                <AddToCompleted igdbGame={game}>
                  <CheckCircle2 />
                  Completed
                </AddToCompleted>
              </div>
            </PopoverContent>
          </Popover>

          <Link
            href={`/search/${encodePathSegment(query)}/${game.igdbId}`}
            passHref
          >
            <div className="flex cursor-pointer flex-col">
              <div className="relative mb-2 aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-200 shadow-md">
                {game.coverImageId ? (
                  <Image
                    src={buildIGDBImageUrl(game.coverImageId)}
                    alt={game.name}
                    fill
                    className="object-cover"
                    priority={index < 6}
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <Search className="h-8 w-8" />
                  </div>
                )}
              </div>

              {/* Game Info Section */}
              <div className="flex flex-1 flex-col px-1">
                {/* Game Name */}
                <h3 className="line-clamp-2 text-sm font-medium leading-tight">
                  {game.name}
                </h3>

                {/* Release Date */}
                {game.firstReleaseDate && (
                  <p className="mt-1 text-xs text-muted-foreground md:text-sm">
                    {formatReleaseDate(game.firstReleaseDate)}
                  </p>
                )}

                {/* Platforms - Show unique platform icons */}
                {(game.steamUrlSegment ||
                  game.playstationUrlSegment ||
                  game.nintendoUrlSegment) && (
                  <div className="mt-3 flex items-center gap-2">
                    {game.steamUrlSegment && (
                      <Image
                        src="/logos/steam.svg"
                        alt="Steam Logo"
                        width={13}
                        height={13}
                      />
                    )}
                    {game.playstationUrlSegment && (
                      <Image
                        src="/logos/playstation.svg"
                        alt="PlayStation Logo"
                        width={13}
                        height={13}
                      />
                    )}
                    {game.nintendoUrlSegment && (
                      <Image
                        src="/logos/nintendo-switch.svg"
                        alt="Nintendo Switch Logo"
                        width={13}
                        height={13}
                      />
                    )}
                    {game.platforms?.includes(Platform.PC) && (
                      <Image
                        src="/logos/windows-10.svg"
                        alt="Windows Logo"
                        width={13}
                        height={13}
                      />
                    )}
                    {game.platforms?.includes(Platform.XBOX) && (
                      <Image
                        src="/logos/xbox.svg"
                        alt="Xbox Logo"
                        width={13}
                        height={13}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  )
}
