import { requireCronAuth } from "@/server/cron/auth"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  revalidateTag("prices")
  revalidateTag("wishlist")
  revalidatePath("/wishlist")

  return NextResponse.json({
    ok: true,
    invalidatedTags: ["prices", "wishlist"],
    invalidatedPaths: ["/wishlist"],
    timestamp: new Date().toISOString()
  })
}
