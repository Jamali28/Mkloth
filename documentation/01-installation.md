# 01. Installation

MKloth is a standalone Next.js 15 application (App Router, TypeScript) with a
SQLite database and no external services required to run the core store.

## Requirements

- **Node.js 22.6 or newer** (required for the seed script, which uses native
  TypeScript execution). Tested with Node 24.
- **npm** (ships with Node.js).
- No database server is required — SQLite is a single local file.

> MKloth is a single-project monolith. The whole storefront, admin panel, and
> API live in this one folder.

## Step 1 — Install dependencies

```bash
npm install
```

`npm install` runs a `postinstall` script that generates the Prisma client.
If your npm version blocks install scripts, run it manually:

```bash
npx prisma generate
```

## Step 2 — Configure the environment

Copy the example environment file:

```bash
# Windows (PowerShell)
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Then open `.env` and set **at least** `AUTH_SECRET` to a real random value:

```bash
# PowerShell example
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# or on Linux/macOS
openssl rand -base64 32
```

The core store (browse, cart, checkout, admin) works with only `DATABASE_URL`
and `AUTH_SECRET`. All other variables are optional; see
[02-configuration.md](02-configuration.md).

## Step 3 — Create the database

```bash
npm run db:push
```

This creates the SQLite database file and all tables from `prisma/schema.prisma`.

## Step 4 — Seed demo data (recommended)

```bash
npm run db:seed
```

This seeds:

- **3 categories** (Drop Shoulder, Crop, Polo)
- **13 demo products** with images, colors, and sizes
- **Demo users**, including the admin account:
  | Role  | Email              | Password                |
  | ----- | ------------------ | ----------------------- |
  | Admin | `admin@example.com`| `placeholder-admin-pass`|
  | User  | `user@example.com` | `placeholder-user-pass` |

> **Change the admin password before going live.** The admin panel is at
> `/admin` and is restricted to the `ADMIN` role.

## Step 5 — Run the store

Development server (hot reload):

```bash
npm run dev
```

Production (optimized build, then serve):

```bash
npm run build
npm start
```

Open the site at **http://localhost:3000**.

## Verify the install

1. The home page loads with the animated hero and product sections.
2. **Login as admin:** `/login`, use the demo admin credentials, go to `/admin`.
3. Add a product to the cart and complete the COD checkout flow.

If anything fails, see [06-troubleshooting.md](06-troubleshooting.md).