"use client"

import { useRouter } from "@/components/navigation"
import Counter from "@/components/ui/counter"
import { saveGame } from "@/server/actions/game"
import { GameInput, GameOutput } from "@/types"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../../ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "../../ui/drawer"

interface Props {
  game: GameOutput
  children: React.ReactNode
}

export default function EditFromCompleted({ game, children }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [timeToBeat, setTimeToBeat] = useState<number | null>(game.length)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const gameInput: GameInput = {
        ...game,
        length: timeToBeat
      }

      await saveGame(gameInput, game.id)

      toast.success("Game saved!")
      setOpen(false)
      router.refresh()
    } catch (error) {
      console.error("Error saving game to completed:", error)
      toast.error("Failed to add game to completed.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={(next) => setOpen(next)}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => setOpen(true)}
        >
          {children}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="px-2">
          <DrawerHeader>
            <DrawerTitle>Edit Game</DrawerTitle>
          </DrawerHeader>
          <form className="px-4 pb-5 pt-3">
            <label className="text-sm font-medium">Time to Beat</label>
            <p className="mb-2 text-xs text-muted-foreground">
              Enter the length in hours.
            </p>
            <Counter
              value={timeToBeat}
              onChange={(value) => setTimeToBeat(value)}
            />
          </form>

          <DrawerFooter>
            <Button disabled={isSaving} onClick={handleSave}>
              {isSaving ? "Saving..." : "Save"}
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
