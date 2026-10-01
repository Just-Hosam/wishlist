import MarkNotificationsAsRead from "@/components/notifications/MarkNotificationsAsRead"
import NotificationsEmptyState from "@/components/notifications/NotificationsEmptyState"
import PSPlusCatalogNotification from "@/components/notifications/layouts/PSPlusCatalogNotification"
import PSPlusMonthlyGamesNotification from "@/components/notifications/layouts/PSPlusMonthlyGamesNotification"
import { getCachedNotifications } from "@/server/actions/notifications"
import { NotificationType } from "@/types"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function NotificationsPage() {
  const userId = (await headers()).get("x-user-id")
  if (!userId) redirect("/")

  const notifications = await getCachedNotifications(userId)

  if (notifications.length === 0) return <NotificationsEmptyState />

  const hasUnread = notifications.some(
    (notification) => notification.readAt === null
  )

  return (
    <>
      {hasUnread && <MarkNotificationsAsRead />}
      <ul className="custom-slide-up-fade-in grid gap-3">
        {notifications.map((notification) => {
          switch (notification.type) {
            case NotificationType.PLAYSTATION_PLUS_MONTHLY_GAMES:
              return (
                <PSPlusMonthlyGamesNotification
                  key={notification.id}
                  notification={notification}
                />
              )
            case NotificationType.PLAYSTATION_PLUS_GAME_CATALOG:
              return (
                <PSPlusCatalogNotification
                  key={notification.id}
                  notification={notification}
                />
              )
            default:
              return null
          }
        })}
      </ul>
    </>
  )
}
