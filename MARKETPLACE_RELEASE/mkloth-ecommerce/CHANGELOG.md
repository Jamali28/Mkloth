# Changelog

All notable changes to MKloth are documented in this file. This project
follows [Semantic Versioning](https://semver.org/).

## [1.0.1] — 2026-09-09

### Added

- **Luxury UI redesign.** Brand-wide polish pass: warm greige accent
  (`#d9d2c4`) replacing the lime accent, editorially refined product cards
  (mono category label, cleaner badges, slower cinematic hover), refined
  navigation (Search + Account icons, "Shop" link, accent nav underline),
  high-contrast "Sold Out" badge, and an upgraded hero CTA + copy.
- **Local SVG imagery system.** `scripts/generate-product-images.mjs` now
  generates 48 original SVGs under `public/images/` (products, categories,
  hero, promo, placeholder). All `picsum.photos`/Unsplash remote patterns were
  removed from `next.config.ts`; the store renders a fully deterministic,
  self-hosted visual identity that can be replaced with professional
  photography at any time.
- Sign-out controls in the admin panel sidebar and mobile menu.

### Changed

- **Currency switched from PKR to USD.** Prices are displayed as `$` (USD)
  via `formatPrice` in `src/lib/utils.ts`, seeded product prices are realistic
  USD values, and storefront constants now use `DELIVERY_FEE = 4`,
  `FREE_DELIVERY_THRESHOLD = 100`. Admin form labels and price filters updated
  to USD.

### Fixed

- Seed count corrected in docs from "14 products" to the real **13** products.
- Documentation now reflects the USD pricing, local SVG imagery, and the
  removal of third-party demo photo services (`THIRD-PARTY-LICENSES.md`,
  `documentation/01-installation.md`, `02-configuration.md`, `03-administration.md`,
  `05-customization.md`, `07-faq.md`).

## [1.0.0] — 2026-09-08

### Added

- Full documentation suite under `documentation/` (installation,
  configuration, administration, deployment, customization, troubleshooting,
  FAQ).
- `THIRD-PARTY-LICENSES.md` inventory for auditability.
- `LICENSE.txt` placeholder for the marketplace item license.
- Conditional Google OAuth: the Supabase-hosted Google sign-in button and
  provider are only registered when all four `SUPABASE_*` variables are set.
- Magic-byte content validation for admin image uploads (extension is derived
  from detected content, never trusted from the client).

### Changed

- **Security: order pricing is now fully server-authoritative.** The checkout
  API re-reads products and prices from the database, validates requested
  sizes/colors, and recomputes subtotal, delivery fee, and total server-side.
  Clients send only product IDs, quantities, sizes, and colors. This closes a
  price-tampering vector of severity HIGH.
- `OrderItem.productId` now uses `onDelete: SetNull`, so deleting a product no
  longer fails when it appears in past orders; order history is preserved as a
  snapshot.
- Removed non-functional UI: newsletter signup form, "Notify Me" and "Size
  guide / coming soon" buttons, and a checkout success page that falsely
  claimed "a confirmation has been sent". Out-of-stock products now show a
  disabled **Sold Out** state.
- Footer: removed "Track Order" and "Contact" links that pointed nowhere, and
  dead social `href="#"` links.
- Google sign-in buttons are hidden automatically when Supabase is not
  configured (instead of showing a broken button).
- Package named `mkloth-ecommerce`; unused dependencies
  (`motion`, `motion-dom`, `@types/bcryptjs`) removed from `package.json`.
- Cleaned up stray dev artifacts in the working tree (logs, PID file,
  tsbuildinfo, unused images).
- Fixed many pre-existing lint findings: unused imports, unescaped JSX
  entities, `any` typing in the OAuth profile mapping, an effectively-immutable
  `FilterContent` definition in the shop client, and callback ordering in the
  cart provider.

### Fixed

- `npm ci`/`npm install` on npm ≥ 10 (with install-script gating) could leave
  `framer-motion`'s transitive type files missing, breaking the typecheck.
  Wording/documentation now explains running `npx prisma generate` and a clean
  install when script gating is active.
- Deleted stale `MARKETPLACE_RELEASE/` snapshot that referenced removed
  components.

### Security hardening (this release)

- Server-side order total recomputation (was client-trusted).
- Upload content sniffing + extension-from-content.
- OAuth provider registered conditionally (no failed runtime provider when
  env vars are missing).
- Documented known limitations: no rate limiting on auth endpoints, no CSP
  security headers, and predictable order numbers — see
  `documentation/07-faq.md`.

### Intentional scope (unchanged)

- COD-only checkout (no payment gateway).
- Local SQLite storage.
- No email sending, no newsletter backend, no customer order-history portal.
- Demo product imagery was `picsum.photos` placeholders at 1.0.0 — replaced
  by original local SVGs in 1.0.1.