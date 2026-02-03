import { SignOutButton } from "@/components/layout/SignoutButton"
import { Link } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Info } from "lucide-react"

export default function MorePage() {
  return (
    <div className="custom-slide-fade-in">
      <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
        Pages
      </h3>
      <Button
        asChild
        className="w-full justify-start"
        size="lg"
        variant="ghost"
      >
        <Link href="/more/about">
          <Info />
          About
          <ArrowRight className="ml-auto text-muted-foreground" />
        </Link>
      </Button>
      <Button
        asChild
        className="w-full justify-start"
        size="lg"
        variant="ghost"
      >
        <Link href="/more/completed">
          <CheckCircle2 />
          Completed
          <ArrowRight className="ml-auto text-muted-foreground" />
        </Link>
      </Button>
      <div className="-mx-6 my-6 border-[3px]"></div>
      <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
        Settings
      </h3>
      <Button
        asChild
        className="w-full justify-start"
        size="lg"
        variant="ghost"
      >
        <Link href="/more/about">
          <Info />
          About
          <ArrowRight className="ml-auto text-muted-foreground" />
        </Link>
      </Button>
      <Button
        asChild
        className="w-full justify-start"
        size="lg"
        variant="ghost"
      >
        <Link href="/more/completed">
          <CheckCircle2 />
          Completed
          <ArrowRight className="ml-auto text-muted-foreground" />
        </Link>
      </Button>
      <div className="-mx-6 my-6 border-[3px]"></div>
      <SignOutButton />
    </div>
  )
}
