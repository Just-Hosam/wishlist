import { requireCronAuth } from "@/server/cron/auth"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

// This cron is triggered at 4am and 1pm MST

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  revalidateTag("prices")
  revalidateTag("wishlist")
  revalidateTag("steam-reviews")
  revalidatePath("/wishlist")

  return NextResponse.json({
    ok: true,
    invalidatedTags: ["prices", "wishlist", "steam-reviews"],
    invalidatedPaths: ["/wishlist"],
    timestamp: new Date().toISOString()
  })
}
