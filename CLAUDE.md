# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

STRIDE — a full e-commerce shoe store built with Next.js (App Router, TypeScript) and Tailwind
CSS: product catalog with category/size filters, client-side cart, checkout via Paystack (test
mode), customer order history, and a role-gated admin dashboard for inventory and order
management. Postgres (hosted on Neon) via Prisma; Auth.js (Credentials provider) for auth.

**This project runs Next.js 16, which has breaking changes vs. older training data** — file
conventions, APIs, and middleware behavior may differ from what you'd otherwise assume. Check
`node_modules/next/dist/docs/` for the installed version's actual behavior before relying on
memory, and heed any deprecation warnings the dev/build output prints (e.g. `middleware` →
`proxy`).

## Commands

```sh
npm install                # also runs `prisma generate` via postinstall
npm run dev                # dev server at localhost:3000
npm run build               # production build
npx tsc --noEmit             # type-check
npx prisma migrate deploy    # apply migrations
npx prisma db seed           # seed 3 categories, 8 products, 1 admin + 1 customer account
npx prisma studio            # browse the database
```

There is no test suite or linter configured beyond `next lint`'s defaults; verify changes by
running the dev server and exercising the flow directly.

Seeded accounts: `admin@stride-shoes.com` / `Admin123!` and `customer@stride-shoes.com` /
`Customer123!`.

## Architecture

**Auth is split into two configs — this is load-bearing, not a style choice.**
`src/auth.config.ts` is an Edge-safe config (no providers, no adapter) used only to read/verify
JWTs. `src/auth.ts` extends it with the `PrismaAdapter` and the `Credentials` provider (which
pulls in `bcryptjs` and Prisma Client). `src/middleware.ts` builds its own lightweight
`NextAuth(authConfig)` instance from the Edge-safe config alone — it must never import from
`src/auth.ts` directly. Vercel's Edge Function bundle limit is 1MB; importing the full config
into middleware pulls in Prisma Client + bcryptjs and blows past that (this broke a real
deploy — see git history around the "Edge Function size" fix). When adding new middleware
logic, only touch `auth.config.ts`'s shape (session/JWT callbacks), never add providers there.

**Cart is client-only** (Zustand + `localStorage`, see `src/store/cart-store.ts`) — no account
needed to browse or add to cart, only to check out. It is never persisted server-side and never
trusted as a source of truth for price or stock.

**Checkout never trusts client-sent prices or stock.** `/api/checkout/initialize` re-validates
every item against the database inside a transaction (see `src/lib/cart-validation.ts`) before
creating an `Order` or calling Paystack. Money is stored as integer kobo (`priceKobo`,
`totalKobo`) throughout — never floats — matching the unit Paystack's API expects.

**Payment confirmation happens twice, by design.** The `/checkout/callback` page calls
`/api/paystack/verify` on redirect for a fast UI update, while `/api/paystack/webhook`
(HMAC-SHA512 signature verified against the raw request body) is the actual source of truth
that marks orders paid and decrements stock. Both paths call the same idempotent
`markOrderPaid()` in `src/lib/order-fulfillment.ts` — if you add a new way to confirm payment,
route it through that function rather than duplicating the stock-decrement logic.

**Order lifecycle**: `PENDING` → `PAID` (webhook/verify) → `SHIPPED` → `DELIVERED`, or `PENDING`
→ `FAILED` (payment failure, or swept by the abandoned-order cron). `/api/cron/expire-orders`
(bearer-token protected via `CRON_SECRET`) sweeps orders left `PENDING` for over an hour to
`FAILED` — scheduled daily via `vercel.json` on Vercel, since stock is never reserved until a
payment actually confirms.

**Roles** (`CUSTOMER` default, `ADMIN`) are enforced twice: in `src/middleware.ts` (redirect
before render) and again server-side in `src/app/admin/layout.tsx` (defense in depth — don't
remove either check).

**Products are soft-deleted** (`isActive: false`, "Deactivate" in the admin product list) rather
than hard-deleted, since existing `Order`/`OrderItem` rows reference them.

**Product images go through Vercel Blob** (`src/app/api/admin/upload/route.ts`,
`src/components/admin/ImageUploadField.tsx`), not local disk — Vercel's filesystem is ephemeral,
so anything saved to disk vanishes between deploys. `BLOB_READ_WRITE_TOKEN` is required for
uploads to work; without it the rest of the app still functions, only uploads 500.

**Database**: Prisma against Neon Postgres needs two connection strings — `DATABASE_URL` (pooled,
`-pooler` in the hostname, used at runtime) and `DIRECT_URL` (same host without `-pooler`, used
only by `prisma migrate`, since PgBouncer's transaction mode doesn't support the session-level
features migrations need).

**Legal pages** (`/privacy-policy`, `/terms-of-service`, `/refund-policy`,
`src/components/legal/LegalLayout.tsx`) are starter templates flagged as not legal advice — don't
present them as complete/compliant without review.

**Motion effects check `prefers-reduced-motion` and disable themselves, not just soften.**
`HeroSlideshow` (crossfade + parallax drift) and `ScrollReveal` (fade-in-on-scroll) both skip
their `useEffect`-driven animation entirely under reduced motion rather than just shortening
durations. Follow the same pattern for any new scroll/timer-driven effect.

**Known deferred work** (see README "Known gaps"): Paystack is in test mode, no transactional
emails (order confirmation, password reset, signup verification) — both deferred until there's a
paying client, since they need a live payment account and an email-sending service respectively.
