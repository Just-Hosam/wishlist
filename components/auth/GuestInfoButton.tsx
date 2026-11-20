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
import { GuestAccountInfo } from "./GuestAccountInfo"

export function GuestInfoButton() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          type="button"
          className="relative -mt-1 px-3 py-3 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
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
