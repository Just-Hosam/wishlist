import { BackButton } from "@/components/layout/BackButton"
import DeleteGameButton from "@/components/layout/DeleteGameButton"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import prisma from "@/lib/prisma"
import { Platform } from "@prisma/client"
import { Clock, EllipsisVertical, Pencil } from "lucide-react"
import Link from "next/link"

interface Props {
  params: Promise<{ id: string }>
}

export default async function Game({ params }: Props) {
  const { id } = await params
  const game = await prisma?.game.findUnique({
    where: { id },
    include: { prices: { orderBy: { lastFetchedAt: "desc" } } }
  })

  const nintendoPrice = game?.prices?.find(
    ({ platform }) => Platform.NINTENDO === platform
  )

  return (
    <>
      <header className="flex justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-3xl font-semibold">{game?.name}</h2>
          {game?.length && (
            <div className="mt-2 flex items-center gap-1 text-sm text-gray-600">
              <Clock size={14} /> {game?.length} hours
            </div>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="ghost">
              <EllipsisVertical />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="mr-6 w-fit md:mr-0">
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
      </header>

      {nintendoPrice && (
        <div className="mt-6 rounded-xl border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-red-600">Nintendo Store</h3>
              <p className="mt-1 text-xs text-gray-500">
                {nintendoPrice.countryCode &&
                  `${nintendoPrice.countryCode} Store`}
                {nintendoPrice.lastFetchedAt && (
                  <span className="ml-2">
                    Updated{" "}
                    {new Date(nintendoPrice.lastFetchedAt).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>
            <div className="text-right">
              {nintendoPrice.currentPrice &&
              nintendoPrice.currentPrice !== nintendoPrice.regularPrice ? (
                <div>
                  <div className="text-sm text-gray-500 line-through">
                    {nintendoPrice.currencyCode}{" "}
                    {nintendoPrice.regularPrice?.toString()}
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {nintendoPrice.currencyCode}{" "}
                    {nintendoPrice.currentPrice?.toString()}
                  </div>
                  <div className="text-xs font-medium text-green-600">
                    On Sale!
                  </div>
                </div>
              ) : (
                <div className="text-xl font-bold">
                  {nintendoPrice.currencyCode}{" "}
                  {nintendoPrice.regularPrice?.toString()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
