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
  startNavigation: () => void
  endNavigation: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()

  // Auto-end navigation when pathname changes
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])

  const startNavigation = useCallback(() => {
    setIsNavigating(true)
  }, [])

  const endNavigation = useCallback(() => {
    setIsNavigating(false)
  }, [])

  return (
    <NavigationContext.Provider
      value={{ isNavigating, startNavigation, endNavigation }}
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
