import ListsWrapper from "@/components/lists/ListsWrapper"
import { authOptions } from "@/lib/auth-options"
import {
  getCachedLibraryGames,
  getCachedWishlistGames
} from "@/server/actions/lists"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function ListsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/")

  const [wishlistGames, libraryGames] = await Promise.all([
    getCachedWishlistGames(session.user.id),
    getCachedLibraryGames(session.user.id)
  ])

  return (
    <ListsWrapper
      data={{
        wishlistGames,
        libraryGames
      }}
    />
  )
}
