"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

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

  return (
    <p
      className={cn(
        "whitespace-pre-line",
        !isExpanded &&
          "overflow-hidden [-webkit-box-orient:vertical] [display:-webkit-box]",
        className
      )}
      style={!isExpanded ? { WebkitLineClamp: lineClamp } : undefined}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {text}
    </p>
  )
}
