"use client"

import { useRouter } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  className?: string
}

export function BackButton({ className }: BackButtonProps) {
  const router = useRouter()

  return (
    <Button
      type="button"
      size="icon"
      onClick={() => router.back()}
      className={className}
      aria-label="Go back"
      title="Go back"
    >
      <ArrowLeft />
    </Button>
  )
}
