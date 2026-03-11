import Footer from "@/components/layout/Footer"
import { Header } from "@/components/layout/Header"
import { GlobalLoader } from "@/components/navigation/GlobalLoader"
import { NavigationProvider } from "@/components/navigation/NavigationProvider"
import { ScrollRestoration } from "@/components/navigation/ScrollRestoration"
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration"
import { AccentHydrator } from "@/components/theme/AccentHydrator"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { Montserrat, Open_Sans } from "next/font/google"
import { Suspense } from "react"
import "../styles/globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat"
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  preload: false
})

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: "Playward",
  title: {
    default: "Playward App",
    template: "%s | Playward"
  },
  description:
    "Playward is a game wishlist and backlog app for tracking games you want to play, own, and complete.",
  keywords: [
    "Playward",
    "Playward app",
    "game wishlist app",
    "video game tracker",
    "gaming backlog app"
  ],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "Playward",
    title: "Playward App",
    description:
      "Playward is a game wishlist and backlog app for tracking games you want to play, own, and complete.",
    images: [
      {
        url: "/screenshots/Wishlist.PNG",
        alt: "Playward wishlist app preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Playward App",
    description:
      "Playward is a game wishlist and backlog app for tracking games you want to play, own, and complete.",
    images: ["/screenshots/Wishlist.PNG"]
  }
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className={`${montserrat.variable} ${openSans.variable} font-mont text-base`}
      lang="en"
    >
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

        {/* <script
              crossOrigin="anonymous"
              src="//unpkg.com/react-scan/dist/auto.global.js"
            ></script> */}
      </head>
      <body>
        <ServiceWorkerRegistration />
        <AccentHydrator />
        <NavigationProvider>
          <Suspense fallback={null}>
            <ScrollRestoration />
          </Suspense>
          <Header />
          <main
            className="m-auto h-full max-w-[700px] overflow-y-auto px-4 pb-40 pt-[92px]"
            data-scroll-container
          >
            <GlobalLoader>{children}</GlobalLoader>
          </main>
          <Footer />
          <Toaster position="top-center" duration={2000} />
          <SpeedInsights />
          <Analytics />
        </NavigationProvider>
      </body>
    </html>
  )
}

function getSiteUrl() {
  const value =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXTAUTH_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL

  if (!value) return "http://localhost:3000"
  if (value.startsWith("http://") || value.startsWith("https://")) return value

  return value.startsWith("localhost") ? `http://${value}` : `https://${value}`
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
    </>
  )
}
