import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

// Runs as the build hook on Vercel (vercel.json) to get the database ready
// before `next build` prerenders the pages. Works with zero configuration:
// - If DATABASE_URL is a Postgres URL → pushes the Postgres schema + seeds
//   if the database is empty (hosted DB setup).
// - Otherwise → uses the committed SQLite database at prisma/prisma/dev.db
//   and pushes/seeds it (idempotent, no external services needed).
const resolvedUrl =
  process.env.DATABASE_URL?.trim() ||
  `file:${process.cwd()}/prisma/prisma/dev.db`;

process.env.DATABASE_URL = resolvedUrl;

const prismaCli = "node node_modules/prisma/build/index.js";

console.log("db:setup — pushing Prisma schema to the database...");
execSync(`${prismaCli} db push --skip-generate`, { stdio: "inherit" });

const prisma = new PrismaClient();
try {
  const categoryCount = await prisma.category.count();
  if (categoryCount === 0) {
    console.log("db:setup — database is empty, seeding demo data...");
    execSync(`${prismaCli} db seed`, { stdio: "inherit" });
  } else {
    console.log("db:setup — data already present, skipping seed.");
  }
} finally {
  await prisma["$disconnect"]();
}

console.log("db:setup — complete.");