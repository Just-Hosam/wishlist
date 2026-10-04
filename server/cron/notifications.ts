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
      title: "PlayStation Plus Monthly Games",
      message: "This month's PlayStation Plus games are now available.",
      eventKey
    })),
    skipDuplicates: true
  })
}
