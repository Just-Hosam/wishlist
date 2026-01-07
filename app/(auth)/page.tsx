import { GoogleSigninButton } from "@/components/layout/GoogleSigninButton"

export default function Home() {
  return (
    <div className="slide-fade-in flex h-[500px] flex-col items-center justify-center text-center">
      <h2 className="mb-3 text-3xl font-semibold">Welcome!</h2>
      <p className="mb-7">Login to manage your wishlist.</p>

      <GoogleSigninButton />
    </div>
  )
}
