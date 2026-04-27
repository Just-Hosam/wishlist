"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight, Bell } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
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
  const [allowed, setAllowed] = useState(false)
  const [wishlistSales, setWishlistSales] = useState(false)
  const [wishlistAvailable, setWishlistAvailable] = useState(false)
  const [psMonthlyGames, setPsMonthlyGames] = useState(false)
  const [psCatalog, setPsCatalog] = useState(false)
  const [newFeatures, setNewFeatures] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      toast.success("Settings Updated!")
      setOpen(false)
    } catch (error) {
      console.error("Error moving game to library:", error)
      toast.error("Something went wrong.")
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
        </DrawerHeader>
        <form className="space-y-4">
          <div className="flex items-end justify-between">
            <header className="pl-1">
              <label className="text-sm font-medium" htmlFor="now-playing">
                Permissions
              </label>
              <p className="text-xs text-muted-foreground">
                Allow for push notifications
              </p>
            </header>
            <Switch
              id="now-playing"
              checked={allowed}
              onCheckedChange={setAllowed}
            ></Switch>
          </div>
          <div>
            <header className="mb-2 pl-1">
              <label className="text-sm font-medium">Notifications</label>
              <p className="text-xs text-muted-foreground">
                Which notifications do you want
              </p>
            </header>
            <div className="rounded-2xl bg-card px-5 py-4 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center">
                  <label
                    className="text-sm font-medium"
                    htmlFor="wishlist-games-on-sale"
                  >
                    On Sale
                  </label>
                  <Switch
                    id="wishlist-games-on-sale"
                    checked={wishlistSales}
                    onCheckedChange={setWishlistSales}
                    className="ml-auto"
                  />
                </div>
                <div className="flex items-center">
                  <label
                    className="text-sm font-medium"
                    htmlFor="wishlist-games-now-available"
                  >
                    Available
                  </label>
                  <Switch
                    id="wishlist-games-now-available"
                    checked={wishlistAvailable}
                    onCheckedChange={setWishlistAvailable}
                    className="ml-auto"
                  />
                </div>
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
                    className="ml-auto"
                  />
                </div>
                <div className="flex items-center">
                  <label
                    className="text-sm font-medium"
                    htmlFor="playstation-plus-game-catalog"
                  >
                    PS+ Game Catalog
                  </label>
                  <Switch
                    id="playstation-plus-game-catalog"
                    checked={psCatalog}
                    onCheckedChange={setPsCatalog}
                    className="ml-auto"
                  />
                </div>
                <div className="flex items-center">
                  <label className="text-sm font-medium" htmlFor="new-feature">
                    New features
                  </label>
                  <Switch
                    id="new-feature"
                    checked={newFeatures}
                    onCheckedChange={setNewFeatures}
                    className="ml-auto"
                  />
                </div>
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
      </DrawerContent>
    </Drawer>
  )
}
