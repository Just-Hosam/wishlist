import { Button } from "@/components/ui/button"
import { PlusIcon, SearchX } from "lucide-react"
import Link from "next/link"

export default function ListEmptyState() {
  return (
    <div className="mt-20 flex flex-col items-center justify-center text-center">
      <SearchX
        size={64}
        className="mb-4 text-muted-foreground"
        strokeWidth={1}
      />
      <h3 className="mb-1 text-lg font-semibold">No games yet</h3>
      <p className="text-sm text-muted-foreground">
        Start by adding your first game
      </p>
      <Link href="/search">
        <Button className="mt-6">
          <PlusIcon />
          Add Game
        </Button>
      </Link>
    </div>
  )
}
