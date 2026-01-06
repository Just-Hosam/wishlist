import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-semibold">404</h1>
      <h2 className="mt-4 text-3xl font-semibold">Page not found</h2>
      <p className="mt-6 max-w-md text-sm text-muted-foreground">
        This page does not exist. Head back to your wishlist or browse your
        library to keep tracking games.
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
