import { Button } from "@/components/ui/button"
import { authOptions } from "@/lib/auth-options"
import prisma from "@/lib/prisma"
import { PlusIcon } from "lucide-react"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function Events() {
  const session = await getServerSession(authOptions)
  const isNotAuthenticated = !session?.user

  if (isNotAuthenticated) redirect("/")

  return (
    <div>
      <header className="flex justify-between items-center gap-4 pb-8 sticky top-[88px] bg-white">
        <h2 className="text-3xl">My Wishlist</h2>
      </header>
    </div>
  )
}
