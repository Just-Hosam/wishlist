import { Game } from "@prisma/client"

// Type to be used when creating or updating a Game record
export type GameInput = Omit<Game, "id" | "createdAt" | "updatedAt" | "userId">

// export type GameOutput = Game
export type GameOutput = Game
