"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import { Info, Users } from "lucide-react"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"

export function GuestSigninButton() {
  const [open, setOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const handleContinue = async () => {
    setIsCreating(true)

    try {
      const result = await signIn("guest", { redirect: false })

      if (result?.error) throw new Error("Guest login failed")

      window.location.assign("/wishlist")
    } catch (error) {
      console.error("Error creating guest account:", error)
      toast.error("Failed to create guest account. Please try again.")
      setIsCreating(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} dismissible={!isCreating}>
      <DrawerTrigger asChild>
        <Button variant="accent" size="lg" className="w-full gap-3">
          <Users />
          <p className="text-base">Continue as Guest</p>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Explore as a Guest</DrawerTitle>
        </DrawerHeader>
        <div className="rounded-2xl border bg-zinc-200 px-5 py-4 text-sm text-foreground shadow-sm">
          <header className="flex items-center gap-2">
            <Info
              className="size-[20px] shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <p className="font-semibold">Changes are temporary</p>
          </header>
          <p className="mt-4 text-sm text-muted-foreground">
            Add, remove, and organize games freely. Your changes will reset when
            you log out or at the end of the day.
          </p>
        </div>
        <DrawerFooter>
          <Button
            size="lg"
            variant="accent"
            disabled={isCreating}
            onClick={handleContinue}
          >
            {isCreating ? "Creating account..." : "Continue as Guest"}
          </Button>
          <DrawerClose asChild>
            <Button size="lg" variant="ghost" disabled={isCreating}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
