"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Trigger
    ref={ref}
    className={cn("z-50", className)}
    {...props}
  />
))
PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName

const PopoverAnchor = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Anchor>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Anchor>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Anchor
    ref={ref}
    className={cn("z-50", className)}
    {...props}
  />
))
PopoverAnchor.displayName = PopoverPrimitive.Anchor.displayName

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    darkBlur?: boolean
  }
>(
  (
    {
      darkBlur = false,
      className,
      align = "center",
      sideOffset = 6,
      collisionPadding = 12,
      ...props
    },
    ref
  ) => (
    <>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Close asChild>
          <button
            type="button"
            className={cn(
              "fixed inset-0 z-40 cursor-default appearance-none border-0 p-0",
              darkBlur ? "bg-black/80 backdrop-blur-sm" : "bg-transparent"
            )}
            aria-hidden
            tabIndex={-1}
          />
        </PopoverPrimitive.Close>
      </PopoverPrimitive.Portal>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          collisionPadding={collisionPadding}
          className={cn(
            "z-50 w-72 rounded-2xl bg-card px-3 py-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          {...props}
        />
      </PopoverPrimitive.Portal>
    </>
  )
)
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent }
