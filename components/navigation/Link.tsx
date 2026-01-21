"use client"

import NextLink, { LinkProps } from "next/link"
import { useNavigation } from "./NavigationProvider"
import { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react"
import { usePathname } from "next/navigation"

interface NavLinkProps
  extends LinkProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  children: ReactNode
}

export function Link({ children, onClick, href, ...props }: NavLinkProps) {
  const { startNavigation } = useNavigation()
  const pathname = usePathname()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Only trigger loading for client-side navigation
    // Skip if it's a new tab, external link, has modifiers, or navigating to current route
    const targetPath = typeof href === "string" ? href : href.pathname || ""
    const isSameRoute = targetPath === pathname

    if (
      !e.ctrlKey &&
      !e.metaKey &&
      !e.shiftKey &&
      e.button === 0 && // left click
      !isSameRoute
    ) {
      startNavigation()
    }

    onClick?.(e)
  }

  return (
    <NextLink href={href} onClick={handleClick} {...props}>
      {children}
    </NextLink>
  )
}
