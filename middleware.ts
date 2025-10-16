import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  if (!token && pathname !== "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  if (token && pathname === "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/wishlist"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Exclude API, next static routes, images, favicon, and JSON files (including manifest.json)
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|.*\\.json$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
}
