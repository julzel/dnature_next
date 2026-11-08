# Avify and Contentful backend services

All integration modules import `server-only`. Call them from Server Components,
Route Handlers, or server actions; never import them into a Client Component.
The current landing-page prototype stays independent of these services. No public
API proxy, checkout, order mutation, CMS migration, or content publishing is added.

## Environment

The existing `.env.local` is preserved. Set the same server-side variables in your
deployment environment. `.env.example` documents them without credentials.

| Variable | Purpose |
| --- | --- |
| `AVIFY_GRAPHQL_URL` | Exact HTTPS GraphQL endpoint supplied by Avify |
| `AVIFY_API_KEY` | Sent in Avify's `api-key` header, not as a Bearer token |
| `AVIFY_LOCATION_ID` | Optional positive integer for location-scoped stock; blank means global stock |
| `CONTENTFUL_SPACE_ID` | Existing Contentful space |
| `CONTENTFUL_ENVIRONMENT_ID` | Existing environment or alias; defaults to `master` |
| `CONTENTFUL_DELIVERY_API_KEY` | Read-only, published Content Delivery API access |
| `CONTENTFUL_LOCALE` | Single locale; defaults to the verified space default, `es-CR` |

Do not use `NEXT_PUBLIC_` for these settings. `CONTENTFUL_CMA_TOKEN`, if present,
is deliberately unused: serving published content does not require management
permissions. The Delivery API key must have access to the configured environment.
This integration uses Contentful's standard `cdn.contentful.com` region.

## Catalog reads

```ts
import { getAvifyProducts } from "@/features/catalog/server/avify";

const page = await getAvifyProducts({ page: 1, pageSize: 24 });
const matched = await getAvifyProducts({ skus: ["YOUR-AVIFY-SKU"] });
// Explicitly override the configured location when global inventory is intended:
const globalInventory = await getAvifyProducts({ locationId: null });
```

Pages start at 1; page sizes are bounded to 1–100. Results include `page`,
`pageSize`, `totalCount`, and typed products with categories and variants. Queries
exclude internal cost and customer data. IDs normalize to strings. A price or
quantity of zero is preserved; missing values remain null. Status, quantity, and
price are raw commerce data, not a claim that a product is suitable for a pet.
Apply publication, availability, tax, currency, and nutritional rules in the
consuming feature before presenting a purchasable offer.

## Development sales dashboard

`/ventas-internos` is available only under `next dev`; the production build returns
404. It reads Avify orders from the last six calendar months and the full catalog,
then groups completed and processing orders by product SKU, day, channel, and
currency. The dashboard includes product search, category/channel/period filters,
and sorting by units, order count, gross line value, or name. It requests no
customer fields and sends only grouped sales data to the browser. Gross line value
is `price × ordered`; it is not net revenue after discounts or refunds.

Avify currently caps order pages at 100 and reports a request allowance, so the
dashboard paces requests and retries HTTP 429 using `Retry-After` when provided.
Loading six months of history may take time. If any page fails, the whole dashboard
shows an error rather than an incomplete ranking. Refreshing the page fetches
fresh data; nothing is stored persistently.

## Published content

```ts
import { getContentfulEntries, getContentfulEntry, getProductContentBySku }
  from "@/features/content/server/contentful";
import type { BlogPostContentFields, CategoryContentFields }
  from "@/features/content/types/contentful";

const posts = await getContentfulEntries<BlogPostContentFields>({
  contentType: "blogPost", order: "-sys.createdAt", limit: 12,
});
const categories = await getContentfulEntries<CategoryContentFields>({
  contentType: "category",
});
const productCopy = await getProductContentBySku("YOUR-AVIFY-SKU");
const entry = await getContentfulEntry("YOUR-ENTRY-ID"); // null only for HTTP 404
```

The verified content types are `product`, `category`, `blogPost`, `postAuthor`,
and `ingrediente`. Product entries already have an `avifySku` field. Match on that
field rather than a title or slug. Avify supplies commerce facts; Contentful supplies
editorial copy and media. CMS `precio`/`disponible` fields must not replace live
price/stock. Duplicate published entries for one SKU fail explicitly.

Collection results preserve Contentful's `includes.Entry` and `includes.Asset`
arrays. Links are not automatically resolved; use those arrays when rendering
linked assets or entries. A single-entry read does not include linked resources.
The SKU helper returns the matching entry; use a filtered collection read when
you also need its included media. Response envelopes and core IDs are validated;
custom field types are TypeScript hints, so validate fields for the specific UI
before rendering them. No raw Rich Text or CMS HTML is injected into the page.

