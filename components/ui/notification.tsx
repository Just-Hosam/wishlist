import { formatRelativeDate } from "@/lib/utils"
import { ReactNode } from "react"

interface NotificationProps {
  children?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  timestamp?: Date
  title?: ReactNode
}

export default function Notification({
  children,
  description,
  icon,
  timestamp,
  title
}: NotificationProps) {
  return (
    <div className="flex gap-3 overflow-hidden rounded-3xl bg-card px-5 py-4 shadow-sm">
      {icon}
      {(title || description || children || timestamp) && (
        <div className="min-w-0">
          {title && <h2 className="text-sm font-semibold">{title}</h2>}
          {description && (
            <div className="mt-[2px] text-xs text-muted-foreground">
              {description}
            </div>
          )}
          {children}
          {timestamp && (
            <time
              dateTime={timestamp.toISOString()}
              className="mt-[10px] block text-xs font-light text-muted-foreground"
            >
              {formatRelativeDate(timestamp)}
            </time>
          )}
        </div>
      )}
    </div>
  )
}
