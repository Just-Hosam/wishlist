import { SignOutButton } from "@/components/layout/SignoutButton"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Info } from "lucide-react"
import Link from "next/link"

export default function MorePage() {
  return (
    <>
      <Link
        href="/more/about"
        className="duration-500 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
        style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
      >
        <Button className="w-full justify-start" variant="ghost">
          <Info />
          About
        </Button>
      </Link>
      <Link
        href="/more/completed"
        className="duration-500 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
        style={{ animationDelay: "50ms", animationFillMode: "backwards" }}
      >
        <Button className="w-full justify-start" variant="ghost">
          <CheckCircle2 />
          Completed
        </Button>
      </Link>
      <div
        className="duration-500 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
        style={{ animationDelay: "100ms", animationFillMode: "backwards" }}
      >
        <SignOutButton />
      </div>
    </>
  )
}
