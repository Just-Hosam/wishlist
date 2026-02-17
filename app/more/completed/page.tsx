import ListEmptyState from "@/components/game/ListEmptyState"
import { Link } from "@/components/navigation"
import { getCachedCompletedGames } from "@/server/actions/lists"
import { Clock } from "lucide-react"
import { headers } from "next/headers"
import Image from "next/image"
import { redirect } from "next/navigation"

export default async function CompletedList() {
  const userId = (await headers()).get("x-user-id")
  if (!userId) redirect("/")

  const games = await getCachedCompletedGames(userId)

  if (games.length === 0) {
    return <ListEmptyState />
  }

  return (
    <div className="custom-slide-down-fade-in grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 md:grid-cols-4">
      {games.map((game, index) => (
        <CompletedGameCard game={game} index={index} key={game.id} />
      ))}
    </div>
  )
}

interface CompletedGameCardProps {
  game: {
    id: string
    name: string
    length: number | null
    coverImageUrl: string | null
  }
  index: number
}

const CompletedGameCard = ({ game, index }: CompletedGameCardProps) => (
  <Link href={`/more/completed/${game.id}`}>
    <div
      className="flex flex-col"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: "backwards"
      }}
    >
      {/* Cover Image - Takes ~half of vertical space */}
      <div className="relative mb-2 aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-200">
        {game.coverImageUrl && (
          <Image
            src={game.coverImageUrl}
            alt={`${game.name} cover`}
            fill
            className="object-cover"
            priority={index < 8}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}
      </div>

      <div className="px-1">
        <h3 className="line-clamp-2 text-sm font-medium leading-tight">
          {game.name}
        </h3>

        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground md:text-sm">
          <Clock size={11} />
          {game.length ? `${game.length} hours` : "-"}
        </p>
      </div>
    </div>
  </Link>
)
