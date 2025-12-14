import { Game } from "@prisma/client"

export type GameInput = Omit<Game, "id" | "createdAt" | "updatedAt" | "userId">

export type GameOutput = Game
