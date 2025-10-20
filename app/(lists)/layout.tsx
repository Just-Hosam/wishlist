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
      <header className="sticky top-[68px] m-auto flex min-h-[60px] max-w-[700px] items-center justify-between bg-white pb-4">
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
