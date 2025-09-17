import AuthProvider from "@/components/layout/AuthProvider"
import NavigationTabs from "@/components/layout/NavigationTabs"
import { SignOutButton } from "@/components/layout/SignoutButton"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { TabProvider } from "@/contexts/TabContext"
import { Gamepad2, PlusIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import "./globals.css"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import AuthCheck from "@/components/layout/AuthCheck"

export const metadata: Metadata = {
  title: "GamesList",
  description:
    "Manage your game wishlists with ease. Track games you want to play, own, and have completed.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getServerSession(authOptions)

  return (
    <AuthProvider>
      <TabProvider>
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
            <nav className="px-6 flex justify-between items-center gap-6 max-w-[1200px] m-auto py-6 top-0 left-0 right-0 bg-white sticky">
              <h1 className="flex items-center gap-2 text-xl">
                <Gamepad2 />
                GamesList
              </h1>
              <AuthCheck>
                <div className="flex items-center gap-3">
                  <p className="block md:hidden">
                    {session?.user?.name?.split(" ")[0]}
                  </p>
                  <p className="hidden md:block">{session?.user?.name}</p>
                  <SignOutButton />
                </div>
              </AuthCheck>
            </nav>
            <AuthCheck>
              <header className="max-w-[700px] m-auto px-6 pb-7 flex justify-between items-center">
                <NavigationTabs />
                <Link href="/game/add">
                  <Button size="icon">
                    <PlusIcon />
                  </Button>
                </Link>
              </header>
            </AuthCheck>
            <div className="px-6 pb-12 max-w-[700px] m-auto">{children}</div>
            <Toaster position="top-center" />
          </body>
        </html>
      </TabProvider>
    </AuthProvider>
  )
}
