"use client"

import { Button } from "@/components/ui/button"
import { moveGame } from "@/server/actions/game"
import { GameCategory } from "@/types"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import Spinner from "../ui/spinner"

interface MoveGameButtonProps {
  gameId: string
  fromCategory: GameCategory
  toCategory: GameCategory
  buttonText: string
  icon: React.ReactNode
}

export default function MoveGameButton({
  gameId,
  fromCategory,
  toCategory,
  buttonText,
  icon
}: MoveGameButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleMove = () => {
    startTransition(async () => {
      try {
        await moveGame(gameId, toCategory)
        toast.success("Game moved successfully!")
        router.refresh()
      } catch (error) {
        console.error("Error moving game:", error)
        toast.error("Failed to move game")
      }
    })
  }

  return (
    <Button
      className="w-full justify-start"
      variant="ghost"
      onClick={handleMove}
      disabled={isPending}
    >
      {isPending ? (
        <Spinner />
      ) : (
        <>
          {icon}
          {buttonText}
        </>
      )}
    </Button>
  )
}
