"use client"

import { Button } from "@/components/ui/button"
import { Link } from "@/components/navigation"

export default function ErrorPage() {
  return (
    <div className="custom-slide-fade-in flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-semibold">ERROR</h1>
      <h2 className="mt-4 text-3xl font-semibold">Something went wrong</h2>
      <p className="mt-6 max-w-md text-sm text-muted-foreground">
        Head back to your wishlist or browse your library to keep tracking
        games.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/wishlist">Go to wishlist</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/library">Open library</Link>
        </Button>
      </div>
    </div>
  )
}
