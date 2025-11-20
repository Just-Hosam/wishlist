/**
 * Game-related enums and types
 * These mirror the Prisma schema enums
 */

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
  XBOX: "XBOX",
  PC: "PC"
} as const

export type Platform = (typeof Platform)[keyof typeof Platform]
