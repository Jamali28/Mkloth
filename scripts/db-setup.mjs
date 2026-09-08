import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

// Runs during the build on Netlify (netlify.toml) and Vercel (vercel.json) to
// get the hosted PostgreSQL database ready before `next build` prerenders the
// pages.
// - Fails fast with instructions when DATABASE_URL is missing — a serverless
//   build cannot work without a hosted database.
// - Pushes the Prisma schema (idempotent).
// - Seeds demo data only when the database is empty, so redeploys don't wipe
//   admin/orders that were added after launch.
// - Skips when DATABASE_URL is a local SQLite file (manual local use).
const url = process.env.DATABASE_URL ?? "";

if (!url) {
  console.error(
    [
      "db:setup — DATABASE_URL is not set.",
      "",
      "A production build needs a hosted PostgreSQL database.",
      "1. Create a free database at https://neon.tech or https://supabase.com",
      "2. Add its postgresql://... connection string as the DATABASE_URL ",
      "   environment variable for this project",
      "3. Redeploy",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

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