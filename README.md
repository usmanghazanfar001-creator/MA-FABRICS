# MA Fabrics — Complete Full-Stack Build (Stages 1–11)

This is the foundation of the full MA Fabrics build: project scaffold, brand design
tokens, and the complete normalized Prisma schema, matching the full spec (products,
categories, collections, colors, inventory, orders, customers, reviews, coupons,
banners, site settings, notifications).

## What's in this stage
- `package.json` — full stack: Next.js App Router, TypeScript, Tailwind, Prisma,
  Zod, React Hook Form, Cloudinary SDK, Framer Motion, Radix primitives.
- `tailwind.config.ts` — brand tokens (navy `#071A2B`, gold `#C9A24A`, cream
  `#F7F1E3`, dark `#151515`) and Playfair Display / Inter typography.
- `prisma/schema.prisma` — every table from the spec, with proper relations,
  indexes, and enums (order status, payment method, video type, etc).
- `prisma/seed.ts` — seeds a dev admin, site settings, the 10 fabric colors,
  base categories/collections, and 3 demo products including MA Hawal Suiting
  (SKU `MA-HW-001`).
- `app/layout.tsx` + `app/globals.css` — root layout wired to your logo/favicon
  and brand fonts.
- Full folder structure for `app/(store)`, `app/admin`, `app/api`, `app/account`,
  `components/*`, `lib/*` per the spec's architecture.
- `public/logo.png`, `public/favicon.png` — your provided brand assets.

## Business rules already encoded in the schema
- Prices are `Decimal`, calculated server-side at order time — never trust a
  client-sent total.
- `Inventory` is tracked in meters per product, separate from `Product`, so
  stock checks/decrements are atomic and auditable.
- `SiteSetting` is a key/value table so the WhatsApp number, shipping rate,
  and currency are admin-configurable, never hard-coded.
- `Order.orderNumber` is a human-readable code (e.g. `MA-2026-001245`) distinct
  from the internal `id`, matching the spec's tracking flow.

## Stage 2 — Design system + homepage (added)
- `components/ui/button.tsx` — themed button primitive (primary/gold/outline/ghost/link).
- `components/product/product-card.tsx` — hover-swap image, color swatches, stock state.
- `components/store/` — `site-header` (transparent-over-hero → solid navy on scroll,
  mobile drawer), `site-footer`, `hero`, `featured-collections` (asymmetric grid),
  `featured-products`, `experience-section`, `color-collection` (10 fabric shades),
  `video-showcase` (horizontal scroll, no autoplay), `about-reviews-whatsapp`
  (about split layout, star reviews, WhatsApp CTA linking to `wa.me`).
- `app/(store)/layout.tsx` + `app/(store)/page.tsx` — full homepage assembled in the
  order from the spec: hero → collections → featured products → experience → colors
  → videos → about → reviews → WhatsApp CTA → newsletter (in the footer) → footer.

**Placeholder images:** section backgrounds reference `/placeholder-*.jpg` paths that
don't exist yet — drop in real photography (or Cloudinary URLs once Stage 5/media is
wired up) at those paths, or swap the `src` props. The demo product/video data in
`featured-products.tsx` and `video-showcase.tsx` is inline for now; it gets replaced
by real Prisma queries once the product pages and data layer are built.

## Stage 3–4 — Shop + filtering, product detail (added)
- `lib/validations/shop-filters.ts` — Zod schema validating every `/shop` query
  param (search, category, collection, color, price range, stock, sort, page).
- `lib/services/products.ts` — real Prisma queries: `getShopProducts` (filtered/
  sorted/paginated), `getProductBySlug`, `getRelatedProducts`, `getFilterFacets`.
  All filtering happens server-side, driven by the URL, so `/shop` results are
  shareable and indexable as required.
- `components/store/shop-filters.tsx` — desktop sidebar + mobile bottom-sheet
  filters (category, collection, color swatches, availability), both reading/
  writing the URL.
