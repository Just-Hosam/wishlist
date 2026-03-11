import { GoogleSigninButton } from "@/components/auth/GoogleSigninButton"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Sign in to Playward to manage your game wishlist, library, and completed games.",
  alternates: {
    canonical: "/"
  }
}

export default function Home() {
  return (
    <div className="custom-slide-up-fade-in flex h-[500px] flex-col items-center justify-center text-center">
      <h2 className="mb-3 text-3xl font-semibold">Welcome!</h2>
      <p className="mb-7">Login to manage your games.</p>

      <GoogleSigninButton />
    </div>
  )
}
