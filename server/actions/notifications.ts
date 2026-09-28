"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import {
  NotificationOutput,
  NotificationSettingsOutput
} from "@/types/notifications"

export async function getNotificationsForUser(
  userId: string
): Promise<NotificationOutput[]> {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  })
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
  playstationPlusMonthlyGames: boolean
}) {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) throw new Error("Unauthorized.")

  await prisma.notificationSettings.upsert({
    where: { userId },
    update: {
      playstationPlusMonthlyGames: settings.playstationPlusMonthlyGames
    },
    create: {
      userId,
      playstationPlusMonthlyGames: settings.playstationPlusMonthlyGames
    }
  })
}
