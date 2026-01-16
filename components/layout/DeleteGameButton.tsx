"use client"

import { Button } from "@/components/ui/button"
import { deleteGame } from "@/server/actions/game"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "../ui/drawer"

interface Props {
  gameId: string
  navigateTo: string
  children: React.ReactNode
}

export default function DeleteGameButton({
  gameId,
  navigateTo,
  children
}: Props) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteGame(gameId)
        router.push(navigateTo)
        setIsOpen(false)
        toast.success("Game deleted successfully!")
      } catch (error) {
        console.error("Error deleting game:", error)
        toast.error(
          error instanceof Error ? error.message : "Failed to delete game."
        )
      }
    })
  }

  return (
    <Drawer open={isOpen} onOpenChange={(next) => setIsOpen(next)}>
      <DrawerTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <div className="px-2">
          <DrawerHeader>
            <DrawerTitle>Delete Game</DrawerTitle>
            <DrawerDescription>
              Are you sure you want to delete this game?
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button
              disabled={isPending}
              onClick={handleDelete}
              variant="destructive"
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
            <DrawerClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
