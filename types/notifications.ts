import { Notification, NotificationSettings } from "@prisma/client"

export type NotificationInput = Omit<
  Notification,
  "id" | "userId" | "readAt" | "createdAt" | "updatedAt"
>

export type NotificationOutput = Notification

export type NotificationSettingsOutput = NotificationSettings
