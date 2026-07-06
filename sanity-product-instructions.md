# Sanity Product Instructions

A practical, developer-facing guide for building the product content model in **Sanity** from scratch for **DNAture 2026**—a Costa Rican pet nutrition ecommerce platform built on Next.js 16, Supabase, and Sanity.

---

## 1. Purpose of this document

DNAture 2026 is a **new, Sanity-first project** designed from the ground up to consume product data from Sanity CMS. The goal of this guide is to:

- **Design the product content structure in Sanity from scratch.** This is not a migration or port; we are building the model to match DNAture's business requirements and the Next.js 16 App Router architecture.
- **Establish best practices for product authoring and validation** in the Sanity Studio.
- **Wire the Next.js application to fetch and render product data** from Sanity via GROQ queries, ISR caching, and the existing `src/lib/sanity/` client infrastructure.
- **Ensure the model is clean, well-typed, and free of CMS-specific noise.** Sanity exposes `_id` and `_rev` natively; we do not model these. All prices are stored as integers in centimos per the project's Costa Rican currency rules.

The Sanity schema should be the single source of truth for product structure. The frontend consumes it via GROQ projections that are optimized for listing vs. detail pages.

---

## 2. Recommended Sanity content model

The core content type is a single document called **`product`**.

### 2.1 Fields

| Field | Type | Required | Purpose |
|---|---|---|---|
| `productName` | string | ✅ | Display name on cards, detail pages, cart, invoices. |
| `slug` | slug (source: `productName`) | ✅ | Canonical URL segment for the product detail page. |
| `category` | reference → `category` document | ✅ | Drives listing pages, filtering, navigation. |
| `description` | array (Portable Text) | ✅ | Long-form marketing copy on the detail page. |
| `shortDescription` | text (max ~160 chars) | ⛅ recommended | One-liner used on cards and meta descriptions. |
| `presentation` | string | ✅ | Size / measurement label (e.g. `"200 g"`, `"1 kg"`). Replaces Contentful `medida`. |
| `price` | number (integer, in centimos / CRC) | ✅ | Base price. Store as integer per the project's money rules. |
| `pricePerUnit` | number (integer, in centimos) | ⛅ optional | Computed price per gram/ml, shown next to price. |
| `rating` | number (1–100, ascending = better) | ⛅ optional | Manual sort key for listing order (lower = higher). |
| `ingredients` | array of string | ⛅ optional | Bullet list shown on the detail page. |
| `images` | array of `productImage` objects | ✅ (≥ 1) | Gallery; the first item is the main image. |
| `icons` | array of `productIcon` objects | ⛅ optional | Trust / feature badges (e.g. "grain-free", "made in CR"). |
| `seo` | object (`seoMetadata`) | ⛅ optional | Per-product overrides for title, description, OG image. |
| `featured` | boolean (default `false`) | ⛅ optional | Surface on the home page or "featured" rails. |
| `available` | boolean (default `true`) | ✅ | Editorial soft-disable without unpublishing. |

> **Do not model:** `sys.id`. Sanity provides `_id` and `_rev` automatically.
> **Do not model:** `urlSlug` separately from `slug` — collapse into one slug field.

### 2.2 Required vs optional summary

- **Required:** `productName`, `slug`, `category`, `description`, `presentation`, `price`, at least one image, `available`.
- **Recommended:** `shortDescription`, `pricePerUnit`, `rating`, `seo`.
- **Optional:** `ingredients`, `icons`, `featured`.

### 2.3 Usage on the frontend

- **Listing pages / product cards:** `productName`, `slug`, `category`, `shortDescription`, `presentation`, `price`, `pricePerUnit`, `rating`, first item of `images`, `available`.
- **Product detail pages:** all of the above plus `description`, `ingredients`, full `images` array, `icons`, `seo`.

---

## 3. Category modeling recommendation

**Recommendation: model `category` as a separate Sanity document, not as a string on the product.**

### Why

- A single source of truth for category name, slug, display order, and copy.
- Renaming a category propagates everywhere.
- Allows category pages to have their own SEO, hero copy, and image.
- Avoids inconsistent strings (e.g. `"Snacks"` vs `"snacks"` vs `"Snack"`).

### `category` document fields

