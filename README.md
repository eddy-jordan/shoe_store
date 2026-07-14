# STRIDE — Shoe Store

A full e-commerce shoe store: product catalog with category/size filters, cart, checkout with
Paystack (test mode), customer order history, and an admin dashboard for inventory and order
management.

**Stack:** Next.js (App Router, TypeScript) + Tailwind CSS, Postgres on Neon via Prisma,
Auth.js (Credentials provider, role-based access), Paystack for payments.

## Setup

1. **Install dependencies**

   ```sh
   npm install
   ```

2. **Database (Supabase)**

   Create a free project at [supabase.com](https://supabase.com), then go to
   **Connect → ORM** and copy the Prisma connection strings. Set them in `.env`
   (copy `.env.example` first):

   ```
   DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true&connection_limit=10"
   DIRECT_URL="postgresql://...:5432/postgres"
   ```

   > `connection_limit` is Prisma's own client-side pool size, not the pgbouncer pool. Keep it
   > above 1 — a single connection serializes every query in the process, so any page issuing
   > parallel queries (`Promise.all`) will queue behind itself and time out.

   Run the migration and seed data:

   ```sh
   npx prisma migrate deploy
   npx prisma db seed
   ```

   This seeds 3 categories, 8 products with sizes/stock, and two test accounts:
   - Admin: `admin@stride-shoes.com` / `Admin123!`
   - Customer: `customer@stride-shoes.com` / `Customer123!`

3. **Auth**

   Generate a secret and set it in `.env`:

   ```sh
   npx auth secret
   ```

4. **Paystack (test mode)**

   Create a free account at [paystack.com](https://paystack.com), switch on **Test Mode**, and
   copy the test keys from Settings → API Keys & Webhooks into `.env`:

   ```
   PAYSTACK_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_..."
   ```

   Paystack can't reach `localhost` for webhooks, so for local testing tunnel your dev server
   (e.g. `cloudflared tunnel --url http://localhost:3000` or `ngrok http 3000`) and register the
   tunnel's `/api/paystack/webhook` URL in the Paystack test-mode dashboard. Use the test card
   `4084 084084 084081` (any future expiry, any CVV) to complete a payment.

   > Paystack's email validator rejects reserved TLDs like `.test` ("Invalid Email Address
   > Passed") — use a normal-looking domain for any account that will check out.

5. **Cron: expiring abandoned orders**

   Orders left `PENDING` (checkout started, payment never confirmed) are swept to `FAILED` after
   an hour by `/api/cron/expire-orders`, protected by a `CRON_SECRET` bearer token. On Vercel this
   is already scheduled via `vercel.json` (daily) and Vercel injects the `Authorization` header
   for you automatically as long as `CRON_SECRET` is set in your project's environment variables.
   On another host, call it yourself on a schedule, e.g. a GitHub Actions cron:

   ```yaml
   - run: curl -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" https://yourdomain.com/api/cron/expire-orders
   ```

6. **Run the app**

   ```sh
   npm run dev
   ```

## Architecture notes

- **Cart** is client-only (Zustand + localStorage) — no account needed to browse or add to cart,
  only to check out. See `src/store/cart-store.ts`.
- **Checkout never trusts client-sent prices or stock.** `/api/checkout/initialize` re-validates
  everything against the database inside a transaction before creating an order or calling
  Paystack. See `src/lib/cart-validation.ts`.
- **Payment confirmation** happens twice: the `/checkout/callback` page verifies the transaction
  on redirect for a fast UI update, and `/api/paystack/webhook` (HMAC-signature verified) is the
  source of truth that actually marks orders paid and decrements stock. Both call the same
  idempotent `markOrderPaid` in `src/lib/order-fulfillment.ts`.
- **Products are soft-deleted** (`isActive: false`) rather than hard-deleted, since existing
  orders reference them — see the "Deactivate" action in the admin product list.
- **Roles**: `CUSTOMER` (default) and `ADMIN`, enforced in `src/middleware.ts` and again
  server-side in `src/app/admin/layout.tsx`.
- **Legal pages** (`/privacy-policy`, `/terms-of-service`, `/refund-policy`) are starter templates,
  not legal advice — have them reviewed by a lawyer before relying on them with real customers.

## Known gaps before a real launch

- **Paystack is in test mode.** Switching to live keys (and registering a live webhook URL) is
  deferred until there's a paying client.
- **No transactional emails** (order confirmation, password reset, signup verification) — these
  all need an email-sending service (e.g. Resend), deferred alongside the Paystack live switch.
- No automated tests, error monitoring, or CI/CD pipeline yet.