- `components/store/shop-controls.tsx` — search box, sort dropdown, pagination.
- `app/(store)/shop/page.tsx` — server component wiring filters → Prisma → grid.
- `components/product/product-gallery.tsx` — thumbnail rail + main image.
- `components/product/product-actions.tsx` — color + quantity selection, Add to
  Cart (UI wired, cart state lands in Stage 5), and a working **Order on
  WhatsApp** button that opens `wa.me` with a pre-filled message (product,
  SKU, color, quantity, total) via `lib/whatsapp/generate-order-message.ts`.
  The WhatsApp number is read from `SiteSetting`, never hard-coded.
- `app/(store)/product/[slug]/page.tsx` — full PDP: gallery, price, specs,
  fabric video, related products, approved reviews, and Product/Offer JSON-LD
  structured data for SEO.

## Stage 5–6 — Cart, checkout, tracking & auth (added)
- `lib/cart/cart-context.tsx` — client cart persisted to `localStorage`, wired into
  the header badge and product page's Add to Cart.
- `app/(store)/cart/page.tsx` — line items, quantity controls, totals, checkout CTA.
- `lib/validations/checkout.ts` + `lib/services/orders.ts` — the checkout server
  action. Critically: **prices and stock are re-fetched and verified server-side
  inside a DB transaction** — the client cart is never trusted for totals. It
  generates the `MA-{year}-{seq}` order number, validates coupons, decrements
  `Inventory`, and writes a `Notification` row.
- `app/(store)/checkout/page.tsx` — 4-step flow (customer → shipping → review →
  payment), COD/Bank Transfer now, structured so an online gateway slots in later
  without a rewrite.
- `app/(store)/order-success/page.tsx`, `app/(store)/track-order/page.tsx` — order
  number + phone lookup with a visual status timeline.
