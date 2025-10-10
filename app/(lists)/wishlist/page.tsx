import DeleteGameButton from "@/components/layout/DeleteGameButton"
import MoveGameButton from "@/components/layout/MoveGameButton"
import PriceLayout from "@/components/layout/PriceLayout"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import prisma from "@/lib/prisma"
import { GameCategory, Platform } from "@prisma/client"
import {
  ArrowRight,
  Clock,
  EllipsisVertical,
  Pencil,
  PlusIcon,
  SearchX
} from "lucide-react"
import { unstable_cache } from "next/cache"
import Image from "next/image"
import Link from "next/link"

export const mockWishlistGames = [
  {
    id: "clxoil20j000008l43n8n5b5a",
    name: "The Legend of Zelda: Breath of the Wild 2",
    length: 80,
    category: GameCategory.WISHLIST,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    prices: [
      {
        id: "price1",
        gameId: "clxoil20j000008l43n8n5b5a",
        platform: Platform.NINTENDO,
        externalId: "12345",
        countryCode: "US",
        currencyCode: "USD",
        regularPrice: "59.99",
        currentPrice: "49.99",
        lastFetchedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  },
  {
    id: "clxoil20j000008l43n8n5b5b",
    name: "Hogwarts Legacy",
    length: 60,
    category: GameCategory.WISHLIST,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    prices: [
      {
        id: "price2",
        gameId: "clxoil20j000008l43n8n5b5b",
        platform: Platform.PLAYSTATION,
        externalId: "67890",
        countryCode: "US",
        currencyCode: "USD",
        regularPrice: "69.99",
        currentPrice: "69.99",
        lastFetchedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  },
  {
    id: "clxoil20j000008l43n8n5b5c",
    name: "Cyberpunk 2077",
    length: 100,
    category: GameCategory.WISHLIST,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    prices: [
      {
        id: "price3",
        gameId: "clxoil20j000008l43n8n5b5c",
        platform: Platform.PLAYSTATION,
        externalId: "54321",
        countryCode: "US",
        currencyCode: "USD",
        regularPrice: "39.99",
        currentPrice: "29.99",
        lastFetchedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }
]

const getCachedUserWithGames = (email: string) =>
  unstable_cache(
    async () => {
      console.log("Fetching wishlist data for:", email)

      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          games: {
            where: { category: GameCategory.WISHLIST },
            orderBy: { updatedAt: "desc" },
            include: { prices: { orderBy: { lastFetchedAt: "desc" } } }
          }
        }
      })

      console.log("Wishlist games found:", user?.games?.length || 0)

      // Serialize the data within the cached function to handle Date objects
      return user
        ? {
            ...user,
            games: user.games.map((game) => ({
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
          }
        : null
    },
    [`user-wishlist-games-${email}`], // Dynamic cache key per user
    { revalidate: 1800 } // 30 minutes
  )

export default async function Wishlist() {
  const user = await getCachedUserWithGames("hosamdahrouj56@gmail.com")()
  const wishlistGames = user?.games || []

  return (
    <>
      {wishlistGames.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center text-center">
          <SearchX size={100} strokeWidth={1} className="mb-6" />
          <h3 className="mb-2 text-xl font-semibold">No games yet</h3>
          <p className="mb-6">Get started by adding a game.</p>
          <Link href="/game/add">
            <Button>
              <PlusIcon />
              Add Game
            </Button>
          </Link>
        </div>
      ) : (
        wishlistGames.map((game) => {
          const nintendoPrice = game?.prices?.find(
            ({ platform }) => Platform.NINTENDO === platform
          )

          const playstationPrice = game?.prices?.find(
            ({ platform }) => Platform.PLAYSTATION === platform
          )

          return (
            <div key={game.id} className="mb-4 rounded-3xl border px-6 py-5">
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
