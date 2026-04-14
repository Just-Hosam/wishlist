import { SignOutButton } from "@/components/auth/SignoutButton"
import { Link } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Info } from "lucide-react"
import { ThemePicker } from "@/components/theme/ThemePicker"

export default function MorePage() {
  return (
    <div className="custom-slide-up-fade-in">
      <h2 className="mb-4 text-sm font-semibold text-muted-foreground">
        Pages
      </h2>
      <Button
        asChild
        size="link"
        variant="link"
        className="w-full justify-between"
      >
        <Link href="/more/about">
          <div className="flex items-center gap-2">
            <Info />
            About
          </div>
          <ArrowRight className="ml-auto text-muted-foreground" />
        </Link>
      </Button>
      <Button
        asChild
        size="link"
        variant="link"
        className="mt-2 w-full justify-between"
      >
        <Link href="/more/completed">
          <div className="flex items-center gap-2">
            <CheckCircle2 />
            Completed
          </div>
          <ArrowRight className="ml-auto text-muted-foreground" />
        </Link>
      </Button>
      <h2 className="mb-4 mt-6 text-sm font-semibold text-muted-foreground">
        Settings
      </h2>
      <ThemePicker />

      <SignOutButton className="mt-2" />
    </div>
  )
}
