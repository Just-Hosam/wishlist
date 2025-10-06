"use client"

import { SignOutButton } from "@/components/layout/SignoutButton"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Menu } from "lucide-react"
import { useState } from "react"

export default function NavigationPopover() {
  const [popoverOpen, setPopoverOpen] = useState(false)

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="mr-6 w-fit">
        <div className="flex flex-col">
          <SignOutButton />
        </div>
        <div className="mt-1 text-center text-xs text-gray-500">
          version {process.env.APP_VERSION}
        </div>
      </PopoverContent>
    </Popover>
  )
}
