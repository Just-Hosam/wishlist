"use client"

import { Button } from "@/components/ui/button"
import { LogOutIcon } from "lucide-react"
import { signOut } from "next-auth/react"

export function SignOutButton() {
  return (
    <Button onClick={() => signOut()} variant="ghost" className="justify-start">
      <LogOutIcon />
      Logout
    </Button>
  )
}
