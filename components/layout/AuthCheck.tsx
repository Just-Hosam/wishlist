"use client"

import { useSession } from "next-auth/react"

interface Props {
  children: React.ReactNode
  showIfNotAuthenticated?: boolean
  fallback?: React.ReactNode
}

export default function AuthCheck({
  children,
  showIfNotAuthenticated = false,
  fallback = null
}: Props) {
  const { data: session, status } = useSession()
  const isLoading = status === "loading"
  const isAuthenticated = !!session?.user

  if (isLoading && fallback) return <>{fallback}</>

  // If showIfNotAuthenticated is true, show children only when NOT authenticated
  // If showIfNotAuthenticated is false (default), show children only when authenticated
  return <>{showIfNotAuthenticated !== isAuthenticated ? children : null}</>
}
