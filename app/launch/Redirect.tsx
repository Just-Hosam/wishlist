"use client"

import { useRouter } from "@/components/navigation"
import { useEffect } from "react"

export default function Redirect() {
  const router = useRouter()

  useEffect(() => {
    router.prefetch("/wishlist")

    let frame2 = 0
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => {
        router.replace("/wishlist")
      })
    })

    return () => {
      cancelAnimationFrame(frame1)
      cancelAnimationFrame(frame2)
    }
  }, [router])

  return null
}
