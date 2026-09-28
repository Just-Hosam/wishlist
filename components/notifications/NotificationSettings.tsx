"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  getNotificationSettings,
  saveNotificationSettings
} from "@/server/actions/notifications"
import { ArrowRight, Bell } from "lucide-react"
import { useEffect, useState } from "react"
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
import { Switch } from "../ui/switch"

interface Props {
  className?: string
}

export function NotificationSettings({ className }: Props) {
  const [open, setOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [psMonthlyGames, setPsMonthlyGames] = useState(false)

  useEffect(() => {
    if (!open) return

    let cancelled = false

    async function loadSettings() {
      setIsLoading(true)

      try {
        const settings = await getNotificationSettings()

        if (!cancelled) {
          setPsMonthlyGames(settings.playstationPlusMonthlyGames)
        }
      } catch (error) {
        console.error("Error loading notification settings:", error)
        toast.error("Failed to load notification settings.")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadSettings()

    return () => {
      cancelled = true
    }
  }, [open])

  const handleSave = async () => {
    setIsSaving(true)

    try {
      await saveNotificationSettings({
        playstationPlusMonthlyGames: psMonthlyGames
      })

      toast.success("Settings Updated!")
      setOpen(false)
    } catch (error) {
      console.error("Error saving notification settings:", error)
      toast.error("Failed to save notification settings.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={(next) => setOpen(next)}>
      <DrawerTrigger asChild>
        <Button className={cn("w-full justify-between", className)} size="xl">
          <Bell />
          Notifications
          <ArrowRight className="ml-auto text-muted-foreground" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Notifications</DrawerTitle>
          <DrawerDescription>
            Manage your notification preferences
          </DrawerDescription>
        </DrawerHeader>
        <form className="space-y-4">
          <div className="rounded-2xl bg-card px-5 py-4 shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center">
                <label
                  className="text-sm font-medium"
                  htmlFor="playstation-plus-monthly-games"
                >
                  PS+ Monthly Games
                </label>
                <Switch
                  id="playstation-plus-monthly-games"
                  checked={psMonthlyGames}
                  onCheckedChange={setPsMonthlyGames}
                  disabled={isLoading}
                  className="ml-auto"
                />
              </div>
            </div>
          </div>
        </form>

        <DrawerFooter>
          <Button
            size="lg"
            disabled={isLoading || isSaving}
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
      </DrawerContent>
    </Drawer>
  )
}
