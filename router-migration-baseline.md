# Historical document — Router Migration Baseline

> **Status:** Baseline captured before the completed App Router migration. It is
> retained for history only and must not be treated as current operational docs.

This record captures the verification contract for Phase 0 of the Pages Router
to App Router migration. It is intentionally separate from
[`router-migration.md`](router-migration.md), which contains the implementation
roadmap.

## Scope

The baseline protects the current public routes, metadata, Contentful behavior,
cart flow, and responsive layout while the router changes. It does not certify
new functionality or fix pre-existing issues.

## Commands

Run these commands before beginning a migration phase and before merging a
migration change:

```bash
npm run lint
npm run build
```

Start the production server after a successful build:

```bash
npm start
```

In a second terminal, run the dependency-free route and metadata check:

```bash
npm run verify:router-baseline
```

To include a known working product and blog post, pass their existing full
paths, including the current Contentful ID query parameter:

```bash
npm run verify:router-baseline -- \
  --product-url '/productos/example-product?id=<contentful-id>' \
  --post-url '/blog/example-post?id=<contentful-id>'
```

The verifier checks the stable public routes plus title, description, Open
Graph title, and favicon metadata. It reports a non-zero exit status for a
non-success response or missing metadata. It does not replace browser-level
interaction tests.

## Current route inventory

| Route | Baseline expectation |
| --- | --- |
| `/` | Categories render from Contentful or fallback categories |
| `/productos` | Catalog renders; `?category=` selects a category |
| `/productos/:slug?id=:id` | Current product detail contract; direct slug-only access is not yet supported |
| `/blog` | Blog listing renders from Contentful or the existing empty-state fallback |
| `/blog/:slug?id=:id` | Current blog post contract; direct slug-only access is not yet supported |
| `/blog/busqueda?field=category&value=nutrición` | Search result route responds and renders safely |
| `/calculadora` | Calculator starts and progresses through steps |
| `/cart` | Cart page renders; quantity, modal, and checkout flows work |
| `/login` | Login UI renders |
| `/plan-dnature` | Plan UI renders and progresses through steps |
| `/preguntas-frecuentes` | FAQ renders and accordion interactions work |

## Required environment variables

Only variable names are documented here; do not commit values.

| Variable | Used by | Required for |
| --- | --- | --- |
| `NEXT_PUBLIC_CONTENTFUL_SPACE_ID` | Contentful GraphQL service | Home, products, and blog content |
| `NEXT_PUBLIC_CONTENTFUL_DELIVERY_API_KEY` | Contentful GraphQL service | Home, products, and blog content |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS` | Shared Page component | Analytics script |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Map component | Map rendering |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | Map component | Map rendering; code falls back to `DEMO_MAP_ID` |
| `NEXT_PUBLIC_SITE_URL` | Page metadata and sitemap config | Canonical Open Graph URLs and sitemap origin |

### Configuration observations

- `.env.local` currently defines the two Contentful variables, Google
  Analytics, and Google Maps API key.
- `NEXT_PUBLIC_SITE_URL` is used by the page metadata and sitemap config but is
  not currently present in `.env.local`. The sitemap has a production fallback;
  the Page component does not. Add this variable to every environment before
  validating canonical metadata.
- The App Router migration will replace public Contentful variables with
  server-only variables. This is a planned migration change, not a Phase 0
  change.

## Screenshot and manual interaction checklist

Capture screenshots before and after each route slice at these widths:

| Viewport | Width | Height |
| --- | ---: | ---: |
| Mobile | 390px | 844px |
| Desktop | 1440px | 1024px |

Store comparison images outside the repository or in the approved visual QA
location. Do not commit screenshots containing tokens, personal data, cart
client information, or third-party account details.

For each relevant route, compare:

- Header, navigation, footer, spacing, and typography.
- MUI component styles and CSS module styles.
- Hero and Contentful images.
- Product icon sizing and rounded treatment.
- Loading, empty, not-found, and Contentful-fallback states.
- Page title, description, Open Graph tags, and favicon.

Manual interaction checks:

- Navigate from home to a product category and back.
- Filter products by category and select a search suggestion.
- Open a product and add it to the cart.
- Change quantity, remove an item, and open/cancel checkout.
- Open a blog post from the listing and search by category and tag.
- Complete the calculator and Plan DNAture happy paths.
- Expand and collapse FAQ entries.

## Known baseline constraints

These are migration inputs, not issues to silently change during Phase 0:

1. Product detail fetching currently relies on `?id=<contentful-id>` even
   though the visible route contains a slug.
2. Blog post fetching currently relies on `?id=<contentful-id>` for the same
   reason.
3. The active cart is held in React Context. Mixed Pages/App Router navigation
   can recreate that provider and lose unsaved in-memory cart state.
4. `features/Cart/Cart.js` reads `window.innerWidth` while rendering modals.
   This must be moved to a browser-safe path during the client-boundary phase.
5. The project does not currently include Playwright, Cypress, Jest, Vitest, or
   another browser-test runner.
6. `hooks/useAuth.js` requests `/api/current_user`, but the repository has no
   local `pages/api` route for that endpoint. Verify its ownership before
   altering login behavior.

## Phase 0 completion record

| Check | Status | Evidence |
| --- | --- | --- |
| Lint | Complete | `npm run lint` passed on 2026-07-17 |
| Production build | Complete with fallback | `npm run build` passed on 2026-07-17; sandbox DNS could not reach Contentful, so existing fallback/empty-state paths were used |
| Route and metadata verifier | Complete for static routes | Passed on 2026-07-17 against the local server on port 3000; dynamic detail URLs require valid Contentful IDs and remain pending |
| Desktop screenshots | Pending browser QA | Capture 1440×1024 comparison images |
| Mobile screenshots | Pending browser QA | Capture 390×844 comparison images |
| Manual cart and content flows | Pending | Complete the checklist above |
| Environment inventory | Complete | This document |
| Known constraints recorded | Complete | This document |

Update this table with the command output location and capture date whenever a
baseline run is performed.
