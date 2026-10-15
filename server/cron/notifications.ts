import prisma from "@/lib/prisma"
import { NotificationType } from "@/types"

export async function createPSPlusMonthlyGameNotifications() {
  const eventKey = new Date().toISOString().slice(0, 7)
  const payload = {
    title: "New PS+ Monthly Games",
    message: "This month's PS+ monthly games are now available."
  }

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

  const notifications = await prisma.notification.createManyAndReturn({
    data: users.map(({ id }) => ({
      userId: id,
      type: NotificationType.PLAYSTATION_PLUS_MONTHLY_GAMES,
      ...payload,
      eventKey
    })),
    skipDuplicates: true,
    select: { userId: true }
  })

  return {
    count: notifications.length,
    userIds: notifications.map(({ userId }) => userId),
    payload
  }
}

export async function createPSPlusCatalogUpdateNotifications() {
  const eventKey = new Date().toISOString().slice(0, 7)
  const payload = {
    title: "PS+ Catalog Updated",
    message: "This month's PS+ Game Catalog update is now available."
  }

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

  const notifications = await prisma.notification.createManyAndReturn({
    data: users.map(({ id }) => ({
      userId: id,
      type: NotificationType.PLAYSTATION_PLUS_GAME_CATALOG,
      ...payload,
      eventKey
    })),
    skipDuplicates: true,
    select: { userId: true }
  })

  return {
    count: notifications.length,
    userIds: notifications.map(({ userId }) => userId),
    payload
  }
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

  const notifications = await prisma.notification.createManyAndReturn({
    data: users.map(({ id }) => ({
      userId: id,
      type: NotificationType.NEW_FEATURE,
      title,
      message,
      eventKey
    })),
    skipDuplicates: true,
    select: { userId: true }
  })

  return {
    count: notifications.length,
    userIds: notifications.map(({ userId }) => userId)
  }
}
