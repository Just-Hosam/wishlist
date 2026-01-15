import ListEmptyState from "@/components/layout/ListEmptyState"
import PriceLayout from "@/components/layout/PriceLayout"
import { ScrollToTopListener } from "@/components/layout/ScrollToTopListener"
import { getCachedWishlistGames } from "@/server/actions/lists"
import { Platform } from "@/types"
import { Clock } from "lucide-react"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function WishlistPage() {
  const userId = (await headers()).get("x-user-id")
  if (!userId) redirect("/")

  const wishlistGames = await getCachedWishlistGames(userId)

  if (wishlistGames.length === 0) {
    return <ListEmptyState />
  }

  return (
    <>
      <ScrollToTopListener />
      <div className="custom-fade-in grid gap-3">
        {wishlistGames.map((game, index) => {
          const nintendoPrice = game?.prices?.find(
            ({ platform }) => Platform.NINTENDO === platform
          )

          const playstationPrice = game?.prices?.find(
            ({ platform }) => Platform.PLAYSTATION === platform
          )

          const steamPrice = game?.prices?.find(
            ({ platform }) => Platform.PC === platform
          )

          return (
            <Link key={game.id} href={`/wishlist/${game.id}`}>
              <div className="flex overflow-hidden rounded-3xl border">
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
                    <h3 className="mb-1 line-clamp-2 font-medium">
                      {game.name}
                    </h3>
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
                    {steamPrice && (
                      <div className="flex items-center">
                        <Image
                          src="/logos/steam.svg"
                          alt="Steam Logo"
                          width={16}
                          height={16}
                          className="mr-2"
                        />
                        <PriceLayout
                          onSale={
                            steamPrice.currentPrice !==
                              steamPrice.regularPrice &&
                            !!steamPrice.regularPrice
                          }
                          currentPrice={Number(steamPrice.currentPrice || 0)}
                          regularPrice={Number(steamPrice.regularPrice || 0)}
                          currency="USD"
                        />
                      </div>
                    )}
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
    </>
  )
}
