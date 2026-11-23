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
import { TriangleAlert } from "lucide-react"
import { getSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { GuestAccountInfo } from "./GuestAccountInfo"

export function GuestInfoButton() {
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function checkGuestAccount() {
      try {
        const session = await getSession()

        if (!cancelled) {
          setIsGuest(
            Boolean(
              session?.user?.id &&
                session.user.name === "Guest" &&
                !session.user.email
            )
          )
        }
      } catch (error) {
        console.error("Failed to check guest account:", error)
      }
    }

    void checkGuestAccount()

    return () => {
      cancelled = true
    }
  }, [])

  if (!isGuest) return null

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="relative -mt-1 px-3 py-3 text-amber-600"
          aria-label="About guest accounts"
        >
          <TriangleAlert strokeWidth={2.3} aria-hidden="true" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Explore as a Guest</DrawerTitle>
        </DrawerHeader>
        <GuestAccountInfo />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button size="lg" variant="ghost">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
