import AuthProvider from "@/components/layout/AuthProvider"
import NavigationPopover from "@/components/layout/NavigationPopover"
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import "./globals.css"

export const metadata: Metadata = {
  title: "GamesList - Wishlist App",
  description:
    "Manage your game wishlists with ease. Track games you want to play, own, and have completed.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
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
              <Image
                src="/gameslist-logo.png"
                alt="GamesList Logo"
                width={160}
                height={50}
              ></Image>
            </Link>
            <NavigationPopover />
          </nav>
          <div className="px-6 pb-12 max-w-[700px] m-auto">{children}</div>
          <Toaster />
        </body>
      </html>
    </AuthProvider>
  )
}
