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
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import AuthCheck from "./AuthCheck"
import { SignOutButton } from "./SignoutButton"

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
                <ScrollText />
                Wishlist
              </Button>
            </Link>
            <Link href="/owned" onClick={() => setPopoverOpen(false)}>
              <Button className="w-full" variant="ghost">
                <FolderCheck />
                Owned
              </Button>
            </Link>
            <Link href="/completed" onClick={() => setPopoverOpen(false)}>
              <Button className="w-full" variant="ghost">
                <CircleCheckBig />
                Completed
              </Button>
            </Link>
            <Link href="/graveyard" onClick={() => setPopoverOpen(false)}>
              <Button className="w-full" variant="ghost">
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
