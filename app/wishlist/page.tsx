import { Button } from "@/components/ui/button"
import { authOptions } from "@/lib/auth-options"
import { NintendoGameInfo } from "@/lib/nintendo-price"
import prisma from "@/lib/prisma"
import { GameCategory, Platform } from "@prisma/client"
import { PlusIcon, SearchX } from "lucide-react"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Wishlist() {
  const session = await getServerSession(authOptions)
  const isNotAuthenticated = !session?.user

  if (isNotAuthenticated) redirect("/")

  const user = await prisma.user.findUnique({
    where: { email: session.user!.email! },
    include: {
      games: {
        where: { category: GameCategory.WISHLIST },
        orderBy: { createdAt: "desc" },
        include: { prices: { orderBy: { lastFetchedAt: "desc" } } }
      }
    }
  })

  // Serialize the data to make it safe for client components
  const wishlistGames =
    user?.games?.map((game) => ({
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
    })) || []

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
            <Link href={`/game/${game.id}`} key={game.id}>
              <div className="mb-4 rounded-2xl border p-6">
                <header>
                  <h3 className="text-xl font-semibold">{game.name}</h3>
                  {game.length && (
                    <p className="text-light mt-1 text-xs text-gray-600">
                      about {game.length} hours
                    </p>
                  )}
                </header>
                {nintendoPrice && (
                  <div className="mt-4 flex items-center">
                    <Image
                      src="/nintendo-switch.svg"
                      alt="Nintendo Switch Logo"
                      width={18}
                      height={18}
                      className="mr-2"
                    />
                    <span className="font-medium">
                      ${nintendoPrice?.currentPrice}
                    </span>
                    {nintendoPrice?.currentPrice !==
                      nintendoPrice?.regularPrice &&
                      nintendoPrice?.regularPrice && (
                        <span className="ml-2 text-xs font-medium text-muted-foreground line-through">
                          ${nintendoPrice?.regularPrice}
                        </span>
                      )}
                  </div>
                )}
                {playstationPrice && (
                  <div className="mt-4 flex items-center">
                    <Image
                      src="/playstation.svg"
                      alt="PlayStation Logo"
                      width={18}
                      height={18}
                      className="mr-2"
                    />
                    <span className="font-medium">
                      ${playstationPrice?.currentPrice}
                    </span>
                    {playstationPrice?.currentPrice !==
                      playstationPrice?.regularPrice &&
                      playstationPrice?.regularPrice && (
                        <span className="ml-2 text-xs font-medium text-muted-foreground line-through">
                          ${playstationPrice?.regularPrice}
                        </span>
                      )}
                  </div>
                )}
              </div>
            </Link>
          )
        })
      )}
    </>
  )
}
