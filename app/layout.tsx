import AuthCheck from "@/components/layout/AuthCheck"
import AuthProvider from "@/components/layout/AuthProvider"
import { SignOutButton } from "@/components/layout/SignoutButton"
import { authOptions } from "@/lib/auth-options"
import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import Image from "next/image"
import Link from "next/link"
import "./globals.css"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Toaster } from "@/components/ui/sonner"
import { Gamepad2, ListCheck, Menu, Settings, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

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
            <Popover>
              <AuthCheck>
                <PopoverTrigger asChild>
                  <Button variant="ghost">
                    <Menu />
                  </Button>
                </PopoverTrigger>
              </AuthCheck>
              <PopoverContent className="w-fit ml-6">
                <div className="flex flex-col items-start">
                  <Link href="/wishlist">
                    <Button className="w-full" variant="ghost">
                      <ListCheck />
                      Wishlist
                    </Button>
                  </Link>
                  <Link href="/wishlist">
                    <Button className="w-full" variant="ghost">
                      <Gamepad2 />
                      Owned
                    </Button>
                  </Link>
                  <Link href="/wishlist">
                    <Button className="w-full" variant="ghost">
                      <Trash2 />
                      Graveyard
                    </Button>
                  </Link>
                  <SignOutButton />
                </div>
              </PopoverContent>
            </Popover>

            {/* <AuthCheck>
              <div className="flex items-center gap-3">
                <p className="text-right">{session?.user?.name}</p>
                <SignOutButton />
              </div>
            </AuthCheck> */}
          </nav>
          <div className="px-6 pb-12 max-w-[700px] m-auto">{children}</div>
          <Toaster />
        </body>
      </html>
    </AuthProvider>
  )
}
