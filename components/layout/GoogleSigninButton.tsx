"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import Image from "next/image"

export function GoogleSigninButton() {
  return (
    <div className="mx-auto w-fit">
      <Button
        onClick={() => signIn("google")}
        variant="outline"
        className="gap-3 rounded-lg p-6"
      >
        <Image
          src="/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
        ></Image>
        <p className="text-base">Login with Google</p>
      </Button>
    </div>
  )
}
