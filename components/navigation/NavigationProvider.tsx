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
import { dispatchNavigationSaveEvent } from "./navigation-events"

interface NavigationContextType {
  isNavigating: boolean
  pendingPathname: string | null
  // Centralized navigation entry point used by custom Link/useRouter wrappers.
  // It emits a pre-navigation save event so scroll state is captured
  // synchronously before loader rendering can alter layout/scroll positions.
  startNavigation: (
    targetPathname: string,
    options?: { restoreScroll?: boolean }
  ) => void
  endNavigation: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false)
  const [pendingPathname, setPendingPathname] = useState<string | null>(null)
  const pathname = usePathname()

  // When Next reports a new pathname, we consider navigation complete.
  // This keeps the global loader lifetime tied to actual route transitions.
  useEffect(() => {
    setIsNavigating(false)
    setPendingPathname(null)
  }, [pathname])

  // Failsafe: if something goes wrong during navigation, do not leave
  // the loading spinner stuck forever.
  useEffect(() => {
    if (isNavigating) {
      const timeoutId = setTimeout(() => {
        setIsNavigating(false)
        setPendingPathname(null)
      }, 5000) // 5 seconds

      return () => clearTimeout(timeoutId)
    }
  }, [isNavigating])

  const startNavigation = useCallback(
    (targetPathname: string, options?: { restoreScroll?: boolean }) => {
      // Emit before any state updates so listeners can read current scroll
      // while old content is still mounted and measurable.
      dispatchNavigationSaveEvent({
        restoreScroll: options?.restoreScroll ?? false
      })
      setPendingPathname(targetPathname)
      setIsNavigating(true)
    },
    []
  )

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
