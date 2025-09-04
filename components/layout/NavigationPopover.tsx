"use client"

import AuthCheck from "./AuthCheck"
import { Button } from "../ui/button"
import { Gamepad2, ListCheck, Menu, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import Link from "next/link"
import { SignOutButton } from "./SignoutButton"
import { useState } from "react"

export default function NavigationPopover() {
  const [popoverOpen, setPopoverOpen] = useState(false)

  return (
    <h1>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <AuthCheck>
          <PopoverTrigger asChild>
            <Button variant="ghost">
              <Menu />
            </Button>
          </PopoverTrigger>
        </AuthCheck>
        <PopoverContent className="w-fit mr-6">
          <div className="flex flex-col items-start">
            <Link href="/wishlist" onClick={() => setPopoverOpen(false)}>
              <Button className="w-full" variant="ghost">
                <ListCheck />
                Wishlist
              </Button>
            </Link>
            <Link href="/owned" onClick={() => setPopoverOpen(false)}>
              <Button className="w-full" variant="ghost">
                <Gamepad2 />
                Owned
              </Button>
            </Link>
            <Link href="/graveyard" onClick={() => setPopoverOpen(false)}>
              <Button className="w-full" variant="ghost">
                <Trash2 />
                Graveyard
              </Button>
            </Link>
            <SignOutButton />
          </div>
        </PopoverContent>
      </Popover>
    </h1>
  )
}
