import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function createGuest() {
  const guest = await createGuestUser()
  const baseUserId = process.env.BASE_USER_ID

  if (!baseUserId) return guest

  await Promise.all([
    seedGames(guest.id, baseUserId).catch((error) => {
      console.error("Error seeding guest games:", error)
    }),
    seedNotifications(guest.id, baseUserId).catch((error) => {
      console.error("Error seeding guest notifications:", error)
    })
  ])

  return guest
}

async function createGuestUser() {
  return prisma.user.create({
    data: {
      name: "Guest",
      notificationSettings: { create: {} }
    }
  })
}

async function seedGames(guestId: string, baseUserId: string) {
  return prisma.$transaction(async (tx) => {
    const games = await tx.game.findMany({
      where: {
        userId: baseUserId,
        category: { in: ["WISHLIST", "LIBRARY", "COMPLETED"] }
      },
      include: { trackedPrices: { select: { id: true } } }
    })

    for (const game of games) {
      const { id, userId, createdAt, updatedAt, trackedPrices, ...data } = game
      await tx.game.create({
        data: {
          ...data,
          userId: guestId,
          trackedPrices: { connect: trackedPrices }
        }
      })
    }
  })
}

async function seedNotifications(guestId: string, baseUserId: string) {
  const notifications = await prisma.notification.findMany({
    where: { userId: baseUserId },
    select: {
      type: true,
      title: true,
      message: true,
      payload: true,
      readAt: true,
      eventKey: true,
      createdAt: true
    }
  })

  if (notifications.length > 0) {
    await prisma.notification.createMany({
      data: notifications.map((notification) => ({
        ...notification,
        userId: guestId,
        payload: notification.payload ?? Prisma.DbNull
      }))
    })
  }
}
