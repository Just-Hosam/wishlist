import { Button } from "@/components/ui/button"
import { authOptions } from "@/lib/auth-options"
import {
  Clock,
  EllipsisVertical,
  Pencil,
  PlusIcon,
  SearchX
} from "lucide-react"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { GameCategory } from "@prisma/client"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import DeleteGameButton from "@/components/layout/DeleteGameButton"

export default async function Graveyard() {
  const session = await getServerSession(authOptions)
  const isNotAuthenticated = !session?.user

  if (isNotAuthenticated) redirect("/")

  const user = await prisma.user.findUnique({
    where: { email: session.user!.email! },
    include: {
      games: {
        where: { category: GameCategory.GRAVEYARD },
        orderBy: { createdAt: "desc" }
      }
    }
  })

  const graveyardGames = user?.games || []

  return (
    <>
      {graveyardGames.length === 0 ? (
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
        graveyardGames.map((game) => (
          <div key={game.id} className="mb-4 rounded-3xl border p-6">
            <header className="flex items-center justify-between gap-4">
              <div className="flex-1 text-xl font-medium">
                <h3>{game.name}</h3>
                {game.length && (
                  <p className="text-light mt-1 flex items-center gap-1 text-xs text-gray-600">
                    <Clock size={14} /> {game?.length} hours
                  </p>
                )}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="ghost" className="self-start px-2">
                    <EllipsisVertical />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-fit">
                  <div className="flex flex-col">
                    <Link href={`/game/${game.id}/edit`}>
                      <Button className="w-full justify-start" variant="ghost">
                        <Pencil />
                        Edit
                      </Button>
                    </Link>
                    <DeleteGameButton gameId={game.id} />
                  </div>
                </PopoverContent>
              </Popover>
            </header>
          </div>
        ))
      )}
    </>
  )
}
