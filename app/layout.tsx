import FooterWrapper from "@/components/layout/FooterWrapper"
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next"
import "../styles/globals.css"
import { Header } from "@/components/layout/Header"
import { NavigationProvider } from "@/components/navigation/NavigationProvider"
import { GlobalLoader } from "@/components/navigation/GlobalLoader"

export const metadata: Metadata = {
  title: "Playward",
  description:
    "Manage your game wishlists with ease. Track games you want to play, own, and have completed."
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
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

        <PWAConfig />

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
        <NavigationProvider>
          <Header />
          <div
            className="m-auto mt-[76px] max-w-[700px] overflow-y-auto px-6 pb-40 pt-3"
            style={{ height: "calc(100% - 76px)" }}
            data-scroll-container
          >
            <GlobalLoader>{children}</GlobalLoader>
          </div>
          <FooterWrapper />
          <Toaster position="top-center" />
        </NavigationProvider>
      </body>
    </html>
  )
}

function PWAConfig() {
  return (
    <>
      {/* iOS PWA Configuration */}
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <meta name="apple-mobile-web-app-title" content="Playward" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-2048-2732.jpg"
        media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1668-2388.jpg"
        media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1536-2048.jpg"
        media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1640-2360.jpg"
        media="(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1668-2224.jpg"
        media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1620-2160.jpg"
        media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1488-2266.jpg"
        media="(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1320-2868.jpg"
        media="(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1206-2622.jpg"
        media="(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1260-2736.jpg"
        media="(device-width: 420px) and (device-height: 912px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1290-2796.jpg"
        media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1179-2556.jpg"
        media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1170-2532.jpg"
        media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1284-2778.jpg"
        media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1125-2436.jpg"
        media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1242-2688.jpg"
        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-828-1792.jpg"
        media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-1242-2208.jpg"
        media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-750-1334.jpg"
        media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="/pwa/apple-splash-640-1136.jpg"
        media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      />

      {/* Android PWA Configuration */}
      <meta name="mobile-web-app-capable" content="yes" />

      {/* General PWA Configuration */}
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=cover"
      />
      <link rel="manifest" href="manifest.json" />
    </>
  )
}
