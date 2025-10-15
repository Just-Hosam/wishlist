import { Button } from "@/components/ui/button"
import { PlusIcon, SearchX } from "lucide-react"
import Link from "next/link"

export default function ListEmptyState() {
  return (
    <div className="mt-20 flex flex-col items-center justify-center text-center">
      <SearchX size={100} strokeWidth={0.9} className="mb-7" />
      <h3 className="mb-3 text-2xl font-medium">No games yet</h3>
      <p className="mb-8 text-sm text-gray-600">
        Get started by adding a game.
      </p>
      <Link href="/game/add">
        <Button size="lg">
          <PlusIcon />
          Add Game
        </Button>
      </Link>
    </div>
  )
}
