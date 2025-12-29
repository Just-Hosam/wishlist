import ListEmptyState from "@/components/layout/ListEmptyState"
import PriceLayout from "@/components/layout/PriceLayout"
import { authOptions } from "@/lib/auth-options"
import { getCachedWishlistGames } from "@/server/actions/lists"
import { Platform } from "@/types"
import { Clock } from "lucide-react"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function WishlistPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/")

  const wishlistGames = await getCachedWishlistGames(session.user.id)

  if (wishlistGames.length === 0) {
    return <ListEmptyState />
  }

  return (
    <div className="grid gap-3">
      {wishlistGames.map((game, index) => {
        const nintendoPrice = game?.prices?.find(
          ({ platform }) => Platform.NINTENDO === platform
        )

        const playstationPrice = game?.prices?.find(
          ({ platform }) => Platform.PLAYSTATION === platform
        )

        return (
          <Link key={game.id} href={`/game/${game.id}`}>
            <div
              className="flex overflow-hidden rounded-3xl border duration-300 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "backwards"
              }}
            >
              {game.coverImageUrl && (
                <div className="h-[174px] w-[130px] flex-shrink-0 overflow-hidden bg-gray-200">
                  <Image
                    src={game.coverImageUrl}
                    alt={`${game.name} cover`}
                    width={130}
                    height={174}
                    className="h-full w-full object-cover"
                    priority={index < 5}
                  />
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col px-4 py-3">
                <header className="items-start justify-between">
                  <h3 className="mb-1 line-clamp-2 font-medium">{game.name}</h3>
                  <p className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                    <Clock
                      size={12}
                      strokeWidth={1.75}
                      className="mt-[-0.5px]"
                    />
                    {game?.length ? `${game?.length} hours` : "-"}
                  </p>
                </header>

                <div className="mt-auto flex flex-col gap-1 pt-3 empty:pt-0">
                  {playstationPrice && (
                    <div className="flex items-center">
                      <Image
                        src="/logos/playstation.svg"
                        alt="PlayStation Logo"
                        width={16}
                        height={16}
                        className="mr-2"
                      />
                      <PriceLayout
                        onSale={
                          playstationPrice.currentPrice !==
                            playstationPrice.regularPrice &&
                          !!playstationPrice.regularPrice
                        }
                        currentPrice={Number(
                          playstationPrice.currentPrice || 0
                        )}
                        regularPrice={Number(
                          playstationPrice.regularPrice || 0
                        )}
                        currency="USD"
                      />
                    </div>
                  )}
                  {nintendoPrice && (
                    <div className="flex items-center">
                      <Image
                        src="/logos/nintendo-switch.svg"
                        alt="Nintendo Switch Logo"
                        width={16}
                        height={16}
                        className="mr-2"
                      />
                      <PriceLayout
                        onSale={
                          nintendoPrice.currentPrice !==
                            nintendoPrice.regularPrice &&
                          !!nintendoPrice.regularPrice
                        }
                        currentPrice={Number(nintendoPrice.currentPrice || 0)}
                        regularPrice={Number(nintendoPrice.regularPrice || 0)}
                        currency="USD"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
