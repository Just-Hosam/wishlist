import { cache } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth-options"

export const getUserId = cache(async (): Promise<string> => {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("User not authenticated")
  }

  return session.user.id
})
