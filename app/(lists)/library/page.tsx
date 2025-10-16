import DeleteGameButton from "@/components/layout/DeleteGameButton"
import ListEmptyState from "@/components/layout/ListEmptyState"
import MoveGameButton from "@/components/layout/MoveGameButton"
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

const getCachedLibraryGames = (userId: string) =>
  unstable_cache(
    async () => {
      const games = await prisma.game.findMany({
        where: {
          userId,
          category: GameCategory.LIBRARY
        },
        orderBy: { updatedAt: "desc" }
      })

      return games.map((game) => ({
        id: game.id,
        name: game.name,
        length: game.length,
        category: game.category,
        platforms: game.platforms,
        createdAt: game.createdAt.toISOString(),
        updatedAt: game.updatedAt.toISOString()
      }))
    },
    [userId],
    {
      tags: ["user-library-games"],
      revalidate: 1800 // 30 minutes
    }
  )

export default async function Library() {
  const userId = await getUserId()
  const libraryGames = await getCachedLibraryGames(userId)()

  return (
    <>
      {libraryGames.length === 0 ? (
        <ListEmptyState />
      ) : (
        libraryGames.map((game) => (
          <div
            key={game.id}
            className="mb-4 rounded-3xl border px-6 py-5 duration-500 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
            style={{
              animationDelay: `${libraryGames.indexOf(game) * 100}ms`,
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
                  <Button size="sm" variant="ghost" className="self-start px-2">
                    <EllipsisVertical />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="mr-4 w-fit md:mr-0">
                  <div className="flex flex-col">
                    <MoveGameButton
                      gameId={game.id}
                      fromCategory={GameCategory.LIBRARY}
                      toCategory={GameCategory.WISHLIST}
                      buttonText="To Wishlist"
                      icon={<ArrowRight />}
                    />
                    <MoveGameButton
                      gameId={game.id}
                      fromCategory={GameCategory.LIBRARY}
                      toCategory={GameCategory.COMPLETED}
                      buttonText="To Completed"
                      icon={<ArrowRight />}
                    />
                    <MoveGameButton
                      gameId={game.id}
                      fromCategory={GameCategory.LIBRARY}
                      toCategory={GameCategory.ARCHIVED}
                      buttonText="To Archived"
                      icon={<ArrowRight />}
                    />
                    <div className="my-2 rounded-full border-[0.5px]"></div>
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

            <div className="mt-6 flex gap-5 empty:hidden">
              {game.platforms?.includes(Platform.NINTENDO) && (
                <Image
                  src="/logos/nintendo-switch.svg"
                  alt="Nintendo Switch Logo"
                  width={25}
                  height={25}
                />
              )}
              {game.platforms?.includes(Platform.PLAYSTATION) && (
                <Image
                  src="/logos/playstation.svg"
                  alt="PlayStation Logo"
                  width={25}
                  height={25}
                />
              )}
            </div>
          </div>
        ))
      )}
    </>
  )
}
