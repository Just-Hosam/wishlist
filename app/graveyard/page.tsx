import { Button } from "@/components/ui/button"
import { authOptions } from "@/lib/auth-options"
import { PlusIcon, Skull } from "lucide-react"
import { getServerSession } from "next-auth"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Graveyard() {
  const session = await getServerSession(authOptions)
  const isNotAuthenticated = !session?.user

  if (isNotAuthenticated) redirect("/")

  return (
    <div>
      <header className="flex justify-between items-center gap-4 pb-8 sticky top-[88px] bg-white">
        <h2 className="flex items-center gap-3 text-2xl">
          <Skull />
          Graveyard
        </h2>
        <Link href="game/add">
          <Button size="icon">
            <PlusIcon />
          </Button>
        </Link>
      </header>
      <div className="border rounded-2xl p-6 mb-4">
        <header>
          <h3 className="text-xl font-semibold">The Last Faith</h3>
          <p className="text-light text-xs mt-1 text-gray-600">
            about 20 hours
          </p>
        </header>
        <div className="mt-4">
          <p className="mb-1 last:mb-0">PS - $29.99 </p>
          <p className="mb-1 last:mb-0">Nintendo - $20.99 </p>
        </div>
      </div>
      <div className="border rounded-2xl p-6 mb-4">
        <header>
          <h3 className="text-xl font-semibold">Crypt Custodian</h3>
          <p className="text-light text-xs mt-1 text-gray-600">
            about 16 hours
          </p>
        </header>
        <div className="mt-4">
          <p className="mb-1 last:mb-0">PS - $24.99 </p>
          <p className="mb-1 last:mb-0">Nintendo - $18.99 </p>
        </div>
      </div>
    </div>
  )
}
