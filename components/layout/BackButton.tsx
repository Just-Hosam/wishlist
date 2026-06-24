"use client"

import { Link, useRouter } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  className?: string
  href?: string
}

export function BackButton({ className, href }: BackButtonProps) {
  const router = useRouter()

  if (href) {
    return (
      <Button
        asChild
        size="icon"
        className={cn("rounded-full shadow-md", className)}
      >
        <Link href={href} aria-label="Go to link" title="Go to link">
          <ArrowLeft />
        </Link>
      </Button>
    )
  }

  return (
    <Button
      type="button"
      size="icon"
      onClick={() => router.back()}
      className={cn("rounded-full shadow-md", className)}
      aria-label="Go back"
      title="Go back"
    >
      <ArrowLeft />
    </Button>
  )
}
