import GameList from "@/components/game/GameList"
import ListEmptyState from "@/components/game/ListEmptyState"
import { getCachedCompletedGames } from "@/server/actions/lists"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function CompletedList() {
  const userId = (await headers()).get("x-user-id")
  if (!userId) redirect("/")

  const games = await getCachedCompletedGames(userId)

  if (games.length === 0) {
    return <ListEmptyState />
  }

  return (
    <div className="custom-slide-up-fade-in">
      <GameList games={games} baseHref="/more/completed" />
    </div>
  )
}
