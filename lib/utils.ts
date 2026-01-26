import { PriceOutput } from "@/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatReleaseDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

export const isPriceStale = (price: PriceOutput | null) => {
  if (!price) return null

  const now = new Date()
  const lastChecked = price.fetchedAt || new Date(0)
  const twoAMToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    2
  )
  return lastChecked < twoAMToday
}
