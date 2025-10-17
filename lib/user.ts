import "server-only"
import { cache } from "react"
import { headers } from "next/headers"

export const getUserId = cache(async (): Promise<string> => {
  const headersList = await headers()
  const userId = headersList.get("x-user-id")

  if (!userId) throw new Error("User not authenticated")

  return userId
})