| Field | Type | Required | Purpose |
|---|---|---|---|
| `name` | string | ✅ | Display label (e.g. `"Snacks"`). |
| `slug` | slug (source: `name`) | ✅ | URL segment for the category page. |
| `priorityIndex` | number | ✅ | Ordering on listing pages (lower = earlier). Replaces the hard-coded `categoriesPriority` array. |
| `shortDescription` | text | ⛅ optional | Subtitle on the category page. |
| `heroImage` | image | ⛅ optional | Banner on the category page. |
| `seo` | object (`seoMetadata`) | ⛅ optional | Category-page SEO. |

The product's `category` field references one `category` document. The frontend dereferences `category->{ name, "slug": slug.current, priorityIndex }` in its GROQ projection.

---

## 4. Image and icon modeling

### 4.1 Product images

Model `images` as an **array of an inline `productImage` object** (not a bare `image` array). This lets each entry carry per-image metadata.

`productImage` object fields:

| Field | Type | Required | Purpose |
|---|---|---|---|
| `asset` | image (with `hotspot: true`) | ✅ | The underlying file. |
| `alt` | string | ✅ | Accessibility + SEO. Must be authored, never default to filename. |
| `caption` | string | ⛅ optional | Optional caption shown under the image. |

Ordering is the array order — the first entry is the **main image** used on cards and as the OG image fallback. No separate "main image" boolean is needed.

### 4.2 Product icons

Icons are trust/feature badges and should be a curated, **reusable** set — not free-form uploads per product.

Two valid approaches:

1. **Recommended:** create a `productIcon` document type with `label`, `slug`, `image`, and `description`. The product references icons. This avoids re-uploading the same "grain-free" badge across products and keeps the icon library consistent.
2. **Simpler fallback:** an inline `productIcon` object array on the product, with `image` + `label`. Use this only if the icon set will stay tiny and rarely change.

### 4.3 Accessibility and SEO

- `alt` is **required** at the schema level on every image.
- The icon `label` doubles as `alt` text when the icon is rendered.
- The first product image should be wide enough to serve as an Open Graph image (≥ 1200 × 630 recommended). Sanity's image pipeline can crop to OG ratio at request time.
- Always render images through Sanity's image URL builder so width/format/quality are negotiated per device.

---

## 5. Field design principles

When building the Sanity schema, apply these design principles:

### Naming conventions

- Use clear, English field names: `productName`, `presentation`, `price`, `pricePerUnit`, `ingredients`.
- Avoid CMS-specific jargon or legacy abbreviations (e.g., use `presentation` not `medida`, use `slug` not `urlSlug`).
- Keep field names short but self-documenting—the Studio UI will display them as-is.

### Structural best practices

- **Do not model:** `_id`, `_rev`, `__typename`, or any other auto-generated Sanity fields. Use `_id` natively when you need a document identifier.
- **Use a single slug field**, not separate `slug` and `urlSlug` variants. Sanity's slug input generates from a source field and is editable by authors.
- **Promote rich content:** `description` should be Portable Text (block array with marks, styles, custom blocks), not plain text. This allows editors to add headings, lists, and links without leaving the Studio.
- **Use references for relationships:** `category` and `icons` should reference separate document types, not be stored as strings on the product. This keeps data consistent and enables bidirectional queries (e.g., "fetch all products in category X").
- **Require accessibility data:** Every image must have `alt` text, required at the schema level. Icons must have a human-readable `label`.
- **Currency as integers:** All prices (`price`, `pricePerUnit`) are integers representing centimos (CRC). This avoids floating-point math errors and matches the project's money rules.

### What the model provides to the frontend

- A **lightweight listing projection** for product cards: name, slug, category, image, price, availability.
- A **rich detail projection** for product pages: all fields plus Portable Text description, ingredients, full gallery, icons, and SEO metadata.
- **Consistent ordering** via `category.priorityIndex` and `product.rating`, eliminating hard-coded priority arrays in the frontend.
- **Editorial control** over product availability and feature flags without unpublishing.

---

## 6. Product listing data requirements

Listing pages (home rails, category pages, search results) should fetch a **lightweight** projection per product.

Minimum fields needed for a product card:

