"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { deleteGame } from "@/server/actions/game"
import { useRouter } from "@/components/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
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
  className?: string
}

export default function DeleteGameButton({
  gameId,
  navigateTo,
  className
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
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className={cn("justify-start text-destructive", className)}
          onClick={() => setIsOpen(true)}
        >
          <Trash2 />
          Delete
        </Button>
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
