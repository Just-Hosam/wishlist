import { GoogleSigninButton } from "@/components/layout/GoogleSigninButton"
import { authOptions } from "@/lib/auth-options"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await getServerSession(authOptions)
  const isAuthenticated = !!session?.user

  if (isAuthenticated) redirect("/wishlist")

  return (
    <div className="flex h-[500px] flex-col items-center justify-center text-center">
      <h2 className="mb-3 text-3xl font-semibold">Welcome!</h2>
      <p className="mb-7">Login to manage your wishlist.</p>

      <GoogleSigninButton />
    </div>
  )
}
