import { GuestSigninButton } from "@/components/auth/GuestSigninButton"
import { GoogleSigninButton } from "@/components/auth/GoogleSigninButton"

export default function Home() {
  return (
    <div className="custom-slide-up-fade-in flex h-[500px] flex-col items-center justify-center text-center">
      <h2 className="mb-3 text-3xl font-semibold">Welcome!</h2>
      <p className="mb-7">Login to manage your games.</p>

      <div className="w-[240px]">
        <GoogleSigninButton />
        <div className="mb-4 mt-3 flex items-center gap-2 text-muted-foreground">
          <div className="h-0 flex-1 rounded-full border"></div>
          <p>or</p>
          <div className="h-0 flex-1 rounded-full border"></div>
        </div>
        <GuestSigninButton />
      </div>
    </div>
  )
}
