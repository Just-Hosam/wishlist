"use client"

import { useRouter } from "@/components/navigation"
import Spinner from "@/components/ui/spinner"
import { useEffect } from "react"

export default function LaunchPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/wishlist")
  }, [router])

  return (
    <div className="custom-fade-in flex min-h-[400px] items-center justify-center">
      <Spinner className="my-0" />
    </div>
  )
}
