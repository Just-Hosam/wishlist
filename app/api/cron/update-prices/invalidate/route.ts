import { requireCronAuth } from "@/server/cron/auth"
import { invalidateAllCachedPrices } from "@/server/cache/prices"
import { tryCatch } from "@/lib/utils"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  const { data: invalidatedPriceKeys, error } = await tryCatch(
    invalidateAllCachedPrices()
  )
  if (error) {
    console.error("Price cache invalidation failed:", error)

    return NextResponse.json(
      {
        ok: false,
        error: "Price cache invalidation failed",
        message: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }

  revalidateTag("wishlist", { expire: 0 })
  revalidatePath("/wishlist")

  return NextResponse.json({
    ok: true,
    invalidatedPriceCacheKeys: invalidatedPriceKeys,
    invalidatedTags: ["wishlist"],
    invalidatedPaths: ["/wishlist"],
    timestamp: new Date().toISOString()
  })
}
