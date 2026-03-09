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

export function Link({
  children,
  onClick,
  href,
  scroll,
  ...props
}: NavLinkProps) {
  const { startNavigation } = useNavigation()
  const pathname = usePathname()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Preserve caller behavior first (some handlers intentionally prevent nav).
    onClick?.(e)
    if (e.defaultPrevented) return

    // Detect same-route vs route-change so we avoid unnecessary loader state.
    // Note: this simple check is intentional for our usage because `href` is
    // mostly string routes in this app.
    const targetPath = typeof href === "string" ? href : href.pathname || ""
    const isSameRoute = targetPath === pathname

    if (
      !e.ctrlKey &&
      !e.metaKey &&
      !e.shiftKey &&
      e.button === 0 && // left click
      !isSameRoute
    ) {
      // Regular link navigation should *not* restore scroll on destination.
      startNavigation(targetPath, { restoreScroll: false })
    }
  }

  return (
    // Default to scroll={false}; central restoration logic decides whether
    // destination should restore or reset based on navigation intent.
    <NextLink href={href} onClick={handleClick} scroll={scroll ?? false} {...props}>
      {children}
    </NextLink>
  )
}
