import { Button } from "@/components/ui/button"
import { authOptions } from "@/lib/auth-options"
import { CircleCheckBig, PlusIcon, SearchX } from "lucide-react"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"

export default async function Completed() {
  const session = await getServerSession(authOptions)
  const isNotAuthenticated = !session?.user

  if (isNotAuthenticated) redirect("/")

  const user = await prisma.user.findUnique({
    where: { email: session.user!.email! },
    include: {
      games: {
        where: { category: "COMPLETED" },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  const completedGames = user?.games || []

  return (
    <div>
      <header className="flex justify-between items-center gap-4 pb-8 sticky top-[88px] bg-white">
        <h2 className="flex items-center gap-3 text-2xl">
          <CircleCheckBig />
          Completed
        </h2>
        <Link href="game/add">
          <Button size="icon">
            <PlusIcon />
          </Button>
        </Link>
      </header>
      {completedGames.length === 0 ? (
        <div className="mt-10 flex flex-col items-center justify-center text-center">
          <SearchX size={100} strokeWidth={1} className="mb-6" />
          <h3 className="font-semibold text-xl mb-2">No games yet</h3>
          <p className="mb-6">Get started by adding a game.</p>
          <Link href="game/add">
            <Button>
              <PlusIcon />
              Add Game
            </Button>
          </Link>
        </div>
      ) : (
        completedGames.map(game => (
          <div key={game.id} className="border rounded-2xl p-6 mb-4">
            <header>
              <h3 className="text-xl font-semibold">{game.name}</h3>
              {game.length && (
                <p className="text-light text-xs mt-1 text-gray-600">
                  about {game.length} hours
                </p>
              )}
            </header>
          </div>
        ))
      )}
    </div>
  )
}
