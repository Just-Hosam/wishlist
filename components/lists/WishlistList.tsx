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
        games.map((game, index) => {
          const nintendoPrice = game?.prices?.find(
            ({ platform }) => Platform.NINTENDO === platform
          )

          const playstationPrice = game?.prices?.find(
            ({ platform }) => Platform.PLAYSTATION === platform
          )

          return (
            <div
              key={game.id}
              className="mx-[-24px] flex gap-4 px-[24px] py-4 duration-300 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: "backwards"
              }}
            >
              {/* Cover Image */}
              {game.coverImageUrl && (
                <div className="h-[140px] w-[105px] flex-shrink-0 overflow-hidden rounded-xl bg-gray-200 shadow-lg dark:bg-gray-700">
                  <Image
                    src={game.coverImageUrl}
                    alt={`${game.name} cover`}
                    width={105}
                    height={140}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              {/* Main Content */}
              <div className="flex min-w-0 flex-1 flex-col">
                {/* Header with title and menu */}
                <header className="3 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-1 line-clamp-2 text-lg font-medium text-gray-900">
                      {game.name}
                    </h3>
                    {game.length && (
                      <p className="mt-1 flex items-center gap-1 text-xs font-normal text-gray-600">
                        <Clock
                          size={12}
                          strokeWidth={1.75}
                          className="mt-[-0.5px]"
                        />
                        {game?.length} hours
                      </p>
                    )}
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mr-[-4px] mt-[-4px] self-start px-2"
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
                        <MoveGameButton
                          gameId={game.id}
                          fromCategory={GameCategory.WISHLIST}
                          toCategory={GameCategory.ARCHIVED}
                          buttonText="To Archived"
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
                </header>

                {/* Prices */}
                <div className="mt-auto flex flex-col gap-1 pb-1 pt-3 empty:pt-0">
                  {playstationPrice && (
                    <div className="flex items-center">
                      <Image
                        src="/logos/playstation.svg"
                        alt="PlayStation Logo"
                        width={16}
                        height={16}
                        className="mr-2"
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
                    <div className="flex items-center">
                      <Image
                        src="/logos/nintendo-switch.svg"
                        alt="Nintendo Switch Logo"
                        width={16}
                        height={16}
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
                        currency={nintendoPrice.currencyCode || "USD"}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })
      )}
    </>
  )
}
