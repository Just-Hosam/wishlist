import { Game, Prisma } from "@prisma/client"

export type GameInput = Omit<Game, "id" | "createdAt" | "updatedAt" | "userId">

export type GameOutput = Game

export type GameOutputWithPrices = Prisma.GameGetPayload<{
  include: { trackedPrices: true }
}>
