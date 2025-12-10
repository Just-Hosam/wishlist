export const GameCategory = {
  WISHLIST: "WISHLIST",
  LIBRARY: "LIBRARY",
  COMPLETED: "COMPLETED",
  ARCHIVED: "ARCHIVED"
} as const

export type GameCategory = (typeof GameCategory)[keyof typeof GameCategory]

export const Platform = {
  NINTENDO: "NINTENDO",
  PLAYSTATION: "PLAYSTATION",
  PC: "PC",
  XBOX: "XBOX"
} as const

export type Platform = (typeof Platform)[keyof typeof Platform]

export const PriceDescription = {
  STANDARD: "STANDARD",
  FREE_TO_PLAY: "FREE_TO_PLAY",
  PS_PLUS: "PS_PLUS",
  PS_PLUS_EXTRA: "PS_PLUS_EXTRA",
  PS_PLUS_PREMIUM: "PS_PLUS_PREMIUM"
} as const

export type PriceDescription =
  (typeof PriceDescription)[keyof typeof PriceDescription]
