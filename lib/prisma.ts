import { PrismaClient } from '@prisma/client'

declare global {
  // Allow global var in development to avoid hot-reload issues
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ['query', 'error', 'warn'], // Optional: see generated SQL and errors
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma 