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
      },
    },
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
        wishlistGames.map((game) => (
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
            </div>
          </Link>
        ))
      )}
    </>
  )
}
