import DeleteGameButton from "@/components/layout/DeleteGameButton"
import PriceLayout from "@/components/layout/PriceLayout"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import prisma from "@/lib/prisma"
import { Platform } from "@prisma/client"
import { Clock, EllipsisVertical, Pencil } from "lucide-react"
import Image from "next/image"
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

  const playstationPrice = game?.prices?.find(
    ({ platform }) => Platform.PLAYSTATION === platform
  )

  return (
    <>
      <header className="mb-6 flex justify-between gap-4">
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

      {playstationPrice && (
        <div className="flex items-center">
          <Image
            src="/playstation.svg"
            alt="PlayStation Logo"
            width={18}
            height={18}
            className="mr-3"
          />
          <PriceLayout
            onSale={
              playstationPrice.currentPrice !== playstationPrice.regularPrice &&
              !!playstationPrice.regularPrice
            }
            currentPrice={Number(playstationPrice.currentPrice || 0)}
            regularPrice={Number(playstationPrice.regularPrice || 0)}
            currency={playstationPrice.currencyCode || "USD"}
          />
        </div>
      )}

      {nintendoPrice && (
        <div className="flex items-center">
          <Image
            src="/nintendo-switch.svg"
            alt="Nintendo Switch Logo"
            width={18}
            height={18}
            className="mr-3"
          />
          <PriceLayout
            onSale={
              nintendoPrice.currentPrice !== nintendoPrice.regularPrice &&
              !!nintendoPrice.regularPrice
            }
            currentPrice={Number(nintendoPrice.currentPrice || 0)}
            regularPrice={Number(nintendoPrice.regularPrice || 0)}
            currency={nintendoPrice.currencyCode || "USD"}
          />
        </div>
      )}
    </>
  )
}
