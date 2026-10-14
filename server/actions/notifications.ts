"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import {
  NotificationOutput,
  NotificationSettingsOutput
} from "@/types/notifications"
import { unstable_cache, updateTag } from "next/cache"

export async function getCachedNotifications(
  userId: string
): Promise<NotificationOutput[]> {
  const notifications = await unstable_cache(
    async () => {
      const results = await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
      })

      return results.map((notification) => ({
        ...notification,
        readAt: notification.readAt?.toISOString() ?? null,
        createdAt: notification.createdAt.toISOString(),
        updatedAt: notification.updatedAt.toISOString()
      }))
    },
    [userId],
    {
      tags: [`user-notifications-${userId}`, "notification"],
      revalidate: 300 // 5 mins
    }
  )()

  return notifications.map((notification) => ({
    ...notification,
    readAt: notification.readAt ? new Date(notification.readAt) : null,
    createdAt: new Date(notification.createdAt),
    updatedAt: new Date(notification.updatedAt)
  }))
}

export async function markNotificationsAsRead() {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) throw new Error("Unauthorized.")

  await prisma.notification.updateMany({
    where: {
      userId,
      readAt: null
    },
    data: {
      readAt: new Date()
    }
  })

  updateTag(`user-notifications-${userId}`)
}

export async function getNotificationSettings(): Promise<NotificationSettingsOutput> {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) throw new Error("Unauthorized.")

  const settings = await prisma.notificationSettings.findUnique({
    where: { userId }
  })

  if (!settings)
    return prisma.notificationSettings.create({
      data: { userId }
    })

  return settings
}

export async function saveNotificationSettings(settings: {
  pushEnabled: boolean
  playstationPlusMonthlyGames: boolean
  playstationPlusCatalogUpdates: boolean
}) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) throw new Error("Unauthorized.")

  await prisma.notificationSettings.upsert({
    where: { userId },
    update: {
      pushEnabled: settings.pushEnabled,
      playstationPlusMonthlyGames: settings.playstationPlusMonthlyGames,
      playstationPlusCatalogUpdates: settings.playstationPlusCatalogUpdates
    },
    create: {
      userId,
      pushEnabled: settings.pushEnabled,
      playstationPlusMonthlyGames: settings.playstationPlusMonthlyGames,
      playstationPlusCatalogUpdates: settings.playstationPlusCatalogUpdates
    }
  })
}

export async function savePushSubscription(subscription: PushSubscriptionJSON) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) throw new Error("Unauthorized.")

  const endpoint = subscription?.endpoint
  const p256dh = subscription?.keys?.p256dh
  const authKey = subscription?.keys?.auth
  const expirationTime = subscription?.expirationTime

  const isValidExpiration =
    expirationTime == null ||
    (typeof expirationTime === "number" && Number.isFinite(expirationTime))

  const isValidSubscription =
    typeof endpoint === "string" &&
    typeof p256dh === "string" &&
    typeof authKey === "string" &&
    !!endpoint &&
    !!p256dh &&
    !!authKey &&
    isValidExpiration

  if (!isValidSubscription) throw new Error("Invalid push subscription.")

  const expiresAt = expirationTime == null ? null : new Date(expirationTime)
  const isValidExpirationDate =
    expiresAt === null || !Number.isNaN(expiresAt.getTime())

  if (!isValidExpirationDate) {
    throw new Error("Invalid subscription expiration.")
  }

  const isSecureEndpoint = new URL(endpoint).protocol === "https:"

  if (!isSecureEndpoint) throw new Error("Push endpoint must use HTTPS.")

  const data = {
    userId,
    p256dh,
    auth: authKey,
    expiresAt
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: data,
    create: {
      endpoint,
      ...data
    }
  })
}
