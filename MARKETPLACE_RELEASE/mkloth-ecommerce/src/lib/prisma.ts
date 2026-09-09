import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// The committed SQLite database lives at prisma/prisma/dev.db relative to the
// project root (DATABASE_URL=file:./prisma/dev.db resolves from schema.prisma
// to the nested prisma/prisma/dev.db). On Vercel the process cwd is the lambda
// root, so an absolute URL derived from cwd always finds the bundled file;
// without this, Prisma resolves relative file: URLs against the schema/client
// directory, which breaks at runtime.
function getDatasourceUrl(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (typeof process !== "undefined" && typeof process.cwd === "function") {
    return `file:${process.cwd()}/prisma/prisma/dev.db`;
  }
  return "file:./prisma/dev.db";
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: getDatasourceUrl(),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
