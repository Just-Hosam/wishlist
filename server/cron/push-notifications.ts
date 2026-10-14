import prisma from "@/lib/prisma"
import { tryCatch } from "@/lib/utils"
import type { PushSubscriptionOutput } from "@/types"
import webpush from "web-push"

export async function getPushSubscriptionsForUsers(
  userIds: string[]
): Promise<PushSubscriptionOutput[]> {
  if (!userIds.length) return []

  return prisma.pushSubscription.findMany({
    where: {
      userId: { in: userIds },
      user: { notificationSettings: { pushEnabled: true } },
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
    }
  })
}

export async function sendPushNotificationsForUsers(
  userIds: string[],
  payload: { title: string; message: string }
) {
  const { data: subscriptions, error: subscriptionsError } = await tryCatch(
    getPushSubscriptionsForUsers(userIds)
  )

  if (subscriptionsError) {
    console.error("[PUSH] Failed to fetch subscriptions:", subscriptionsError)
    return null
  }

  const { data: push, error: pushError } = await tryCatch(
    sendPushNotifications(subscriptions, payload)
  )

  if (pushError) {
    console.error("[PUSH] Failed to send notifications:", pushError)
    return null
  }

  return push
}

export async function sendPushNotifications(
  subscriptions: PushSubscriptionOutput[],
  payload: {
    title: string
    message: string
  }
) {
  const results = await Promise.allSettled(
    subscriptions.map((subscription) =>
      sendPushNotification(subscription, payload)
    )
  )

  let accepted = 0
  let failed = 0

  for (const result of results) {
    if (result.status === "fulfilled") {
      accepted++
    } else {
      failed++
      console.error("[PUSH] Delivery failed:", result.reason)
    }
  }

  return { accepted, failed }
}

export async function sendPushNotification(
  subscription: PushSubscriptionOutput,
  payload: {
    title: string
    message: string
  }
) {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const subject = process.env.VAPID_SUBJECT

  if (!publicKey || !privateKey || !subject) {
    throw new Error("VAPID configuration is incomplete.")
  }

  return webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth
      }
    },
    JSON.stringify(payload),
    {
      vapidDetails: {
        subject,
        publicKey,
        privateKey
      }
    }
  )
}
