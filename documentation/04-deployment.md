# 04. Deployment

The app is a standard Next.js build. It can be served from a small VPS or a
serverless platform. Everything — database included — is a local SQLite file,
so deployment is simple but file storage must be handled with care.

## The production build

```bash
npm run build
npm start          # serves on http://localhost:3000
```

Set `AUTH_TRUST_HOST=true` and `NEXTAUTH_URL=https://your-domain.com` in the
production `.env` so NextAuth signs and trusts cookies correctly behind a
reverse proxy.

## Option A — VPS / Node host (recommended for this app)

MKloth is a single Node process with a local SQLite file. Works great on a
small VPS:

1. Copy the project folder to the server (minus `node_modules`, `.next`,
   `.env`, and database files).
2. `npm ci` (or `npm install`).
3. Copy `.env.example` to `.env`, set `AUTH_SECRET` + `NEXTAUTH_URL`.
4. `npm run db:push` then `npm run db:seed`.
5. `npm run build` then `npm start`.

Run it under a process manager (e.g. pm2) and put nginx/Caddy in front:

- Reverse-proxy `/` to `http://127.0.0.1:3000`
- Enable HTTPS (Let's Encrypt)

Back up two things regularly:

- The **SQLite database file** (`prisma/prisma/dev.db` by default)
- The **uploaded images** folder (`public/uploads`)

## Option B — Serverless (Vercel / Netlify)

The app builds and runs on Vercel, but read this first:

- **SQLite is an on-disk file.** On serverless, the filesystem is read-only and
  ephemeral. Use Prisma + a proper hosted database (PostgreSQL, or
  `libsql://` via Turso with a `libsql` driver) for production data. This
  requires changing the Prisma datasource in `prisma/schema.prisma`.
- **Local image uploads** (`public/uploads`) do not persist on serverless.
  Uploads must go to blob/object storage (e.g. Vercel Blob, S3) if you go this
  route.

For a first production launch, **Option A is strongly recommended** — it is
exactly what the app is designed for.

## Platform notes

- **Node version:** use Node 22.6+ on the server (matches the seed script
  requirement; see 06-troubleshooting).
- **`AUTH_SECRET`:** must be a stable random string — changing it invalidates
  all sessions.
- **Domains + cookies:** if the site is behind a proxy, keep `AUTH_TRUST_HOST`
  on. The login page is at `/login`.
- **No email/queue services** are used anywhere in this app, so nothing else to
  configure for sending mail.

## Security checklist before going live

- [ ] Replace the seeded admin password (`SEED_ADMIN_PASSWORD`)
- [ ] Replace `AUTH_SECRET` with a fresh random value
- [ ] Remove the demo `user@example.com` account if you don't want it
- [ ] Serve over HTTPS
- [ ] Back up the SQLite file and `public/uploads`
- [ ] If you enabled Google login, confirm your Supabase project uses your own
      `JWT secret` (never the placeholder)
- [ ] Update `.env` — never commit it (`.gitignore` already excludes it)