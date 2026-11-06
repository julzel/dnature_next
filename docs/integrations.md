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
