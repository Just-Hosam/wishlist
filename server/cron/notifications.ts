import prisma from "@/lib/prisma"
import { NotificationType } from "@/types"

export async function createPSPlusMonthlyGameNotifications() {
  const eventKey = new Date().toISOString().slice(0, 7)

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { notificationSettings: null },
        {
          notificationSettings: {
            playstationPlusMonthlyGames: true
          }
        }
      ]
    },
    select: { id: true }
  })

  return prisma.notification.createMany({
    data: users.map(({ id }) => ({
      userId: id,
      type: NotificationType.PLAYSTATION_PLUS_MONTHLY_GAMES,
      title: "New PS+ Monthly Games",
      message: "This month's PS+ monthly games are now available.",
      eventKey
    })),
    skipDuplicates: true
  })
}

export async function createPSPlusCatalogUpdateNotifications() {
  const eventKey = new Date().toISOString().slice(0, 7)

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { notificationSettings: null },
        {
          notificationSettings: {
            playstationPlusCatalogUpdates: true
          }
        }
      ]
    },
    select: { id: true }
  })

  return prisma.notification.createMany({
    data: users.map(({ id }) => ({
      userId: id,
      type: NotificationType.PLAYSTATION_PLUS_GAME_CATALOG,
      title: "PS+ Catalog Updated",
      message: "This month's PS+ Game Catalog update is now available.",
      eventKey
    })),
    skipDuplicates: true
  })
}

export async function createNewFeatureNotifications({
  eventKey,
  title,
  message
}: {
  eventKey: string
  title: string
  message: string
}) {
  const users = await prisma.user.findMany({ select: { id: true } })

  return prisma.notification.createMany({
    data: users.map(({ id }) => ({
      userId: id,
      type: NotificationType.NEW_FEATURE,
      title,
      message,
      eventKey
    })),
    skipDuplicates: true
  })
}
