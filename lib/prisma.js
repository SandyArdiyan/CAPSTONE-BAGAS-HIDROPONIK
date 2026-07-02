import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

// Mencegah multiple instance Prisma Client saat hot-reloading di Next.js
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}