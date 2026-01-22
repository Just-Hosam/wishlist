"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect
} from "react"
import { usePathname } from "next/navigation"

interface NavigationContextType {
  isNavigating: boolean
  pendingPathname: string | null
  startNavigation: (targetPathname: string) => void
  endNavigation: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [pendingPathname, setPendingPathname] = useState<string | null>(null)
  const pathname = usePathname()

  // Auto-end navigation when pathname changes
  useEffect(() => {
    setIsNavigating(false)
    setPendingPathname(null)
  }, [pathname])

  // Timeout to prevent spinner from showing indefinitely
  useEffect(() => {
    if (isNavigating) {
      const timeoutId = setTimeout(() => {
        setIsNavigating(false)
        setPendingPathname(null)
      }, 5000) // 5 seconds

      return () => clearTimeout(timeoutId)
    }
  }, [isNavigating])

  const startNavigation = useCallback((targetPathname: string) => {
    setPendingPathname(targetPathname)
    setIsNavigating(true)
  }, [])

  const endNavigation = useCallback(() => {
    setIsNavigating(false)
  }, [])

  return (
    <NavigationContext.Provider
      value={{ isNavigating, pendingPathname, startNavigation, endNavigation }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider")
  }
  return context
}
