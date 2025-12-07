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
import { GameCategory, Platform } from "@/types/game"
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
    gameId: string
    platform: Platform
    externalId: string | null
    countryCode: string | null
    currencyCode: string | null
    regularPrice: string | null
    currentPrice: string | null
    lastFetchedAt: string | null
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
      {games.length === 0 ? (
        <ListEmptyState />
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 md:gap-6">
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
                className="flex flex-col duration-300 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: "backwards"
                }}
              >
                {/* Cover Image - Takes ~half of vertical space */}
                <div className="relative mb-3 aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gray-200 shadow-md dark:bg-gray-700">
                  {game.coverImageUrl && (
                    <Image
                      src={game.coverImageUrl}
                      alt={`${game.name} cover`}
                      fill
                      className="object-cover"
                      priority={index < 8}
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  )}
                </div>

                {/* Game Info Section */}
                <div className="flex flex-1 flex-col px-1">
                  {/* Title, Length, and Menu Container */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      {/* Game Name */}
                      <h3 className="line-clamp-2 text-sm font-medium leading-tight text-gray-900 md:text-lg">
                        {game.name}
                      </h3>

                      {/* Game Length */}
                      {game.length && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground md:text-sm">
                          <Clock size={10} className="flex-shrink-0" />
                          {game.length} hours
                        </p>
                      )}
                    </div>

                    {/* Menu */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="-mr-1 -mt-[2px] h-6 w-6 flex-shrink-0 p-0"
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
                            <Button
                              className="w-full justify-start"
                              variant="ghost"
                            >
                              <Pencil />
                              Edit
                            </Button>
                          </Link>
                          <DeleteGameButton gameId={game.id} />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Prices */}
                  <div className="mt-auto flex flex-col gap-2 pt-4">
                    {playstationPrice && (
                      <div className="flex items-center gap-[6px]">
                        <Image
                          src="/logos/playstation.svg"
                          alt="PlayStation Logo"
                          width={15}
                          height={15}
                          className="flex-shrink-0"
                        />
                        <PriceLayout
                          onSale={
                            playstationPrice.currentPrice !==
                              playstationPrice.regularPrice &&
                            !!playstationPrice.regularPrice
                          }
                          currentPrice={Number(
                            playstationPrice.currentPrice || 0
                          )}
                          regularPrice={Number(
                            playstationPrice.regularPrice || 0
                          )}
                          currency={playstationPrice.currencyCode || "USD"}
                        />
                      </div>
                    )}
                    {nintendoPrice && (
                      <div className="flex items-center gap-[6px]">
                        <Image
                          src="/logos/nintendo-switch.svg"
                          alt="Nintendo Switch Logo"
                          width={15}
                          height={15}
                          className="flex-shrink-0"
                        />
                        <PriceLayout
                          onSale={
                            nintendoPrice.currentPrice !==
                              nintendoPrice.regularPrice &&
                            !!nintendoPrice.regularPrice
                          }
                          currentPrice={Number(nintendoPrice.currentPrice || 0)}
                          regularPrice={Number(nintendoPrice.regularPrice || 0)}
                          currency={nintendoPrice.currencyCode || "USD"}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
