"use client"

import { BackButton } from "./BackButton"

interface PageHeaderProps {
  pageName: string
  showBackButton?: boolean
  children?: React.ReactNode
}

export function PageHeader({
  pageName,
  showBackButton,
  children
}: PageHeaderProps) {
  return (
    <nav className="absolute left-0 right-0 top-0 z-30 m-auto flex min-h-[68px] max-w-[1200px] items-center justify-between gap-6 bg-white px-6 pb-4 pt-3">
      <div className="flex items-center gap-2">
        {showBackButton && <BackButton />}
        <h1 className="text-2xl font-medium">{pageName || "Playward"}</h1>
      </div>

      {children}
    </nav>
  )
}
