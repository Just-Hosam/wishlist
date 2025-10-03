import AuthCheck from "@/components/layout/AuthCheck"
import NavigationTabs from "@/components/layout/NavigationTabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function ListsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="sticky top-[68px] m-auto mb-3 flex min-h-[48px] max-w-[700px] items-center justify-between bg-white pb-1">
        <NavigationTabs />
        <Link href="/game/add">
          <Button size="icon">
            <Plus />
          </Button>
        </Link>
      </header>
      {children}
    </>
  )
}
