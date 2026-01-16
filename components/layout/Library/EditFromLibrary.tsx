"use client"

import { saveGame } from "@/server/actions/game"
import { GameInput, GameOutput } from "@/types"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "../../ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "../../ui/drawer"
import Counter from "@/components/ui/counter"

interface Props {
  game: GameOutput
  children: React.ReactNode
}

export default function EditFromLibrary({ game, children }: Props) {
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
      console.error("Error saving game to library:", error)
      toast.error("Failed to add game to library.")
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
            <DrawerDescription>Configure your settings.</DrawerDescription>
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
