import ListEmptyState from "@/components/layout/ListEmptyState"
import { authOptions } from "@/lib/auth-options"
import { getCachedCompletedGames } from "@/server/actions/lists"
import { Clock } from "lucide-react"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function CompletedList() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return redirect("/")

  const games = await getCachedCompletedGames(session.user.id)

  if (games.length === 0) {
    return <ListEmptyState />
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
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
      className="flex flex-col duration-300 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
      style={{
        animationDelay: `${index * 50}ms`,
        animationFillMode: "backwards"
      }}
    >
      {/* Cover Image - Takes ~half of vertical space */}
      <div className="relative mb-3 aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-200 shadow-md">
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

      <div className="pl-1 pr-2">
        <h3 className="leading-tigh line-clamp-2 font-medium md:text-lg">
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
