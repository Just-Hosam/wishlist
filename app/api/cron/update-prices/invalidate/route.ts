import { requireCronAuth } from "@/server/cron/auth"
import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  revalidateTag("prices")

  return NextResponse.json({
    ok: true,
    invalidatedTags: ["prices"],
    timestamp: new Date().toISOString()
  })
}
