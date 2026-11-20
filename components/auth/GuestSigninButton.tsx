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
import { Users } from "lucide-react"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { toast } from "sonner"

import { GuestAccountInfo } from "./GuestAccountInfo"

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

        <GuestAccountInfo />

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
