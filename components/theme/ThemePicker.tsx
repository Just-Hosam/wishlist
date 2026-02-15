"use client"

import { toast } from "sonner"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "../ui/drawer"
import { CircleCheckBig } from "lucide-react"
import { Accent, ACCENT_STORAGE_KEY } from "@/types/theme"

interface Props {
  children: React.ReactNode
}

export function ThemePicker({ children }: Props) {
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [accent, setAccent] = useState<Accent>(Accent.PURPLE)

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(ACCENT_STORAGE_KEY)

      const isValidAccent = Object.values(Accent).includes(saved as Accent)

      if (!saved && !isValidAccent) {
        setAccent(Accent.PURPLE)
      } else {
        setAccent(saved as Accent)
      }
    } catch {
      document.documentElement.dataset.accent = Accent.PURPLE
    }
  }, [])

  const handleSave = async () => {
    setIsSaving(true)

    try {
      document.documentElement.dataset.accent = accent
      window.localStorage.setItem(ACCENT_STORAGE_KEY, accent)

      toast.success("Settings Updated!")
      setOpen(false)
    } catch (error) {
      document.documentElement.dataset.accent = Accent.PURPLE

      console.error("Error moving game to library:", error)
      toast.error("Something went wrong.")
    } finally {
      setIsSaving(false)
    }
  }

  const runScaleAnimation = (element: HTMLElement | null) => {
    if (!element?.animate) return

    element.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(0.80)" },
        { transform: "scale(1)" }
      ],
      { duration: 200, easing: "ease-in-out" }
    )
  }

  const handleAccentClick = (
    accentValue: Accent,
    element: HTMLElement | null
  ) => {
    setAccent(accentValue)
    runScaleAnimation(element)
  }

  return (
    <Drawer open={open} onOpenChange={(next) => setOpen(next)}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <div className="px-2">
          <DrawerHeader>
            <DrawerTitle>Theme</DrawerTitle>
          </DrawerHeader>
          <form className="space-y-6 px-4 pb-5 pt-3">
            <div>
              <label className="text-sm font-medium">Accent</label>
              <p className="text-xs text-muted-foreground">
                Accent color used across the app.
              </p>
              <div className="mt-3 flex items-stretch justify-stretch gap-2">
                <div
                  className="grid h-[55px] flex-1 place-items-center rounded-2xl bg-[hsl(var(--accent-purple))]"
                  onClick={(event) =>
                    handleAccentClick(Accent.PURPLE, event.currentTarget)
                  }
                >
                  {accent === Accent.PURPLE && (
                    <CircleCheckBig
                      size={20}
                      className="custom-fade-in text-accent-foreground"
                    />
                  )}
                </div>
                <div
                  className="grid h-[55px] flex-1 place-items-center rounded-2xl bg-[hsl(var(--accent-orange))]"
                  onClick={(event) =>
                    handleAccentClick(Accent.ORANGE, event.currentTarget)
                  }
                >
                  {accent === Accent.ORANGE && (
                    <CircleCheckBig
                      size={20}
                      className="custom-fade-in text-accent-foreground"
                    />
                  )}
                </div>
                <div
                  className="grid h-[55px] flex-1 place-items-center rounded-2xl bg-[hsl(var(--accent-pink))]"
                  onClick={(event) =>
                    handleAccentClick(Accent.PINK, event.currentTarget)
                  }
                >
                  {accent === Accent.PINK && (
                    <CircleCheckBig
                      size={20}
                      className="custom-fade-in text-accent-foreground"
                    />
                  )}
                </div>
                <div
                  className="grid h-[55px] flex-1 place-items-center rounded-2xl bg-[hsl(var(--accent-blue))]"
                  onClick={(event) =>
                    handleAccentClick(Accent.BLUE, event.currentTarget)
                  }
                >
                  {accent === Accent.BLUE && (
                    <CircleCheckBig
                      size={20}
                      className="custom-fade-in text-accent-foreground"
                    />
                  )}
                </div>
              </div>
            </div>
          </form>

          <DrawerFooter>
            <Button
              size="lg"
              disabled={isSaving}
              variant="accent"
              onClick={handleSave}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <DrawerClose asChild>
              <Button size="lg" variant="ghost">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
