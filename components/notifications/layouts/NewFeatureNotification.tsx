import Notification from "@/components/ui/notification"
import type { NotificationOutput } from "@/types"
import { Megaphone } from "lucide-react"

export default function NewFeatureNotification({
  notification
}: {
  notification: NotificationOutput
}) {
  return (
    <li>
      <Notification
        description={notification.message}
        icon={
          <Megaphone
            className="size-[25px] shrink-0"
            color="hsl(var(--accent))"
            strokeWidth={2}
          />
        }
        timestamp={notification.createdAt}
        title={notification.title}
      />
    </li>
  )
}
