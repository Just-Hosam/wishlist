"use client"

import { Button } from "@/components/ui/button"
import { GameCategory } from "@prisma/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Spinner from "../ui/spinner"
import { toast } from "sonner"

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
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleMove = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/game/${gameId}/move`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          gameId,
          fromCategory,
          toCategory
        })
      })

      if (!response.ok) {
        throw new Error("Failed to move game")
      }

      toast.success("Game moved successfully!")
      router.refresh()
    } catch (error) {
      console.error("Error moving game:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      className="w-full justify-start"
      variant="ghost"
      onClick={handleMove}
      disabled={isLoading}
    >
      {isLoading ? (
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
