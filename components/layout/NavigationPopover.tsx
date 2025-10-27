"use client"

import { SignOutButton } from "@/components/layout/SignoutButton"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Info, Menu } from "lucide-react"
import Link from "next/link"
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
      <PopoverContent className="mr-4 w-fit">
        <div className="flex flex-col">
          <Link href="/about">
            <Button className="w-full justify-start" variant="ghost">
              <Info />
              About
            </Button>
          </Link>
          <SignOutButton />
        </div>
        <div className="mb-2 mt-1 rounded-full border-[0.5px]"></div>

        <div className="text-center text-xs text-gray-500">
          version {process.env.APP_VERSION}
        </div>
      </PopoverContent>
    </Popover>
  )
}
