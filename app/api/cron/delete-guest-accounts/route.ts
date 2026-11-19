import { requireCronAuth } from "@/server/cron/auth"
import { deleteGuestAccounts } from "@/server/cron/guest"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const authResponse = requireCronAuth(request)
  if (!authResponse.ok) return authResponse

  try {
    const result = await deleteGuestAccounts()

    return NextResponse.json({
      ok: true,
      ...result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("[CRON] Guest cleanup failed:", error)

    return NextResponse.json(
      { ok: false, error: "Guest cleanup failed" },
      { status: 500 }
    )
  }
}
