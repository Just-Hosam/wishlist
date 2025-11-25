"use client"

import { cn } from "@/lib/utils"
import { BackButton } from "./BackButton"

interface PageHeaderProps {
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ children, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "sticky top-[68px] z-40 mx-[-24px] flex min-h-[60px] items-center gap-3 bg-white px-[24px] pb-4",
        className
      )}
    >
      <BackButton />
      {children}
    </div>
  )
}
