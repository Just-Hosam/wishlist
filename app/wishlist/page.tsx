import { Button } from "@/components/ui/button"
import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { GameCategory } from "@prisma/client"
import { PlusIcon, SearchX } from "lucide-react"
import { getServerSession } from "next-auth"
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
          const nintendoPrice = game.prices?.[0]
          return (
            <Link href={`/game/${game.id}`} key={game.id}>
              <div className="mb-4 rounded-2xl border p-6">
                <header>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{game.name}</h3>
                      {game.length && (
                        <p className="text-light mt-1 text-xs text-gray-600">
                          about {game.length} hours
                        </p>
                      )}
                    </div>
                    {nintendoPrice && (
                      <div className="ml-4 text-right">
                        <div className="flex items-center gap-2">
                          <div className="text-xs font-medium text-red-600">
                            Nintendo
                          </div>
                        </div>
                        <div className="mt-1">
                          {nintendoPrice.currentPrice &&
                          nintendoPrice.currentPrice !==
                            nintendoPrice.regularPrice ? (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 line-through">
                                {nintendoPrice.currencyCode}{" "}
                                {nintendoPrice.regularPrice?.toString()}
                              </span>
                              <span className="font-semibold text-green-600">
                                {nintendoPrice.currencyCode}{" "}
                                {nintendoPrice.currentPrice?.toString()}
                              </span>
                            </div>
                          ) : (
                            <span className="font-semibold">
                              {nintendoPrice.currencyCode}{" "}
                              {nintendoPrice.regularPrice?.toString()}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </header>
              </div>
            </Link>
          )
        })
      )}
    </>
  )
}
