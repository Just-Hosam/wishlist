"use client"

import { Bell } from "lucide-react"
import { Link } from "../navigation"

export default function NotificationButton() {
  return (
    <Link className="relative -mr-2 -mt-1 px-3 py-3" href="/notifications">
      <Bell strokeWidth={2.3} />
      {true ? (
        <span className="absolute right-3 top-[9px] size-[10px] rounded-full bg-red-500" />
      ) : null}
    </Link>
  )
}
