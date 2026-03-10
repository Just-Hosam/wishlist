import { SignOutButton } from "@/components/auth/SignoutButton"
import { Link } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Bug,
  CheckCircle2,
  Info,
  Palette
} from "lucide-react"
import { ThemePicker } from "@/components/theme/ThemePicker"

export default function MorePage() {
  return (
    <div className="custom-slide-up-fade-in">
      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
        Pages
      </h2>
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
      <div className="-mx-4 my-6 border-[3px]"></div>
      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
        Settings
      </h2>
      <ThemePicker>
        <Button className="w-full justify-start" size="lg" variant="ghost">
          <Palette />
          Appearance
          <ArrowRight className="ml-auto text-muted-foreground" />
        </Button>
      </ThemePicker>

      <Button
        asChild
        className="w-full justify-start"
        size="lg"
        variant="ghost"
      >
        <Link href="/more/pwa">
          <Bug />
          PWA Diagnostics
          <ArrowRight className="ml-auto text-muted-foreground" />
        </Link>
      </Button>

      <div className="-mx-4 my-6 border-[3px]"></div>
      <div className="px-2">
        <SignOutButton />
      </div>
    </div>
  )
}
