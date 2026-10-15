"use client"

import { useEffect } from "react"

export function ButtonClickAnimation() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return

      const button = event.target.closest<HTMLElement>(
        "button, [role='button'], [data-button]"
      )
      if (
        !button?.animate ||
        button.matches(":disabled, [aria-disabled='true']") ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return
      }

      // Animate scale separately to preserve positioning transforms.
      button.animate([{ scale: "1" }, { scale: "0.8" }, { scale: "1" }], {
        duration: 200,
        easing: "ease-in-out"
      })
    }

    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [])

  return null
}
