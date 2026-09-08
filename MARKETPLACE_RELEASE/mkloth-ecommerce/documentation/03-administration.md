# 03. Administration

The admin panel lives at **`/admin`** and is accessible only to accounts with
the `ADMIN` role. Non-admin visits are redirected to the storefront.

## Logging in

1. Go to `/login` and sign in with the admin email/password.
2. Visit `/admin` (or use the "Admin" link in the account menu).

> The admin role is set at account creation. The demo admin is seeded by
> `npm run db:seed` (see 02-configuration). Only an ADMIN can create products,
> manage categories, handle orders, or upload images.

## Dashboard

The dashboard shows key numbers at a glance:

- Total products and total orders
- Total revenue (sum of order totals)
- Orders received today
- Status breakdown (pending / processing / shipped / delivered / cancelled)

## Products

**List (`/admin/products`)** — browse all products with thumbnail, price, and
stock badge; edit or delete any product.

**Create / edit (`/admin/products/new` and `/admin/products/[id]`)**:

- Name, description, slug (auto-suggested, must be unique)
- Price and compare-at price (integers, USD)
- Category, stock availability, and flags (New / Best Seller / Featured)
- Images — multiple uploads, reorderable, removed per-image
- Colors and sizes assigned to the product

Image uploads accept JPG, PNG, WEBP, and GIF up to 5 MB; files are validated by
content sniffing.

> **Deleting a product that appears in past orders is safe.** Order history is
> preserved — the order line keeps its snapshot of the product name, price, and
> image, and the product reference is nulled (rows are no longer linked to the
> deleted product).

## Categories

Manage the shop's categories (`/admin/categories`): name, slug, image, and a
short description. Products belong to exactly one category.

> You cannot delete a category that still contains products. Move or delete
> its products first.

## Orders

**List (`/admin/orders`)** — all orders with customer, order number, total, and
status. Filter by status (Pending, Processing, Shipped, Delivered, Cancelled).

**Detail (`/admin/orders/[id]`)** — full order summary: customer contact and
shipping address, the items (size, color, quantity, price snapshot), totals,
and the COD (cash on delivery) payment method. Advance the order by changing
its status.

Order numbers look like `CB-YYYYMMDD-NNNN`.

### The checkout model

Checkout is **Cash on Delivery only** — there is no online payment gateway.
Customers place an order, and your team calls them to confirm before shipping.
This is a deliberate, simple design; adding Stripe/PayPro/Razorpay as a future
step does not change the rest of the stack.