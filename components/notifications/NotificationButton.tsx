"use client"

import { Bell } from "lucide-react"
import { Link } from "../navigation"

export default function NotificationButton() {
  return (
    <Link className="relative -mr-1 px-2 py-3" href="/notifications">
      <Bell strokeWidth={2.3} />
      {true ? (
        <span className="absolute right-2 top-[9px] size-[10px] rounded-full bg-red-500" />
      ) : null}
    </Link>
  )
}