- `_id`
- `productName`
- `"slug": slug.current`
- `"category": category->{ name, "slug": slug.current, priorityIndex }`
- `shortDescription`
- `presentation`
- `price`
- `pricePerUnit`
- `rating`
- `"mainImage": images[0]{ "url": asset->url, alt, asset->metadata{ lqip, dimensions } }`
- `available`

Guidance:

- **Do not** fetch `description` (Portable Text), `ingredients`, full `images[]`, or `icons` on listing pages. They inflate payloads and are not rendered.
- Order results by `category->priorityIndex asc, rating asc, productName asc` to replace the hard-coded priority array currently in `services/products.js`.
- Filter `available == true` at query time so unpublished/disabled items never reach the UI.

---

## 7. Product detail data requirements

Detail pages need the full document. Project at least:

- All fields listed in §6 (the listing projection).
- `description` (Portable Text) — render with a Portable Text component.
- `ingredients[]`.
- Full `images[]` with `asset`, `alt`, `caption`, and `asset->metadata`.
- `icons[]` dereferenced as `icons[]->{ label, "slug": slug.current, image, description }`.
- `seo{ metaTitle, metaDescription, ogImage }` — fall back to `productName` / `shortDescription` / `images[0]` when empty.

Detail-page queries should fetch **by slug**, not by `_id`, so URLs are stable and shareable.

---

## 8. Sanity Studio setup workflow

Recommended order of work inside the Sanity workspace:

1. **Initialize the Studio (if not already present).**
   - `pnpm dlx sanity@latest init` (from the `sanity/` workspace folder).
   - Pick the existing project ID and dataset.
2. **Define the `category` document type first.** Products depend on it via reference; build the dependency before the dependent.
3. **Define the `productIcon` document type** (if going with the reusable-library approach).
4. **Define the inline objects** `productImage`, `seoMetadata` (likely already exists in this repo).
5. **Define the `product` document type**, wiring up the references and inline objects defined above.
6. **Configure document previews.**
   - `product` preview: title = `productName`, subtitle = `presentation` + price formatted in CRC, media = `images[0].asset`.
   - `category` preview: title = `name`, subtitle = `priorityIndex`.
7. **Add validation rules** (see §11).
8. **Register the new schemas in `sanity/schemas/index.ts`.**
9. **Run the Studio locally** (`pnpm sanity dev` or the equivalent script in the `sanity/` workspace) and confirm the desk shows the new document types.
10. **Create 1–2 sample categories and 2–3 sample products** to exercise the model end-to-end.
11. **Review the document JSON** in the Vision tool to confirm shape, then run a GROQ query that matches the listing projection in §6 to confirm the data is consumable.

---

## 9. Frontend consumption workflow

A conceptual, code-free walkthrough for integrating Sanity product data into the DNAture 2026 Next.js codebase.

1. **Stand up the Sanity data layer.**
   - Verify the Sanity client is configured in `src/lib/sanity/client.ts` with the correct project ID, dataset, API version, and `useCdn: true` for public reads.
   - All queries are centralized in `src/lib/sanity/queries.ts` using GROQ tagged templates.
2. **Implement the product listing fetch.**
   - Create a server-side function that runs the listing GROQ projection from §6, ordered by category priority and rating.
   - Use ISR with `revalidate: 300` (5 minutes) for product listing pages so editors see updates quickly without hammering Sanity.
3. **Implement the product detail fetch.**
   - Create a server-side function that fetches by `slug.current` and returns the full detail projection from §7.
   - Use ISR with `revalidate: 0` (on-demand via webhook) or a shorter TTL (60–300 seconds) since product details change frequently (price, stock, description).
4. **Build product card components** to consume the listing projection.
   - Use Next.js `<Image>` with Sanity image URL builder for optimized delivery.
   - Render `alt` text from the image metadata.
   - Format prices with the project's CRC helper.
5. **Build product detail pages** as a catch-all route `[slug]/page.tsx`.
   - Query by `slug.current` to fetch the document.
   - Render Portable Text `description` using a Portable Text component (e.g., `@portabletext/react`).
   - Display the full image gallery with lightbox behavior if needed.
   - Render `ingredients` as a bulleted list; hide if empty.
   - Render `icons` with accessible labels.
   - Use the `seo` projection to set page metadata and Open Graph tags.
