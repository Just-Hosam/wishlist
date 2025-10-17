"use client"

import { Button } from "@/components/ui/button"
import Spinner from "@/components/ui/spinner"
import { toggleNowPlaying } from "@/server/actions/game"
import { PlayCircle, StopCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"

interface ToggleNowPlayingButtonProps {
  gameId: string
  nowPlaying: boolean
}

export default function ToggleNowPlayingButton({
  gameId,
  nowPlaying
}: ToggleNowPlayingButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const label = nowPlaying ? "Stop playing" : "Start playing"
  const Icon = nowPlaying ? StopCircle : PlayCircle

  const handleToggle = () => {
    startTransition(async () => {
      try {
        const nextNowPlaying = await toggleNowPlaying(gameId)
        toast.success(nextNowPlaying ? "Started playing." : "Stopped playing.")
        router.refresh()
      } catch (error) {
        console.error("Error toggling now playing status:", error)
        toast.error("Failed to update now playing status.")
      }
    })
  }

  return (
    <Button
      className="w-full justify-start"
      variant="ghost"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPending ? (
        <Spinner />
      ) : (
        <>
          <Icon />
          {label}
        </>
      )}
    </Button>
  )
}
