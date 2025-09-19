"use client"

import AuthCheck from "@/components/layout/AuthCheck"
import { SignOutButton } from "@/components/layout/SignoutButton"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Menu, Settings } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function NavigationPopover() {
  const [popoverOpen, setPopoverOpen] = useState(false)

  return (
    <h1>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <AuthCheck>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </PopoverTrigger>
        </AuthCheck>
        <PopoverContent className="mr-6 w-fit">
          <div className="flex flex-col">
            <SignOutButton />
          </div>
        </PopoverContent>
      </Popover>
    </h1>
  )
}
