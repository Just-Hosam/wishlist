import { NextResponse } from "next/server"

function getBearerToken(authorizationHeader: string | null): string | null {
  if (!authorizationHeader) return null
  const [scheme, token] = authorizationHeader.split(" ")
  if (scheme !== "Bearer" || !token) return null
  return token
}

export function requireCronAuth(request: Request): NextResponse {
  const configuredSecret = process.env.CRON_SECRET

  if (!configuredSecret) {
    console.error("[CRON] Missing CRON_SECRET environment variable")
    return NextResponse.json(
      { error: "Cron authentication is not configured" },
      { status: 500 }
    )
  }

  const bearerToken = getBearerToken(request.headers.get("authorization"))
  const headerSecret = request.headers.get("x-cron-secret")
  const providedSecret = bearerToken ?? headerSecret

  if (providedSecret !== configuredSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({ ok: true })
}
