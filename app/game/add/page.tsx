import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default async function NewGame() {
  return (
    <div>
      <Link href="/wishlist">
        <Button className="mb-3" variant="ghost" size="icon">
          <ArrowLeftIcon />
        </Button>
      </Link>
      <p>ADD GAME</p>
    </div>
  )
}
