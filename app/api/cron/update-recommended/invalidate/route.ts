import { requireCronAuth } from "@/server/cron/auth"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  revalidateTag("igdb-recommended-games", { expire: 0 })
  revalidateTag("steam-reviews", { expire: 0 })
  revalidatePath("/search")

  return NextResponse.json({
    ok: true,
    invalidatedTags: ["igdb-recommended-games", "steam-reviews"],
    invalidatedPaths: ["/search"],
    timestamp: new Date().toISOString()
  })
}
