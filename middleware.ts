import authConfig from "@/auth.config"
import NextAuth, { type NextAuthRequest } from "next-auth"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

function isPublicPath(pathname: string) {
  return (
    pathname === "/launch" ||
    pathname === "/search" ||
    pathname.startsWith("/search/") ||
    pathname === "/more" ||
    pathname === "/more/about"
  )
}

export default auth(function middleware(request: NextAuthRequest) {
  const { pathname } = request.nextUrl
  const session = request.auth

  if (isPublicPath(pathname)) return NextResponse.next()

  if (!session && pathname !== "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  if (session && pathname === "/") {
    const url = request.nextUrl.clone()
    url.pathname = "/wishlist"
    return NextResponse.redirect(url)
  }

  const requestHeaders = new Headers(request.headers)
  if (session?.user?.id) {
    requestHeaders.set("x-user-id", session.user.id)
  }

  return NextResponse.next({ request: { headers: requestHeaders } })
})

export const config = {
  matcher: [
    // Exclude API, static assets, PWA files, and JSON files (including manifest.json).
    "/((?!api|_next/static|_next/image|sw\\.js|favicon.ico|manifest.json|.*\\.json$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
  ]
}
