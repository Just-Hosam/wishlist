import { Price } from "@prisma/client"

export type PriceInput = Omit<
  Price,
  "id" | "createdAt" | "updatedAt" | "fetchedAt" | "trackedBy"
>

export type PriceOutput = Price
