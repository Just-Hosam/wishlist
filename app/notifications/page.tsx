import { formatReleaseDate } from "@/lib/utils"
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
    <div className="custom-slide-up-fade-in grid gap-3">
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
    </div>
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
    <div className="overflow-hidden rounded-3xl bg-card px-5 py-4 shadow-sm">
      <header className="flex content-center gap-3">
        <Image
          src="/logos/ps-plus.svg"
          alt="PlayStation Plus logo"
          width={32}
          height={32}
          className="rounded-sm drop-shadow-2xl"
          unoptimized
        />
        <div>
          <div className="font-semibold">{notification.title}</div>
          <div className="mt-[1px] text-xs text-muted-foreground">
            {formatReleaseDate(notification.createdAt.getTime() / 1000)}
          </div>
        </div>
      </header>
      <div className="mt-4">
        <div className="text-sm text-muted-foreground">
          {notification.message}
        </div>
      </div>
    </div>
  )
}
