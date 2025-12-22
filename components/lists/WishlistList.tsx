"use client"

import DeleteGameButton from "@/components/layout/DeleteGameButton"
import ListEmptyState from "@/components/layout/ListEmptyState"
import MoveGameButton from "@/components/layout/MoveGameButton"
import PriceLayout from "@/components/layout/PriceLayout"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { GameCategory, Platform } from "@/types"
import { ArrowRight, Clock, EllipsisVertical, Pencil } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type WishlistGame = {
  id: string
  name: string
  length: number | null
  category: GameCategory
  coverImageUrl: string | null
  createdAt: string
  updatedAt: string
  prices: {
    id: string
    platform: Platform
    externalId: string | null
    countryCode: string | null
    regularPrice: string | null
    currentPrice: string | null
    fetchedAt: string | null
    createdAt: string
    updatedAt: string
  }[]
}

interface WishlistListProps {
  games: WishlistGame[]
}

export default function WishlistList({ games }: WishlistListProps) {
  return (
    <>
      {games.map((game, index) => {
        const nintendoPrice = game?.prices?.find(
          ({ platform }) => Platform.NINTENDO === platform
        )

        const playstationPrice = game?.prices?.find(
          ({ platform }) => Platform.PLAYSTATION === platform
        )

        return (
          <div
            key={game.id}
            className="relative overflow-hidden rounded-3xl duration-300 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "backwards"
            }}
          >
            {/* Blurred background */}
            <div className="absolute inset-0">
              <Image
                src={game.coverImageUrl || ""}
                alt={`${game.name} cover`}
                fill
                sizes="320px"
                className="scale-125 object-cover blur-md"
                priority={false}
              />
              {/* Vignette / readability overlays */}
              <div className="v absolute inset-0 bg-gradient-to-b from-black/5 to-black/90" />
            </div>

            <div className="relative px-8 pb-7 pt-10">
              <header className="mb-4 flex flex-col items-center gap-4">
                <div className="bg-gray-220 mx-auto h-[240px] w-[180px] flex-shrink-0 overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src={game.coverImageUrl || ""}
                    alt={`${game.name} cover`}
                    width={180}
                    height={240}
                    className="h-full w-full object-cover"
                    priority={index < 5}
                  />
                </div>

                <h3 className="text-center text-2xl font-medium text-white">
                  {game.name}
                </h3>
              </header>
              <p className="flex items-center gap-1 text-xs font-normal text-gray-400">
                <Clock size={12} strokeWidth={1.75} className="mt-[-0.5px]" />
                {game?.length ? `${game?.length} hours` : "-"}
              </p>

              <div className="mt-3 flex flex-col gap-1 empty:mt-0">
                {playstationPrice && (
                  <div className="flex items-center">
                    <Image
                      src="/logos/playstation.svg"
                      alt="PlayStation Logo"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    <PriceLayout
                      onSale={
                        playstationPrice.currentPrice !==
                          playstationPrice.regularPrice &&
                        !!playstationPrice.regularPrice
                      }
                      currentPrice={Number(playstationPrice.currentPrice || 0)}
                      regularPrice={Number(playstationPrice.regularPrice || 0)}
                      currency="USD"
                      inverted
                    />
                  </div>
                )}
                {nintendoPrice && (
                  <div className="flex items-center">
                    <Image
                      src="/logos/nintendo-switch.svg"
                      alt="Nintendo Switch Logo"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    <PriceLayout
                      onSale={
                        nintendoPrice.currentPrice !==
                          nintendoPrice.regularPrice &&
                        !!nintendoPrice.regularPrice
                      }
                      currentPrice={Number(nintendoPrice.currentPrice || 0)}
                      regularPrice={Number(nintendoPrice.regularPrice || 0)}
                      currency="USD"
                      inverted
                    />
                  </div>
                )}
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-4 top-4 mr-[-4px] mt-[-4px] self-start px-2 text-white"
                  >
                    <EllipsisVertical />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="mr-4 w-fit md:mr-0">
                  <div className="flex flex-col">
                    <MoveGameButton
                      gameId={game.id}
                      fromCategory={GameCategory.WISHLIST}
                      toCategory={GameCategory.LIBRARY}
                      buttonText="To Library"
                      icon={<ArrowRight />}
                    />
                    <MoveGameButton
                      gameId={game.id}
                      fromCategory={GameCategory.WISHLIST}
                      toCategory={GameCategory.COMPLETED}
                      buttonText="To Completed"
                      icon={<ArrowRight />}
                    />
                    <div className="mx-[-12px] my-2 rounded-full border-[0.5px]"></div>
                    <Link href={`/game/${game.id}/edit`}>
                      <Button className="w-full justify-start" variant="ghost">
                        <Pencil />
                        Edit
                      </Button>
                    </Link>
                    <DeleteGameButton gameId={game.id} />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )
      })}
    </>
  )
}
