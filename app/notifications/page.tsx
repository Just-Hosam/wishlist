import { formatRelativeDate } from "@/lib/utils"
import { getNotificationsForUser } from "@/server/actions/notifications"
import { NotificationOutput, NotificationType } from "@/types"
import { BellOff } from "lucide-react"
import { headers } from "next/headers"
import Image from "next/image"
import { redirect } from "next/navigation"

export default async function MorePage() {
  const userId = (await headers()).get("x-user-id")
  if (!userId) redirect("/")

  const notifications = await getNotificationsForUser(userId)

  if (notifications.length === 0) return <NotificationsEmptyState />

  return (
    <ul className="custom-slide-up-fade-in grid gap-3">
      {notifications.map((notification) => {
        switch (notification.type) {
          case NotificationType.PLAYSTATION_PLUS_MONTHLY_GAMES:
          case NotificationType.PLAYSTATION_PLUS_GAME_CATALOG:
            return (
              <PlaystationPlusNotification
                key={notification.id}
                notification={notification}
              />
            )
          default:
            return null
        }
      })}
    </ul>
  )
}

function NotificationsEmptyState() {
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

function PlaystationPlusNotification({
  notification
}: {
  notification: NotificationOutput
}) {
  return (
    <li className="flex gap-3 overflow-hidden rounded-3xl bg-card px-5 py-4 shadow-sm">
      <Image
        src="/logos/ps-plus.svg"
        alt="PlayStation Plus logo"
        width={25}
        height={25}
        className="mt-[5px] self-start rounded-sm drop-shadow-2xl"
        unoptimized
      />
      <div>
        <h2 className="text-sm font-semibold">{notification.title}</h2>
        <p className="mt-[2px] text-xs text-muted-foreground">
          {notification.message}
        </p>
        <time
          dateTime={notification.createdAt.toISOString()}
          className="mt-[10px] block text-xs font-light text-muted-foreground"
        >
          {formatRelativeDate(notification.createdAt)}
        </time>
      </div>
    </li>
  )
}
