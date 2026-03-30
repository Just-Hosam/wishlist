import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

// This is less of a focus on "public routes" as the app is very user centered. It's just to skip an extra user check when not needed.
function isPublicPath(pathname: string) {
  return (
    pathname === "/launch" ||
    pathname === "/search" ||
    pathname.startsWith("/search/") ||
    pathname === "/more/about"
  )
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicPath(pathname)) return NextResponse.next()

  const secureCookie =
    request.nextUrl.protocol === "https:" ||
    request.headers.get("x-forwarded-proto") === "https"

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie,
    cookieName: secureCookie
      ? "__Secure-authjs.session-token"
      : "authjs.session-token"
  })
  const userId = typeof token?.sub === "string" && token.sub ? token.sub : null

  if (!userId && pathname !== "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  if (userId && pathname === "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/wishlist"
    return NextResponse.redirect(url)
  }

  const requestHeaders = new Headers(request.headers)
  if (userId) requestHeaders.set("x-user-id", userId)

  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    // Exclude API, static assets, PWA files, and JSON files (including manifest.json).
    "/((?!api|_next/static|_next/image|sw\\.js|favicon.ico|manifest.json|.*\\.json$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
}
