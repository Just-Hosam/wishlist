import AuthCheck from "@/components/layout/AuthCheck"
import AuthProvider from "@/components/layout/AuthProvider"
import NavigationPopover from "@/components/layout/NavigationPopover"
import NavigationTabs from "@/components/layout/NavigationTabs"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/sonner"
import { TabProvider } from "@/contexts/TabContext"
import { Gamepad2, PlusIcon } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import "../styles/globals.css"

export const metadata: Metadata = {
  title: "GamesList",
  description:
    "Manage your game wishlists with ease. Track games you want to play, own, and have completed."
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AuthProvider>
      <TabProvider>
        <html className="font-mont text-base" lang="en">
          <head>
            <link
              rel="icon"
              type="image/png"
              href="/favicon/favicon-96x96.png"
              sizes="96x96"
            />
            <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
            <link rel="shortcut icon" href="/favicon/favicon.ico" />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/favicon/apple-touch-icon.png"
            />
            <meta name="apple-mobile-web-app-title" content="GamesList" />

            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
              href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
              rel="stylesheet"
            />
            {/* <script
              crossOrigin="anonymous"
              src="//unpkg.com/react-scan/dist/auto.global.js"
            ></script> */}
          </head>
          <body>
            <nav className="sticky left-0 right-0 top-0 m-auto flex max-w-[1200px] items-center justify-between gap-6 bg-white px-6 py-6">
              <h1 className="flex items-center gap-2 text-xl">
                <Gamepad2 />
                GamesList
              </h1>
              <AuthCheck>
                <NavigationPopover />
              </AuthCheck>
            </nav>
            <AuthCheck>
              <header className="m-auto flex max-w-[700px] items-center justify-between px-6 pb-7">
                <NavigationTabs />
                <Link href="/game/add">
                  <Button size="icon">
                    <PlusIcon />
                  </Button>
                </Link>
              </header>
            </AuthCheck>
            <div className="m-auto max-w-[700px] px-6 pb-12">{children}</div>
            <Toaster position="top-center" />
          </body>
        </html>
      </TabProvider>
    </AuthProvider>
  )
}
