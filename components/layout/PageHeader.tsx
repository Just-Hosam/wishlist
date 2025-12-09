"use client"

import { BackButton } from "./BackButton"

interface PageHeaderProps {
  pageName?: string
  showBackButton?: boolean
  children?: React.ReactNode
}

export function PageHeader({
  pageName,
  showBackButton,
  children
}: PageHeaderProps) {
  return (
    <nav className="absolute left-0 right-0 top-0 z-30 m-auto flex min-h-[76px] max-w-[1200px] items-center justify-between gap-3 bg-[#fafafa] px-6 pb-4 pt-5">
      {(showBackButton || pageName) && (
        <div className="flex items-center gap-3">
          {showBackButton && <BackButton />}
          {pageName && (
            <h1
              className={`${showBackButton ? "text-xl" : "text-3xl font-semibold"}`}
            >
              {pageName}
            </h1>
          )}
        </div>
      )}

      {!!children && children}
    </nav>
  )
}
