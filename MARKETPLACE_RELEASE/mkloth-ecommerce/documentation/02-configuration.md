# 02. Configuration

All configuration lives in environment variables (`.env`) and a small set of
code constants. Secrets are **never** committed — only `.env.example` is
shipped, with placeholder values.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | SQLite connection string. Default `file:./prisma/dev.db` |
| `AUTH_SECRET` | Yes | NextAuth session signing secret. Generate with `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | No | Set `true` for `next start` / reverse proxies; leave empty in dev |
| `NEXTAUTH_URL` | No | Public URL of the site (e.g. `https://store.example.com`) |
| `SUPABASE_URL` | No* | Required only for the optional Google login |
| `SUPABASE_ANON_KEY` | No* | Required only for the optional Google login |
| `SUPABASE_SERVICE_ROLE_KEY` | No* | Required only for the optional Google login |
| `SUPABASE_JWT_SECRET` | No* | Required only for the optional Google login |
| `SEED_ADMIN_EMAIL` | No | Email used by `db:seed` for the admin account |
| `SEED_ADMIN_PASSWORD` | No | Password used by `db:seed` for the admin account |

\* See the Google OAuth section below. The sign-in buttons are **hidden
automatically** until all four Supabase variables are present.

## Google sign-in (optional)

MKloth ships with email/password accounts. An optional Google "Sign in with
Google" button is also available, and it is **hosted through Supabase Auth** —
Supabase acts as the OAuth gateway (this design keeps credentials/API keys off
your application server).

To enable it:

1. Create a free Supabase project.
2. Under **Authentication → Providers**, enable **Google** and copy the
   generated `anon key`, `service_role key`, and `JWT secret` from the project
   settings into your `.env`.
3. Set `SUPABASE_URL` to `https://<project-ref>.supabase.co`.
4. Restart the app.

The Google button appears on `/login` and `/register` **only when** all four
`SUPABASE_*` variables are set. When they are missing, the provider is not
registered and the button is hidden — users simply won't see it. If you have no
Supabase account, skip this entirely; every other feature works without it.

## Storefront constants

Core business rules are hardcoded in `src/lib/constants.ts`:

| Constant | Default | Meaning |
| --- | --- | --- |
| `DELIVERY_FEE` | `4` | Flat delivery fee (in USD) |
| `FREE_DELIVERY_THRESHOLD` | `100` | Subtotal at which delivery becomes free |
| `SIZE_OPTIONS` | XS–XXL | Sizes shown in the admin product form |
| `COLOR_OPTIONS` | 10 colors | Colors shown in the admin product form |
| `ORDER_STATUSES` | PENDING → DELIVERED | Lifecycle shown in the admin panel |
| `BRAND_NAME` | `MKloth` | Brand string used in UI/metadata |

> Prices are stored as **integers** (the currency is USD). If your store uses
> another currency, change the formatting in `src/lib/utils.ts`
> (`formatPrice`) and update pricing documentation to match. There is no
> floating-point money in the database.

## Admin account

The seeded admin account is created by `npm run db:seed` from
`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`. If you do not set them, it falls
back to `admin@example.com` / `placeholder-admin-pass` — **change this
immediately in production** (see 05-customization for rotating it).

## Order pricing (important)

Order totals are **never trusted from the browser**. The checkout API
(`/api/orders`) re-reads each product and its price from the database,
validates the requested size/color, and recomputes `subtotal`, `deliveryFee`,
and `total` server-side. Clients only send product IDs, quantities, sizes, and
colors. Do not edit the client to send prices — they will be ignored.

## Image uploads

Admin product images are uploaded to `public/uploads/` (5 MB max; JPG, PNG,
WEBP, GIF). Files are validated by content sniffing (magic bytes), not by the
client filename. The folder is gitignored — back it up alongside
`prisma/dev.db` (or your database file) when you deploy (see 04-deployment).