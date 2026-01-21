import { SignOutButton } from "@/components/layout/SignoutButton"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Info } from "lucide-react"
import Link from "next/link"

export default function MorePage() {
  return (
    <div className="custom-slide-fade-in">
      <Link
        href="/more/about"
        style={{ animationDelay: "0ms", animationFillMode: "backwards" }}
      >
        <Button className="w-full justify-start" variant="ghost">
          <Info />
          About
        </Button>
      </Link>
      <Link
        href="/more/completed"
        style={{ animationDelay: "50ms", animationFillMode: "backwards" }}
      >
        <Button className="w-full justify-start" variant="ghost">
          <CheckCircle2 />
          Completed
        </Button>
      </Link>
      <div style={{ animationDelay: "100ms", animationFillMode: "backwards" }}>
        <SignOutButton />
      </div>
    </div>
  )
}
