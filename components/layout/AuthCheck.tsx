"use client"

import { useSession } from "next-auth/react"

interface Props {
  children: React.ReactNode
  showIfNotAuthenticated?: boolean
}

export default function AuthCheck({
  children,
  showIfNotAuthenticated = false,
}: Props) {
  const { data: session } = useSession()
  const isAuthenticated = !!session?.user

  // If showIfNotAuthenticated is true, show children only when NOT authenticated
  // If showIfNotAuthenticated is false (default), show children only when authenticated
  return <>{showIfNotAuthenticated !== isAuthenticated ? children : null}</>
}
