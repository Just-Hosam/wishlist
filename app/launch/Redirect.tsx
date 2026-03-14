"use client"

import { useRouter } from "@/components/navigation"
import { useEffect } from "react"

export default function Redirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/wishlist")
  }, [router])

  return null
}
