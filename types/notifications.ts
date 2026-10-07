import type { Notification, NotificationSettings } from "@prisma/client"

export const PUSH_PERMISSION_GRANTED_EVENT = "playward:push-permission-granted"

export type NotificationInput = Omit<
  Notification,
  "id" | "userId" | "readAt" | "createdAt" | "updatedAt"
>

export type NotificationOutput = Notification

export type NotificationSettingsOutput = NotificationSettings
