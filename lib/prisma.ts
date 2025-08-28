import { PrismaClient } from "@prisma/client"

// Add global type for PrismaClient instance
declare global {
  var prisma: PrismaClient | undefined
}

// Create singleton instance of PrismaClient
const prisma = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}

export default prisma
