import { BellOff } from "lucide-react"

export default function NotificationsEmptyState() {
  return (
    <div className="mt-36 flex flex-col items-center justify-center text-center">
      <BellOff
        size={84}
        className="mb-6 text-muted-foreground"
        strokeWidth={1}
      />
      <h2 className="mb-2 text-xl font-semibold">No notifications yet</h2>
      <p className="text-muted-foreground">
        We’ll let you know when something changes with your games
      </p>
    </div>
  )
}
