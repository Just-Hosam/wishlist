import DeleteGameButton from "@/components/layout/DeleteGameButton"
import ListEmptyState from "@/components/layout/ListEmptyState"
import MoveGameButton from "@/components/layout/MoveGameButton"
import PriceLayout from "@/components/layout/PriceLayout"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import prisma from "@/lib/prisma"
import { getUserId } from "@/lib/user"
import { GameCategory, Platform } from "@prisma/client"
import { ArrowRight, Clock, EllipsisVertical, Pencil } from "lucide-react"
import { unstable_cache } from "next/cache"
import Image from "next/image"
import Link from "next/link"

const getCachedWishlistGames = (userId: string) =>
  unstable_cache(
    async () => {
      const games = await prisma.game.findMany({
        where: {
          userId,
          category: GameCategory.WISHLIST
        },
        orderBy: { updatedAt: "desc" },
        include: { prices: { orderBy: { lastFetchedAt: "desc" } } }
      })

      return games.map((game) => ({
        id: game.id,
        name: game.name,
        length: game.length,
        category: game.category,
        createdAt: game.createdAt.toISOString(),
        updatedAt: game.updatedAt.toISOString(),
        prices: game.prices.map((price) => ({
          id: price.id,
          gameId: price.gameId,
          platform: price.platform,
          externalId: price.externalId,
          countryCode: price.countryCode,
          currencyCode: price.currencyCode,
          regularPrice: price.regularPrice?.toString() || null,
          currentPrice: price.currentPrice?.toString() || null,
          lastFetchedAt: price.lastFetchedAt?.toISOString() || null,
          createdAt: price.createdAt.toISOString(),
          updatedAt: price.updatedAt.toISOString()
        }))
      }))
    },
    [userId],
    {
      tags: ["user-wishlist-games"],
      revalidate: 1800 // 30 minutes
    }
  )

export default async function Wishlist() {
  const userId = await getUserId()
  const wishlistGames = await getCachedWishlistGames(userId)()

  return (
    <>
      {wishlistGames.length === 0 ? (
        <ListEmptyState />
      ) : (
        wishlistGames.map((game, index) => {
          const nintendoPrice = game?.prices?.find(
            ({ platform }) => Platform.NINTENDO === platform
          )

          const playstationPrice = game?.prices?.find(
            ({ platform }) => Platform.PLAYSTATION === platform
          )

          return (
            <div
              key={game.id}
              className="mb-4 rounded-3xl border px-6 py-5 duration-500 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "backwards"
              }}
            >
              <header className="flex items-center justify-between gap-4">
                <div className="flex-1 text-xl font-medium">
                  <h3>{game.name}</h3>
                  {game.length && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-normal text-gray-600">
                      <Clock size={14} /> {game?.length} hours
                    </p>
                  )}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="self-start px-2"
                    >
                      <EllipsisVertical />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="mr-4 w-fit md:mr-0">
                    <div className="flex flex-col">
                      <MoveGameButton
                        gameId={game.id}
                        fromCategory={GameCategory.WISHLIST}
                        toCategory={GameCategory.LIBRARY}
                        buttonText="To Library"
                        icon={<ArrowRight />}
                      />
                      <MoveGameButton
                        gameId={game.id}
                        fromCategory={GameCategory.WISHLIST}
                        toCategory={GameCategory.COMPLETED}
                        buttonText="To Completed"
                        icon={<ArrowRight />}
                      />
                      <MoveGameButton
                        gameId={game.id}
                        fromCategory={GameCategory.WISHLIST}
                        toCategory={GameCategory.ARCHIVED}
                        buttonText="To Archived"
                        icon={<ArrowRight />}
                      />
                      <div className="my-2 rounded-full border-[0.5px]"></div>
                      <Link href={`/game/${game.id}/edit`}>
                        <Button
                          className="w-full justify-start"
                          variant="ghost"
                        >
                          <Pencil />
                          Edit
                        </Button>
                      </Link>
                      <DeleteGameButton gameId={game.id} />
                    </div>
                  </PopoverContent>
                </Popover>
              </header>
              <div className="mt-6 flex flex-col gap-2 empty:mt-0">
                {playstationPrice && (
                  <div className="flex items-center">
                    <Image
                      src="/logos/playstation.svg"
                      alt="PlayStation Logo"
                      width={18}
                      height={18}
                      className="mr-3"
                    />
                    <PriceLayout
                      onSale={
                        playstationPrice.currentPrice !==
                          playstationPrice.regularPrice &&
                        !!playstationPrice.regularPrice
                      }
                      currentPrice={Number(playstationPrice.currentPrice || 0)}
                      regularPrice={Number(playstationPrice.regularPrice || 0)}
                      currency={playstationPrice.currencyCode || "USD"}
                    />
                  </div>
                )}
                {nintendoPrice && (
                  <div className="flex items-center">
                    <Image
                      src="/logos/nintendo-switch.svg"
                      alt="Nintendo Switch Logo"
                      width={18}
                      height={18}
                      className="mr-3"
                    />
                    <PriceLayout
                      onSale={
                        nintendoPrice.currentPrice !==
                          nintendoPrice.regularPrice &&
                        !!nintendoPrice.regularPrice
                      }
                      currentPrice={Number(nintendoPrice.currentPrice || 0)}
                      regularPrice={Number(nintendoPrice.regularPrice || 0)}
                      currency={nintendoPrice.currencyCode || "USD"}
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })
      )}
    </>
  )
}
