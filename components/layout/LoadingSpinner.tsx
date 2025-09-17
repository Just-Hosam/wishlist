import { LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: number
  className?: string
}

export default function LoadingSpinner({
  size = 50,
  className,
}: LoadingSpinnerProps) {
  return (
    <LoaderCircle
      size={size}
      className={cn("animate-spin my-12 mx-auto", className)}
    />
  )
}
