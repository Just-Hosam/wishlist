"use client"

import PriceLayout from "@/components/layout/PriceLayout"
import { GameCategory, Platform } from "@/types"
import { Clock } from "lucide-react"
import Image from "next/image"

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
            className="flex overflow-hidden rounded-2xl border duration-300 animate-in fade-in fade-out slide-in-from-top-3 slide-out-to-top-3"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "backwards"
            }}
          >
            {game.coverImageUrl && (
              <div className="h-[194px] w-[145px] flex-shrink-0 overflow-hidden bg-gray-200">
                <Image
                  src={game.coverImageUrl}
                  alt={`${game.name} cover`}
                  width={145}
                  height={194}
                  className="h-full w-full object-cover"
                  priority={index < 5}
                />
              </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col px-4 py-2">
              <header className="items-start justify-between">
                <h3 className="mb-1 line-clamp-2 text-lg font-medium">
                  {game.name}
                </h3>
                <p className="flex items-center gap-1 text-xs font-normal text-muted-foreground">
                  <Clock size={12} strokeWidth={1.75} className="mt-[-0.5px]" />
                  {game?.length ? `${game?.length} hours` : "-"}
                </p>
              </header>

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
                      currentPrice={Number(playstationPrice.currentPrice || 0)}
                      regularPrice={Number(playstationPrice.regularPrice || 0)}
                      currency="USD"
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
                      currency="USD"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
