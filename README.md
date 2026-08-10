# DNAture

DNAture is a Spanish-language catalogue and ordering assistant for natural pet
food. It uses Next.js 16 App Router, React 18, and Contentful’s GraphQL delivery
API. The application does not process payment or submit orders to a DNAture
backend; checkout creates a customer-side order image.

## Requirements

- Node.js `>=20.9 <25`
- Contentful delivery credentials for non-fixture development

## Setup

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The main routes live in `app/`; this project no
longer uses the Pages Router or `pages/api` routes.

## Environment

Required outside fixture mode:

```text
CONTENTFUL_SPACE_ID=
CONTENTFUL_DELIVERY_API_KEY=
```

Optional public configuration:

```text
NEXT_PUBLIC_SITE_URL=https://dnaturefood.com
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=
NEXT_PUBLIC_GOOGLE_ANALYTICS=
```

Optional server-only Avify integration:

```text
AVIFY_API_KEY=
AVIFY_GRAPHQL_URL=https://api.avify.com/graphql
```

`AVIFY_API_KEY`, `CONTENTFUL_DELIVERY_API_KEY`, and monitoring credentials are
server-only: never give them a `NEXT_PUBLIC_` prefix. The Avify URL defaults to
the production GraphQL endpoint. Analytics requires an external consent manager
to grant `dnature-analytics-consent`; setting a measurement ID alone does not
load analytics.

During local development, `/avify-test/` compares the uncached Contentful and
Avify GraphQL catalogues, displays the products requiring reconciliation, and
offers a CSV review export. The route returns a 404 in production.

See [operations documentation](docs/operations.md) for deployment, Maps,
monitoring, security-header, and dependency-maintenance requirements.

## Commands

```bash
npm run dev                 # local development server
npm run build               # production build
npm run start               # serve the production build
npm run lint                # ESLint
npm run check:architecture  # vertical-slice import boundaries
npm test                    # unit and component tests
npm run test:e2e            # Playwright customer-flow and accessibility tests
npm run test:a11y           # accessibility subset
npm run verify:production   # verify a deployed origin
npm run audit:public-assets # report potentially orphaned public assets
npm run check:licenses      # verify installed packages declare license metadata
npm run review:performance  # capture and compare route bundle/Web Vitals signals
```

For deterministic browser/build tests without Contentful, use
`E2E_USE_FIXTURES=1`. The CI workflow uses this mode for the production build
and browser tests.

## Architecture

- `app/` — thin App Router adapters, metadata, sitemap/robots, and boundaries.
- `features/` — vertical customer-capability slices that own their UI, state,
  data access, and private helpers.
- `components/` — reusable UI primitives and the application shell.
- `services/` — server-only external-integration boundaries.
- `util/` and `constants/` — genuinely shared utilities and application config.
- `tests/` — Vitest unit/component tests and Playwright browser tests.

See the [vertical-slice architecture guide](docs/architecture.md) for ownership,
public entry-point, dependency, and automated enforcement rules.

The complete documentation index is in [`docs/README.md`](docs/README.md).

Product slugs are normalized to lowercase kebab case at the service boundary.
The native `/sitemap.xml` route includes normalized catalogue product URLs, while
`/cart/` is intentionally excluded from indexing.

## Operational policies

- [Operations runbook](docs/operations.md)
- [Engineering data and privacy inventory](docs/privacy.md)
- [Contentful schema and slug governance](docs/integrations/contentful-governance.md)
- [Contentful–Avify SKU contract](docs/integrations/contentful-avify-sku.md)
- [Customer accounts implementation](docs/accounts/stage-1-implementation.md)
