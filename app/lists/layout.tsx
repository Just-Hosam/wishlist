import NavigationTabs from "@/components/layout/NavigationTabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function ListsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <header className="sticky top-[68px] z-40 m-auto mx-[-24px] flex min-h-[60px] max-w-[700px] items-center justify-between bg-white px-6 pb-4">
        <NavigationTabs />
        <Link href="/search">
          <Button size="icon">
            <Plus />
          </Button>
        </Link>
      </header>
      {children}
    </>
  )
}
