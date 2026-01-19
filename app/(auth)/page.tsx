import { GoogleSigninButton } from "@/components/layout/GoogleSigninButton"
import { PageHeader } from "@/components/layout/PageHeader"
import { Gamepad2 } from "lucide-react"

export default function Home() {
  return (
    <>
      <PageHeader>
        <div className="flex items-center gap-3">
          <Gamepad2 size={40} />
          <h1 className="text-3xl font-semibold">Playward</h1>
        </div>
      </PageHeader>
      <div className="custom-slide-fade-in flex h-[500px] flex-col items-center justify-center text-center">
        <h2 className="mb-3 text-3xl font-semibold">Welcome!</h2>
        <p className="mb-7">Login to manage your games.</p>

        <GoogleSigninButton />
      </div>
    </>
  )
}
