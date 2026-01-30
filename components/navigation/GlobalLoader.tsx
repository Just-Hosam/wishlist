"use client"

import Spinner from "../ui/spinner"
import { useNavigation } from "./NavigationProvider"

export function GlobalLoader({ children }: { children: React.ReactNode }) {
  const { isNavigating } = useNavigation()

  if (isNavigating) {
    return (
      <div className="custom-fade-in flex min-h-[400px] items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return <>{children}</>
}
