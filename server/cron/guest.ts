import prisma from "@/lib/prisma"

export async function deleteGuestAccounts() {
  const { count } = await prisma.user.deleteMany({
    where: {
      name: "Guest",
      email: null,
      accounts: { none: {} }
    }
  })

  console.log(`[CRON] Deleted ${count} guest accounts`)

  return { deletedGuests: count }
}
