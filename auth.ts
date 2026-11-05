import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { createGuest } from "@/server/guest"
import authConfig from "@/auth.config"
import prisma from "@/lib/prisma"

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      id: "guest",
      name: "Guest",
      credentials: {},
      async authorize() {
        return createGuest()
      }
    })
  ],
  events: {
    async createUser({ user }) {
      await prisma.notificationSettings.create({
        data: { userId: user.id }
      })
    }
  }
})
