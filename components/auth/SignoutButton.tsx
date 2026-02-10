"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LogOutIcon } from "lucide-react"
import { signOut } from "next-auth/react"

type SignOutButtonProps = {
  className?: string
}

export function SignOutButton({ className }: SignOutButtonProps) {
  return (
    <Button
      onClick={() => signOut()}
      variant="destructive"
      size="lg"
      className={cn("w-full justify-start", className)}
    >
      <LogOutIcon />
      Logout
    </Button>
  )
}
