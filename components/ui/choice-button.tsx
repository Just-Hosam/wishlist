"use client"

import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ChoiceButtonProps extends Omit<ButtonProps, "asChild"> {
  selected: boolean
}

export function ChoiceButton({
  selected,
  className,
  onClick,
  ...props
}: ChoiceButtonProps) {
  const runScaleAnimation = (element: HTMLElement | null) => {
    if (!element?.animate) return

    element.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.80)" },
        { transform: "scale(1)" }
      ],
      { duration: 200, easing: "ease-in-out" }
    )
  }

  return (
    <Button
      type="button"
      size="xl"
      {...props}
      aria-pressed={selected}
      onClick={(event) => {
        runScaleAnimation(event.currentTarget)
        onClick?.(event)
      }}
      className={cn(
        "min-w-0 flex-1 rounded-xl border-2",
        selected ? "border-accent bg-accent/10" : "border-transparent",
        className
      )}
    />
  )
}
