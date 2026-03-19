import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pgPool: Pool | undefined
}

const datasourceUrl = process.env.DATABASE_URL
if (!datasourceUrl) {
  throw new Error("DATABASE_URL is not set")
}

const pool =
  globalForPrisma.pgPool ??
  new Pool({
    connectionString: datasourceUrl,
  })

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(pool),
  })

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
  globalForPrisma.pgPool = pool
}