6. **Implement category filtering and navigation.**
   - Category pages query products filtered by `category._id`.
   - Use category `slug.current` for URL routing (e.g., `/productos/categoria/snacks`).
7. **Set up ISR revalidation for Sanity webhooks.**
   - Configure the Sanity webhook to POST to `/api/revalidate/sanity` on product/category publish/unpublish.
   - The webhook handler revalidates affected paths so editors see their changes reflected on the site within seconds.
8. **Add error boundaries and fallbacks.**
   - If Sanity is unavailable, fall back to ISR-cached content (via `revalidateTag`).
   - Show graceful "product not found" pages for unpublished or deleted products.
9. **Test every category and product slug** with the live Sanity dataset.

---

## 10. Routing and slug strategy

- **Product URL:** `/<locale>/productos/<product-slug>` (es) and `/<locale>/products/<product-slug>` (en).
- **Category URL:** `/<locale>/productos/categoria/<category-slug>` (or equivalent in the existing route tree).
- **Slug source:** `productName` for products, `name` for categories — generated by Sanity's slug input, editable by editors.
- **Uniqueness:** slugs must be unique per document type (enforced via Sanity validation, see §11).
- **Avoiding broken URLs:**
  - Treat the slug as **immutable in practice**. When an editor must rename it, capture the previous slug.
  - Add an optional `previousSlugs: string[]` field on the `product` document. Use it to generate 301 redirects from old URLs to the current slug. Same pattern for `category`.
  - Always link internally via `slug.current` resolved at query time, never via hard-coded paths.

---

## 11. Validation and editorial rules

Validation should be enforced inside Sanity Studio so bad data never reaches the API. Recommended rules:

