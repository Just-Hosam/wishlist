import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import ListsWrapper from "@/components/lists/ListsWrapper"
import {
  getCachedWishlistGames,
  getCachedLibraryGames,
  getCachedCompletedGames,
  getCachedArchivedGames
} from "@/server/actions/lists"

export default async function ListsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) redirect("/")

  const [wishlistGames, libraryGames, completedGames, archivedGames] =
    await Promise.all([
      getCachedWishlistGames(session.user.id),
      getCachedLibraryGames(session.user.id),
      getCachedCompletedGames(session.user.id),
      getCachedArchivedGames(session.user.id)
    ])

  return (
    <ListsWrapper
      data={{
        wishlistGames,
        libraryGames,
        completedGames,
        archivedGames
      }}
    />
  )
}
