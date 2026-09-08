# 06. Troubleshooting

## `npm run db:seed` fails to run `prisma/seed.ts`

The seed runs `node prisma/seed.ts` using **Node ≥ 22.6 native TypeScript
support**. Fixes:

- Upgrade Node to 22.6+ (18/20 will throw a syntax error).
- Or run the seed with tsx: `npx tsx prisma/seed.ts`

## Prisma client is missing

If `prisma generate` was skipped during install (some npm versions block
install scripts), the app fails with errors like "Cannot find module
`@prisma/client`" or "Query engine library … not found".

```bash
npx prisma generate
```

## `AUTH_SECRET` not set

NextAuth refuses to start in production without it. Generate one:

```bash
openssl rand -base64 32
```

and put it in `.env`. Changing it afterwards signs everyone out.

## Login works in dev but not after deploying

Almost always a host/URL issue:

- Set `AUTH_TRUST_HOST=true`
- Set `NEXTAUTH_URL=https://your-real-domain.com`
- If you use an IP:port directly in production, that becomes the cookie host —
  serving over HTTPS on a domain is the supported path.

## The Google sign-in button doesn't appear

By design, the button only renders when **all four** `SUPABASE_*` variables are
set. If you want Google login, fill `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, and `SUPABASE_JWT_SECRET`, then restart. The login
and register pages read these at request time, and `/api/upload` returns 401
for non-admins — Google is only about signing in, not about full admin auth.

## Image upload fails

Uploads are limited to JPG/PNG/WEBP/GIF and 5 MB. Files are verified by content
magic bytes, so a renamed file (e.g. a `.jpg` that is really a `.svg`) is
rejected with "The file is not a valid image". Convert the file and retry.

## Site is blank / page fails at runtime

Check the terminal running the server for an error. Common causes:

- Database file missing — run `npm run db:push`
- `.env` present but invalid — verify `DATABASE_URL` path is writable
- Port already in use — change the port (`npm start -- -p 3001`)

## Deleting a category fails

Categories with products can't be deleted (the UI explains this). Move its
products to another category or delete them first.

## Orders can't be placed (validation error)

The checkout API validates everything server-side against the database:
products must exist, the requested size/color must exist on the product, and
quantities are 1–99. If a product was deleted mid-checkout, "a product in your
cart is no longer available" is the expected response — refresh the cart.

## `eslint` errors when running `npm run lint`

There is **no `lint` script** configured in `package.json`. The shipped ESLint
setup (`eslint@10` + `eslint-config-next`) crashes with a
`contextOrFilename.getFilename is not a function` error — a known
version-incompatibility between those two packages. Type-checking and builds
(`npx tsc --noEmit`, `npm run build`) pass cleanly; linting is not part of the
app's gates.

## I want a different database (PostgreSQL, etc.)

Change `provider = "sqlite"` in `prisma/schema.prisma` and the `DATABASE_URL`
in `.env`, then `npm run db:push` again. SQLite-specific SQL in the app is
minimal, but always re-run the full build and a smoke test after switching
databases.