- **`product.productName`** — required, min 2 chars, max 120 chars.
- **`product.slug`** — required, unique across the `product` document type, lowercase, kebab-case (Sanity's slug input enforces this).
- **`product.category`** — required reference to a `category` document.
- **`product.description`** — required, must contain at least one block.
- **`product.presentation`** — required, non-empty string.
- **`product.price`** — required, integer, ≥ 0. Add a custom validator that rejects floats to keep the centimos contract.
- **`product.pricePerUnit`** — if present, must be ≥ 0 and ≤ `price`.
- **`product.rating`** — if present, integer between 1 and 100.
- **`product.images`** — required, min 1 entry. Each entry's `alt` is required.
- **`product.icons`** — optional; if present, no duplicates.
- **`product.available`** — required boolean, defaults to `true`.
- **`category.name`** — required, unique.
- **`category.slug`** — required, unique across `category`.
- **`category.priorityIndex`** — required, integer, ≥ 0.

Also configure:

- **Initial values** for booleans (`available: true`, `featured: false`).
- **`orderings`** on the `product` schema so editors can sort the desk by category, rating, or price.
- **Read-only** flag on `_id` displays in custom preview components — editors should never need to touch internal IDs.

---

## 12. SEO considerations

Product SEO fields that matter:

- **`seo.metaTitle`** — optional override; falls back to `productName | DNAture`.
- **`seo.metaDescription`** — optional override; falls back to `shortDescription`.
- **`seo.ogImage`** — optional override; falls back to `images[0]`.
- **`seo.canonicalUrl`** — optional; only set when a product is intentionally duplicated.
- **`slug`** — must be human-readable, kebab-case, and stable.

Image-level SEO:

- Every image's `alt` is required at the schema level — this is the single biggest accessibility + SEO lever.
- Serve images through Sanity's image URL builder with explicit width and format (`auto=format`) to win Core Web Vitals.
- Use `metadata.lqip` from the image asset for blur-up placeholders in `next/image`.

Structured data (out of scope for the schema, but worth noting):

- The Sanity model already carries everything needed to emit Product schema.org JSON-LD on the detail page: `productName`, `description`, `images`, `price` + currency, `category`, `available`.

---

## 13. Testing checklist

Run through this list before declaring Sanity product data production-ready.

### Listing pages

- [ ] Product cards render `productName`, `presentation`, formatted `price`, `pricePerUnit`, main image with `alt`.
- [ ] Cards link to the correct product detail URL using `slug.current`.
- [ ] Listing order matches `category.priorityIndex` then `rating`.
- [ ] Unpublished or `available == false` products do not appear.
- [ ] Empty category (no products) renders a graceful empty state.

### Detail pages

- [ ] Detail page loads by slug (not by `_id`).
- [ ] Portable Text `description` renders with correct heading/list/link styles.
- [ ] All gallery images load with their `alt` text.
- [ ] `ingredients` list renders when present and is hidden when empty.
- [ ] `icons` render with `label` as accessible name.
- [ ] `seo.metaTitle`, `seo.metaDescription`, and OG image are picked up by the page metadata.

### Category filtering & routing

- [ ] Category pages list only products in that category.
- [ ] Switching locales preserves the product (slug resolves correctly in both `/productos/...` and `/products/...`).
- [ ] Old slugs in `previousSlugs` redirect (301) to the current slug.

### Prices

- [ ] Prices display formatted in CRC via the project's `formatCRC()` helper.
- [ ] No floating-point math: every price is an integer centimos value at the data layer.

### Fallback / error states

- [ ] Unknown product slug renders a 404.
- [ ] Sanity outage path returns ISR-cached content where applicable; never crashes the page.
- [ ] Missing `seo` fields gracefully fall back to product-level defaults.

### Studio

- [ ] Validation prevents publishing a product without a category, slug, image, price, or description.
- [ ] Slug uniqueness is enforced for both products and categories.

---

## 14. Development workflow notes

- **This is greenfield development.** DNAture 2026 is built on Sanity from the start; no migration from legacy CMS is required.
- **Parallel development.** Backend (Sanity schema) and frontend (Next.js data layer) can proceed in parallel once the schema (§8) is drafted and 2–3 sample documents are in the Studio.
- **Seed data.** Create a few representative products (e.g., 1–2 per category) directly in the Studio to exercise the schema, then author the full catalog over time. For bulk imports later, a Node.js script using `@sanity/client` can seed from a CSV or JSON file.
- **ISR strategy.** Use on-demand revalidation (via Sanity webhooks) for detail pages since prices and descriptions change frequently. Use shorter TTLs (5–10 min) for listing pages so category changes and stock updates propagate quickly.
- **Accessibility and SEO.** Require `alt` text for every image at the schema level. Enforce unique, human-readable slugs. Add structured data (Product schema.org) to detail pages so search engines understand the catalog.
- **Cost optimization.** Sanity's `useCdn: true` routes requests to Fastly CDN; this reduces API costs and improves latency for readers. Use the API token (with restricted permissions) only in Server Components and API routes, never in the browser.

---

## 15. Final recommended implementation order

1. **Schemas in Sanity** — define `category`, `productIcon` (if used), `productImage` (inline), and `product` in the `sanity/` workspace under `schemas/`.
2. **Register schemas** in `sanity/schemas/index.ts`.
3. **Add validation + previews** — configure validation rules at the schema level and desk preview components so editors see a rich preview of each document.
4. **Seed sample content** — create 1–2 categories, 1–2 icon definitions, and 2–3 complete products in the Studio. This exercises the schema end-to-end before the frontend is wired.
5. **GROQ queries** — write and test the listing and detail projections in `src/lib/sanity/queries.ts`.
6. **Product listing pages** — build `src/app/[locale]/productos/page.tsx` and `src/app/[locale]/products/page.tsx` to fetch and render the listing projection. Use ISR with `revalidate: 300`.
7. **Product detail pages** — build `src/app/[locale]/productos/[slug]/page.tsx` and `src/app/[locale]/products/[slug]/page.tsx` to fetch by slug and render the full detail projection. Include Portable Text, images, ingredients, icons, and SEO metadata.
8. **Category pages** — build category listing and filtering (if needed) using the `category` reference.
9. **Sanity webhook** — set up the webhook in the Sanity Studio UI to POST to `/api/revalidate/sanity` on publish/unpublish. The API route handler revalidates affected paths.
10. **Error handling + fallbacks** — add 404 pages for missing products, error boundaries for Sanity outages, and ISR caching so the site stays live.
11. **Test against checklist** in §13 on staging with the live Sanity dataset.
12. **Document the model** — add descriptions to each field in the Studio schema so future editors and developers understand the purpose and constraints without re-reading this guide.

---

_Once §1–§15 are complete, DNAture 2026 has a production-ready Sanity product model with clean schema, strict validation, ISR caching, and a sustainable editorial workflow._
