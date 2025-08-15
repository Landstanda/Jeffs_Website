import { PrismaClient } from '@prisma/client'

const resolveDatabaseUrl = (): string => {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.length > 0) {
    return process.env.DATABASE_URL
  }
  // Prefer Fly volume path in production if not explicitly set
  if (process.env.NODE_ENV === 'production') {
    return 'file:/data/dev.db'
  }
  // Local default
  return 'file:./prisma/dev.db'
}
const databaseUrl = resolveDatabaseUrl()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: { url: databaseUrl },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
