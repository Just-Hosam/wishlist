"use client"

import { usePathname, useSearchParams } from "next/navigation"

export type TabCategory = "wishlist" | "owned" | "completed" | "graveyard"

export function useActiveTab(): TabCategory {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Determine the active tab based on the current pathname or search params
  if (
    pathname.includes("/wishlist") ||
    searchParams.get("category") === "wishlist"
  ) {
    return "wishlist"
  }

  if (pathname.includes("/owned") || searchParams.get("category") === "owned") {
    return "owned"
  }

  if (
    pathname.includes("/completed") ||
    searchParams.get("category") === "completed"
  ) {
    return "completed"
  }

  if (
    pathname.includes("/graveyard") ||
    searchParams.get("category") === "graveyard"
  ) {
    return "graveyard"
  }

  return "wishlist" // default fallback
}
