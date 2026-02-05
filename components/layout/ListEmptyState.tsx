import { Link } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Search, SearchX } from "lucide-react"

export default function ListEmptyState() {
  return (
    <div className="mt-36 flex flex-col items-center justify-center text-center">
      <SearchX
        size={84}
        className="mb-6 text-muted-foreground"
        strokeWidth={1}
      />
      <h3 className="mb-2 text-xl font-semibold">No games yet</h3>
      <p className="text-muted-foreground">
        Start by searching for your first game
      </p>
      <Link href="/search">
        <Button className="mt-6" size="lg" variant="accent">
          <Search />
          Search
        </Button>
      </Link>
    </div>
  )
}
