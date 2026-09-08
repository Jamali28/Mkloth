# MKloth — Premium E-commerce / Streetwear Store

MKloth is a complete premium streetwear e-commerce platform built with Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, Prisma + SQLite, and NextAuth v5. Featuring a modern storefront with product browsing, search/filtering, a persistent shopping cart, COD checkout, user accounts, and a full admin dashboard.

Full setup, configuration, admin, deployment, and customization guides live in
[`documentation/`](documentation/README.md).

## Tech Stack

- **Next.js 15.5** (App Router) + **TypeScript**
- **Tailwind CSS v4** + hand-written **shadcn/ui** components + **tw-animate-css**
- **Framer Motion** — page, card, drawer, sheet, and micro-interactions
- **Prisma** + **SQLite** (local) / **PostgreSQL** (hosted deployments) — schema & ORM
- **NextAuth v5** (beta) — Credentials provider, JWT sessions, ADMIN/USER roles
- **Zod** — input validation, **Sonner** — toasts, **Lucide** — icons

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (AUTH_SECRET should be a real random string)
copy .env.example .env

# 3. Create the SQLite database
npm run db:push

# 4. Seed categories, 13 products, and demo users
npm run db:seed

# 5. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** `npm run db:seed` runs `node prisma/seed.ts` directly (Node ≥ 22.6 native TS). On older Node, run `npx tsx prisma/seed.ts`.

## Demo Accounts

| Role | Email                | Password   |
| ---- | -------------------- | ---------- |
| Admin | `admin@example.com` | `placeholder-admin-pass` |
| User  | `user@example.com`  | `placeholder-user-pass` |

These are fictional accounts seeded for development only. Change the admin password before going live.

Admin area is at `/admin` (protected — only ADMIN role).

## Environment Variables

Copy `.env.example` to `.env` and fill in the values before running the app. Variables:

- `DATABASE_URL` — SQLite file (`file:./prisma/dev.db`) locally; a Postgres URL (`postgresql://...`) on Netlify/Vercel. When it's Postgres, `prisma.config.ts` auto-switches to `prisma/schema.postgresql.prisma`
- `AUTH_SECRET` — NextAuth session secret (generate with `openssl rand -base64 32`)
- `AUTH_TRUST_HOST`, `NEXTAUTH_URL` — NextAuth host config
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET` — only required if you use the optional Google OAuth login via Supabase
- `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` — credentials for the seeded admin account

## Features

- **Storefront** — animated hero + marquee, category showcase, new arrivals, best sellers, featured products, promo banner
- **Shop** — category filters, size/color filters, price sort, animated grid, loading skeletons
- **Product detail** — image gallery, size + color pickers, add-to-cart with cart-bump animation, related products
- **Cart** — persistent (localStorage), slide-out drawer with free-delivery progress bar, quantity controls
- **Checkout** — COD order placement (USD pricing, delivery fee & free-delivery threshold). Order totals are **recomputed server-side**; clients never send prices.
- **Auth** — register/login, NextAuth credentials, role-based route protection (middleware)
- **Search** — instant search page across name/description
- **Admin panel** — dashboard stats (products, orders, revenue, today's orders, status breakdown), product CRUD with local image upload, category CRUD, order status management
- **Responsive** — mobile menu + drawers, full-width layouts down to small screens

## Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start dev server                     |
| `npm run build`    | Production build                     |
| `npm start`        | Serve the production build           |
| `npm run db:push`  | Sync Prisma schema to the database (SQLite or Postgres) |
| `npm run db:seed`  | Seed categories, products, and users |
| `npm run db:setup` | Postgres-only: push schema + seed if empty (Netlify build step) |

## Project Structure

```
prisma/
  schema.prisma      # User, Category, Product(+images/colors/sizes), Order(+items)
  seed.ts            # 3 categories, 13 products, demo users
src/
  auth.ts            # NextAuth config (Credentials + JWT)
  middleware.ts      # /admin guard + login/register redirects
  lib/               # prisma client, data layer, constants, utils
  components/
    ui/              # shadcn-style primitives
    layout/          # navbar, footer, mobile menu, cart drawer
    home/            # hero, marquee, category showcase, product sections
    product/         # card, gallery, add-to-cart form
    shop/            # filterable grid + skeletons
    admin/           # product form, categories manager, order controls
  app/
    (store)/         # home, shop, category, product, search, checkout, login, register
    admin/           # dashboard, products, categories, orders
    api/             # auth, register, orders, upload, admin CRUD
```

Uploaded product images are saved to `public/uploads` (gitignored).
