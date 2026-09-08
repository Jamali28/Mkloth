import "dotenv/config";
import { defineConfig } from "prisma/config";

// Local development uses SQLite (prisma/schema.prisma).
// When DATABASE_URL is a Postgres URL (hosted DB for Netlify/Vercel), we use
// prisma/schema.postgresql.prisma instead, so `db push`, `db seed` and
// `generate` all target the production database automatically.
const isPostgres = (process.env.DATABASE_URL ?? "").startsWith("postgres");

export default defineConfig({
  schema: isPostgres
    ? "prisma/schema.postgresql.prisma"
    : "prisma/schema.prisma",
  migrations: {
    path: isPostgres ? "prisma/migrations" : "prisma/migrations",
    seed: "node prisma/seed.ts",
  },
});