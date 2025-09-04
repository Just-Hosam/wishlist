import AuthProvider from "@/components/layout/AuthProvider"
import NavigationPopover from "@/components/layout/NavigationPopover"
import { Toaster } from "@/components/ui/sonner"
import { authOptions } from "@/lib/auth-options"
import { Gamepad2 } from "lucide-react"
import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
  title: "Wishlist App",
  description: "Manage your wishlists with ease.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <AuthProvider>
      <html className="font-mont text-base" lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          <nav className="px-6 flex justify-between items-center mb-1 gap-6 max-w-[1200px] m-auto pt-6 pb-8  top-0 left-0 right-0 bg-white sticky">
            <Link href="/wishlist">
              <h1 className="flex items-center gap-2 text-xl">
                <Gamepad2 />
                GamesList
              </h1>
            </Link>
            <NavigationPopover></NavigationPopover>
          </nav>
          <div className="px-6 pb-12 max-w-[700px] m-auto">{children}</div>
          <Toaster />
        </body>
      </html>
    </AuthProvider>
  )
}
