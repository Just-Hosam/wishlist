import { SignOutButton } from "@/components/layout/SignoutButton"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Info } from "lucide-react"
import Link from "next/link"

export default function MorePage() {
  return (
    <>
      <div className="flex flex-col gap-2 p-4">
        <Link href="/more/about">
          <Button className="w-full justify-start" variant="ghost">
            <Info />
            About
          </Button>
        </Link>
        <Link href="/more/completed">
          <Button className="w-full justify-start" variant="ghost">
            <CheckCircle2 />
            Completed
          </Button>
        </Link>
        <SignOutButton />

        <div className="mx-[-12px] my-2 rounded-full border-[0.5px]"></div>

        <div className="text-center text-xs text-gray-500">
          version {process.env.APP_VERSION}
        </div>
      </div>
    </>
  )
}
