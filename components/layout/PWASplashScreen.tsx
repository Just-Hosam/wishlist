"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function PWASplashScreen() {
  const [isVisible, setIsVisible] = useState(false)
  const [isPWA, setIsPWA] = useState(false)

  useEffect(() => {
    // Check if running as PWA (standalone mode)
    const checkPWAMode = () => {
      const isStandalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches
      const isIOSStandalone = (window.navigator as any).standalone === true
      return isStandalone || isIOSStandalone
    }

    const pwaMode = checkPWAMode()
    setIsPWA(pwaMode)

    // Only show splash screen if running as PWA
    if (pwaMode) {
      setIsVisible(true)

      // Hide splash screen after a short delay
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 1500) // 1.5 seconds

      return () => clearTimeout(timer)
    }
  }, [])

  // Don't render anything if not PWA or not visible
  if (!isPWA || !isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex animate-pulse flex-col items-center gap-4">
        <Image
          src="/favicon/favicon.svg"
          alt="GamesList"
          width={120}
          height={120}
          className="drop-shadow-lg"
        />
        <h1 className="text-2xl font-semibold text-gray-800">GamesList</h1>
      </div>
    </div>
  )
}
