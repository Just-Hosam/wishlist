import { LoaderCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: number
  className?: string
}

export default function Spinner({ size = 50, className }: SpinnerProps) {
  return (
    <div className="duration-500 animate-in fade-in zoom-in-95">
      <LoaderCircle
        size={size}
        className={cn("mx-auto my-28 animate-spin", className)}
      />
    </div>
  )
}
