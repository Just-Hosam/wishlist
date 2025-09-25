"use client"

import { useState } from "react"
import { redirect, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { useTabContext } from "@/contexts/TabContext"

interface Props {
  gameId: string
}

export default function DeleteGameButton({ gameId }: Props) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const deleteGame = async () => {
    try {
      setIsDeleting(true)

      const response = await fetch(`/api/game/${gameId}`, {
        method: "DELETE"
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete game")
      }

      toast.success("Game deleted successfully!")

      setIsOpen(false)

      router.refresh()
    } catch (error) {
      console.error("Error deleting game:", error)
      toast.error(
        error instanceof Error ? error.message : "Failed to delete game"
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="justify-start text-destructive" variant="ghost">
          <Trash2 />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this game from your collection. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

          <Button
            disabled={isDeleting}
            variant="destructive"
            onClick={deleteGame}
          >
            {isDeleting ? "Deleting..." : "Delete Game"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
