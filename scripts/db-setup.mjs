import { execSync } from "node:child_process";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// Runs during the Netlify build (see netlify.toml) to make the hosted
// PostgreSQL database ready before `next build` prerenders the pages.
// - Skips entirely when DATABASE_URL is not a Postgres URL (local SQLite).
// - Pushes the Prisma schema (idempotent).
// - Seeds demo data only when the database is empty, so redeploys don't wipe
//   admin/orders that were added after launch.
const url = process.env.DATABASE_URL ?? "";
if (!url.startsWith("postgres")) {
  console.log("db:setup skipped — DATABASE_URL is not Postgres.");
  process.exit(0);
}

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
  await prisma.$disconnect();
}

console.log("db:setup — complete.");