- **Auth**: `lib/auth/password.ts` (bcrypt), `lib/auth/session.ts` (signed JWT in
  an httpOnly cookie via `jose`), `lib/auth/actions.ts` (register/login/logout
  server actions — login always returns the same generic error for a wrong email
  or password, so it doesn't leak which emails are registered).
- `middleware.ts` — protects `/account/*` (any signed-in user) and `/admin/*`
  (ADMIN/STAFF role only), redirecting to the right login with a `redirect` param.
- `app/(store)/login`, `/register`, `app/account`, `/account/orders`,
  `/account/profile` — customer auth + account pages.
- `app/admin/login` (standalone, no storefront chrome) and `app/admin/dashboard`
  (a minimal protected placeholder proving the role check works — the real admin
  CRUD screens are Stage 7).

## Stage 7 — Admin dashboard (added)
Route structure: `app/admin/login` is chrome-free; everything else lives under
`app/admin/(dashboard)/*`, which shares `AdminSidebar` + `AdminTopbar` via
`app/admin/(dashboard)/layout.tsx`. Every admin server action calls
`requireAdmin()` (`lib/auth/guards.ts`) itself — defense in depth on top of
`middleware.ts`, so an action is never reachable just because a client bypassed
the page's route protection.

- **Products** (`/admin/products`) — table with inline publish/feature toggles
  and delete (soft delete, so order history stays intact); `/new` and `/[id]`
  share `components/admin/product-form.tsx` (React Hook Form + the same Zod
  schema, color multi-select, stock field that writes straight to `Inventory`).
- **Categories** / **Colors** — list + inline create + active/inactive toggle.
- **Videos** (`/admin/videos`) — create linked to a product, type, publish
  toggle, delete.
- **Orders** (`/admin/orders`) — table of every order; `/[id]` shows customer,
  shipping, line items, totals, a full status-workflow button row (Pending →
  ... → Delivered, or Cancelled), and order notes.
- **Customers** — read-only table (name, email, phone, order count).
- **Reviews** (`/admin/reviews`) — approve / reject / delete; only approved
  reviews show on the storefront (already enforced in `getProductBySlug`).
- **Coupons** — create (code, % or fixed, min order, max discount, usage
  limit, date range) + active toggle. `createOrder` already validates all of
  this server-side at checkout.
- **Banners** — create (title, subtitle, image/link URL) + active toggle.
- **Settings** (`/admin/settings`) — WhatsApp number, shipping rate, currency,
  and two homepage hero fields, all stored in `SiteSetting` — confirms nothing
  business-specific is hard-coded in source, per the spec's business rules.

## Stage 8 — Closing the gaps (added)
- **Cloudinary is wired end-to-end** for products: `lib/storage/cloudinary.ts`,
  a validated upload route at `app/api/admin/upload/route.ts` (admin-only,
  MIME allowlist, 8MB image / 100MB video limits), and
  `components/admin/image-uploader.tsx` — real drag-and-drop, multi-file,
  preview grid, drag-to-reorder, and delete — wired into the product form's
  `imageUrls` field and persisted through `create`/`updateAdminProduct`.
- **Shipping fee is now live**: `lib/services/site-settings.ts` reads
  `SiteSetting.shipping_flat_rate` and both `/cart` and `/checkout` (now
  server-wrapped: `cart-view.tsx` / `checkout-view.tsx` take it as a prop)
  display exactly what `createOrder` will charge — no more drift between the
  displayed total and the server-calculated one.
- **WhatsApp CTA on the homepage** now reads the number from `SiteSetting`
  too, same as the product page already did.
- **SEO**: `app/sitemap.ts` (products, categories, collections, static pages)
  and `app/robots.ts` are live; Organization + WebSite JSON-LD sits in the
  root layout, and the product page now also emits BreadcrumbList alongside
  its existing Product JSON-LD.

## Stage 9 — Uploader on banners & categories (added)
- `components/admin/single-image-field.tsx` — a single-image variant of the
  same upload flow (click or drag-drop, preview, remove), backed by the same
  `/api/admin/upload` route.
- Wired into `/admin/categories` (category `imageUrl`) and `/admin/banners`
  (banner `imageUrl`), both of which now also show a thumbnail in their list.

## Stage 10 — Homepage actually driven by the CMS (added)
Previously "Settings" wrote hero text nobody read, and Featured Collections/
Products were hardcoded arrays — the homepage wasn't really a CMS yet. Now:
- **Hero** (`components/store/hero.tsx`) takes `heading`/`text` as props;
  the homepage reads them from `SiteSetting` (`homepage_hero_heading`,
  `homepage_hero_text`, editable in `/admin/settings`) and falls back to the
  original copy if unset.
- **Featured Collections** queries `Collection` where `isActive`, in the new
  `/admin/collections` (list + create + image upload + active toggle) —
  a page that didn't exist before; collections could be seeded but not
  managed.
- **Featured Products** now queries `Product` where `isFeatured && isPublished`
  directly, replacing the inline demo array — the "Featured" toggle in
  `/admin/products` now actually controls the homepage.
- **New**: `components/store/promo-banners.tsx` renders up to 2 active,
  in-date `Banner` rows between Collections and Products — `/admin/banners`
  now visibly does something on the storefront, not just in its own table.

Net effect: hero copy, featured collections, featured products, and
promotional banners are all now editable from `/admin` without touching code,
which was the actual point of spec section 23.

## Stage 11 — Completing the spec (added)
Auditing against the original acceptance criteria turned up real gaps —
pages that were linked in the header/footer but never built, and a video
"showcase" that couldn't actually play video. Closed:

- **Missing pages, now built**: `/collections` (grid of active collections),
  `/collections/[slug]` (banner + filtered product grid), `/about`,
  `/contact` (form that opens a pre-filled WhatsApp chat — no email backend
  to wire it to yet), and `/videos` (full gallery, click-to-play).
- **Videos now actually play**: `components/product/video-player.tsx` (PDP)
  and `components/store/video-gallery-grid.tsx` (`/videos`) render real
  `<video>` elements, click-to-play, and — per spec — **never autoplay more
  than one video at a time**: playing a new one pauses whatever else is
  playing. The homepage teaser now correctly links through to `/videos`
  rather than pretending to be a player itself.
- **Error/loading/empty states** (spec section 33, previously skipped):
  `app/not-found.tsx` (404), `app/global-error.tsx` (500, no stack traces
  shown to the customer), `app/(store)/error.tsx` (scoped storefront error
  boundary), and `loading.tsx` skeletons for `/shop` and `/product/[slug]`.
- **Rate limiting** (spec section 25, previously skipped): `lib/security/
  rate-limit.ts` is an in-memory fixed-window limiter — noted in its own
  comment that it needs a Redis-backed replacement (e.g. Upstash) for a
  multi-instance/serverless deployment — applied to login, registration, and
  order placement.
- **Accessibility**: a skip-to-content link and `#main-content` landmark
  site-wide, on top of the focus-visible states and aria-labels already in
  place.

## Stage 12 — Real info from your flyer (added, corrected)
You shared a Grace Fabrics International flyer for "Hawal Suiting by MA" —
its colors already matched the seeded 10-shade palette exactly. This pulls
the *information* from it into the seed data; the flyer graphic itself is
promotional artwork, not product photography, so it is **not** used as a
product image anywhere on the site:
- MA Hawal Suiting now ships in all 10 colors (previously a 6-color sample)
  and its description picks up the flyer's "Super fine quality" line.
- `SiteSetting.whatsapp_number` seeds to `+923001234567` and a new
  `SiteSetting.shop_address` seeds to `Shop # G-45, Karkhana Bazar,
  Faisalabad` — both editable in `/admin/settings`, and both flow into the
  footer, `/contact`, and every WhatsApp button site-wide.
- `/about` mentions Karkhana Bazar, Faisalabad as the base.
- The product image stays the generic `/placeholder-fabric.jpg` until real
  product photography is uploaded through the admin uploader.

**Still explicitly temporary** — double-check the phone number and address
are actually correct for the business before this goes live; nothing here
was verified against a real source beyond the image you sent.

## Stage 13 — Animated redesign pass, inspired by limelight.pk (added)
You pointed at limelight.pk as a style reference. Rather than copying its
actual branding/colors (that's their trademark), this pulls the *structural*
ideas — a multi-slide hero carousel and a dense "shop by category" tile grid
— into MA Fabrics' own navy/gold/cream identity, and finally puts
`framer-motion` (in `package.json` since Stage 1, unused until now) to work:

- **`components/store/hero-carousel.tsx`** replaces the static hero: 3
  auto-advancing slides (6s interval, pauses on hover, stops entirely if the
  visitor has `prefers-reduced-motion` set), crossfade + slide-up text
  transitions, dot/arrow controls. Still reads the CMS `heading`/`text`
  settings for its first slide.
- **`components/store/shop-by-category.tsx`** + `shop-by-category-grid.tsx`
  — a new homepage section: a dense, Limelight-style tile grid of your real
  `Category` rows, each tile scroll-revealing with a staggered fade-up and
  scaling slightly on hover.
- **`components/store/reveal-on-scroll.tsx`** — a small reusable wrapper now
  applied to every major homepage section, so the whole page fades up into
  view as you scroll rather than popping in all at once.
- **Footer**: added a "Powered by Noviqoagency" credit line linking to
  https://usmanghazanfar.vercel.app/, next to the copyright and address.

The old static `components/store/hero.tsx` was removed since the carousel
fully replaces it.

## What's genuinely still open
- Rate limiting is single-instance only (see the comment in `rate-limit.ts`);
  swap it before a real multi-instance/serverless production deploy.
- The contact form routes through WhatsApp rather than email/a stored
  inquiry — there's no `Inquiry` model in the schema for it to write to.
- No drag-and-order UI for homepage layout (still true from Stage 10).
- **Still hasn't run against a live database or a real `npm install`** — this
  has been written and reasoned about file-by-file, not compiled. Treat your
  first `npm run dev` after `prisma migrate dev` as the actual first build —
  bring back whatever TypeScript or runtime errors surface and I'll fix them.

## Running it locally
```bash
npm install
cp .env.example .env      # DATABASE_URL, AUTH_SECRET, Cloudinary keys
npx prisma migrate dev --name init
npm run seed               # creates the dev admin from SEED_ADMIN_EMAIL/PASSWORD
npm run dev
```
Sign in at `/admin/login` with the seeded admin credentials, and at `/login`
or `/register` for the customer side.

Say the word and I'll take on any of the "still open" items above, or keep
going toward full production hardening.
