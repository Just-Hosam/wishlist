"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "@/components/navigation"
import { cn } from "@/lib/utils"

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
    >
      <ArrowLeft />
    </Button>
  )
}
