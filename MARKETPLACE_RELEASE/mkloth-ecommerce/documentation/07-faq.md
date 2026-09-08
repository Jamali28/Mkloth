# 07. FAQ

## What does this item include?

- Complete, buildable **source code** for the MKloth storefront + admin panel
- Prisma schema + seed (`3 categories`, `13 products`, demo users)
- Local SQLite database (no external DB service needed)
- Full documentation (`documentation/`), `CHANGELOG.md`, and a third-party
  license inventory (`THIRD-PARTY-LICENSES.md`)

## What is intentionally NOT included?

These are deliberate design decisions, not missing features:

- **No online payment gateway** — checkout is **Cash on Delivery (COD)** only.
  Suitable for markets where COD is the standard. Adding a payment provider is
  a separate integration step.
- **No email sending** — there is no SMTP/email provider wiring. Order
  confirmation is shown in-app and handled by the shop team's phone call. No
  feature claims to send email.
- **No customer order history / tracking portal** — customers place orders but
  cannot log in and view past orders. The admin panel manages all orders.
- **No newsletter system** — the newsletter signup was removed because there is
  no backend to store or deliver it.
- **No rate limiting on auth** — documented as a known limitation; add an edge
  rate limiter if you expose the app publicly at scale.

## What currency are prices in?

USD, stored as integers. Delivery fee default is `4`, free over `100`. Change
at `src/lib/constants.ts` and `formatPrice` in `src/lib/utils.ts`.

## Is an external service required?

No. Only Node.js is required. SQLite is a file. Supabase (for Google sign-in)
is the single optional external dependency, and everything works without it.

## Can I sell this item further / re-list it?

No. This is **source code licensed under the license stored in `LICENSE.txt`**
(the item license you purchased from the marketplace applies — e.g. the
standard CodeCanyon license). You may build your own stores; you may not
re-sell, sub-license, or redistribute the source itself. Refer to the exact
terms in the license file you own.

## The demo images are generic graphics — can I use the code with my own photos?

Yes. Product images are managed in the admin panel (uploads go to
`public/uploads`), and the seed's local SVG placeholders under `public/images/`
are placeholder art only — regenerate or replace them with your own
photography.

## Does the app send confirmation emails?

No. The storefront, admin, and codebase never call an email service. After
checkout the customer sees "Our team will contact you shortly to verify your
order" — that is a truthful description of the COD flow.

## What Node version do I need?

Node 22.6+ (the seed script uses native TypeScript). Node 24 is the tested
version.

## How do I update the site's look?

See 05-customization.md — theme tokens live in `src/app/globals.css`, fonts in
the root layout, and brand strings in `src/lib/constants.ts`.