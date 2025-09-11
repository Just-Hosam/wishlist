"use client"

import {
  CircleCheckBig,
  FolderCheck,
  Menu,
  ScrollText,
  Skull,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import AuthCheck from "@/components/layout/AuthCheck"
import { SignOutButton } from "@/components/layout/SignoutButton"

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
          <div className="flex flex-col">
            <Link href="/wishlist" onClick={() => setPopoverOpen(false)}>
              <Button className="w-full justify-start" variant="ghost">
                <ScrollText />
                Wishlist
              </Button>
            </Link>
            <Link href="/owned" onClick={() => setPopoverOpen(false)}>
              <Button className="w-full justify-start" variant="ghost">
                <FolderCheck />
                Owned
              </Button>
            </Link>
            <Link href="/completed" onClick={() => setPopoverOpen(false)}>
              <Button className="w-full justify-start" variant="ghost">
                <CircleCheckBig />
                Completed
              </Button>
            </Link>
            <Link href="/graveyard" onClick={() => setPopoverOpen(false)}>
              <Button className="w-full justify-start" variant="ghost">
                <Skull />
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
