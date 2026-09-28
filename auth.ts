import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import prisma from "@/lib/prisma"

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  events: {
    async createUser({ user }) {
      await prisma.notificationSettings.create({
        data: { userId: user.id }
      })
    }
  }
})
