import { SignOutButton } from "@/components/auth/SignoutButton"
import { Link } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, Info, Palette } from "lucide-react"
import { ThemePicker } from "@/components/theme/ThemePicker"

export default function MorePage() {
  return (
    <div className="custom-slide-fade-in mt-2">
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
      <div className="-mx-4 my-6 border-[3px]"></div>
      <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
        Settings
      </h3>
      <ThemePicker>
        <Button className="w-full justify-start" size="lg" variant="ghost">
          <Palette />
          Appearance
          <ArrowRight className="ml-auto text-muted-foreground" />
        </Button>
      </ThemePicker>

      <div className="-mx-4 my-6 border-[3px]"></div>
      <div className="px-2">
        <SignOutButton />
      </div>
    </div>
  )
}
