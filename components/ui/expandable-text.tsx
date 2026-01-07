"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

const CLAMP_CLASSES: Record<number, string> = {
  1: "line-clamp-1",
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6"
}

interface ExpandableTextProps {
  text: string
  lineClamp?: number
  className?: string
}

export function ExpandableText({
  text,
  lineClamp = 4,
  className
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const clampClass = CLAMP_CLASSES[lineClamp] || "line-clamp-4"
  return (
    <p
      className={cn(!isExpanded && clampClass, className)}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {text}
    </p>
  )
}
