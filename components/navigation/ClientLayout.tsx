"use client"

import { NavigationProvider } from "@/components/navigation/NavigationProvider"
import { GlobalLoader } from "@/components/navigation/GlobalLoader"
import { ReactNode } from "react"

export function ClientLayout({ children }: { children: ReactNode }) {
  return <NavigationProvider>{children}</NavigationProvider>
}