## Matched product catalog

```ts
import { getCatalogProducts, getCatalogProductBySku }
  from "@/features/catalog/server/catalog";

const products = await getCatalogProducts();
const product = await getCatalogProductBySku("YOUR-AVIFY-PARENT-SKU");
```

These server-only functions join published Contentful `product.avifySku` values to
Avify **parent** SKUs. Products without a matching published entry are omitted;
single-product lookup returns `null` when there is no match. Variants remain in
`commerce.children` and inherit their parent's editorial content. Each result
keeps `commerce` and `editorial` separate; `editorial.images` contains the
published, resolved image assets. Missing or unpublished image links are omitted.
Duplicate published SKU mappings fail rather than choosing one arbitrarily.

Full-catalog reads request Avify pages of 100 and Contentful pages of 1000,
joining in memory instead of doing one CMS request per product. The Contentful
snapshot is cached with a five-minute revalidation period and tagged
`contentful-products`; Avify price and stock are fetched on each uncached catalog call.
The cache currently refreshes by time, with no webhook configured. Product UIs
should still apply their own visibility and purchase rules to Avify statuses,
quantities, and prices. Avify's `totalCount` can exceed the number of selectable
products by one; the loader accepts a short final page but rejects empty pages
before the end of the reported pagination range.

The public `/productos` page reads only matched products. It shares an Avify
catalog snapshot briefly across category and search requests (30-second
revalidation), while Contentful uses the editorial cache above. Each category
shows up to five product previews in a horizontally scrollable row,
ordered by units sold in completed or processing orders over the last 30 days.
Variant sales count toward the parent SKU. The shared sales ranking cache
revalidates hourly; the catalog snapshot supplies current prices and stock.
Availability is based on positive quantity because Avify currently reports all
parent product statuses as `inactive`; unavailable products show “Agotado”.
Category and search filters use query
parameters, with the canonical URL remaining `/productos`. No individual
product route or purchase action is implied by the listing.

The landing page's “Variedad y salud” feature ranks the `Snacks deshidratados`
category by units sold in completed or processing orders during the last 30
days. It groups variant sales under the parent SKU, then selects the first four
matched products with a published image, positive stock, and a valid current
price. A configurable product uses the lowest priced stocked active variant and
displays “Desde”. The sales ranking is cached for one hour; catalog price and
stock are read afresh. The section streams a loading state and offers a retry
action on upstream errors. Avify currently marks every returned parent product
`inactive`, including stocked simple products, so this feature uses quantity
rather than parent status to decide whether a card appears.

## Fetching, caching, and errors

Both adapters use native server-side `fetch`, a 10-second deadline covering
headers and response parsing, `cache: "no-store"`, and `redirect: "error"`.
This keeps stock fresh and avoids forwarding credentials on redirects. Contentful
still benefits from its upstream CDN. There is no automatic retry loop.

With this project's `cacheComponents: true`, wrap any future CMS-only cache in
a Next.js `"use cache"` function with an explicit `cacheLife`/`cacheTag` policy.
Keep live price and inventory outside long-lived caches. Stream uncached reads
inside Suspense when adding them to a page, and provide loading/error UI. The
current build does not need integration credentials or make upstream requests.

`IntegrationError` identifies the service, error code, optional HTTP status,
`retryable`, and rate-limit reset seconds when provided. Error messages omit
credentials, response bodies, and raw network causes. HTTP 200 GraphQL errors
reject partial data. A failure is never replaced silently with an empty catalog.

## Verification

```bash
npm run test:services       # Isolated mocked tests; no credentials or network
npm run check:integrations  # Read-only live checks using local/deployment settings
```

The live checker loads environment files through `@next/env`, checks Avify's
`apiTest` and one product page, then checks Contentful's models and one published
product page. It prints only connection status, counts, model IDs, and sanitized
errors. It exits nonzero on a failed check. It does not print API keys, store IDs,
SKUs, entry contents, or customer data. Do not run live checks as part of ordinary
CI or page rendering.

Sources: [Avify API and authentication](https://avify.com/docs/introduccion-api),
[Contentful authentication](https://www.contentful.com/developers/docs/references/authentication/),
[Content Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/overview/).
