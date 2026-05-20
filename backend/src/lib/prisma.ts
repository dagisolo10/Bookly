import env from "@/utils/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = env.DATABASE_URL;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const adapter = new PrismaPg({ connectionString });

const prisma = globalForPrisma.prisma || new PrismaClient({ adapter, log: ["query", "error", "info", "warn"] });

export default prisma;
