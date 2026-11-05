"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import Image from "next/image"

export function GoogleSigninButton() {
  return (
    <Button onClick={() => signIn("google")} size="lg" className="w-full gap-3">
      <Image
        src="/logos/google.svg"
        alt="Google Logo"
        width={16}
        height={16}
        unoptimized
      ></Image>
      <p className="text-base">Login with Google</p>
    </Button>
  )
}
