import { BackButton } from "@/components/layout/BackButton"
import DeleteGameButton from "@/components/layout/DeleteGameButton"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { EllipsisVertical, Pencil } from "lucide-react"
import Link from "next/link"

interface Props {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

export default async function GameLayout({ children, params }: Props) {
  const { id } = await params

  return (
    <div>
      <header className="flex justify-between items-center gap-4 pb-6 sticky top-[88px] bg-white">
        <BackButton />
        <div className="flex gap-2 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <EllipsisVertical />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit mr-6 md:mr-0">
              <div className="flex flex-col">
                <Link href={`/game/${id}/edit`}>
                  <Button className="w-full justify-start" variant="ghost">
                    <Pencil />
                    Edit
                  </Button>
                </Link>
                <DeleteGameButton gameId={id} />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>
      {children}
    </div>
  )
}
