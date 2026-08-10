# Vertical-slice architecture

DNAture is organized around customer capabilities. A slice owns the UI, state,
domain behavior, data access, and private helpers needed to deliver that
capability. Technical folders are allowed _inside_ a slice when they improve
navigation, but feature-owned code must not be placed in project-wide technical
folders.

## Project boundaries

```text
app/                 Next.js route adapters and application composition
features/
  Calculator/        Portion calculator flow
  Cart/              Cart, checkout, persistence, and purchase capture
  Catalog/           Product catalogue and product detail
  Faq/               FAQ experience
  Home/              Home page sections and category loading
  PlanDNA/           Saved-pet feeding-plan flow
  Account/           Authentication, customer profiles, pets, and saved carts
  AccountDemo/       Disabled future-stage modules kept outside Stage 1 navigation
components/          Reusable UI primitives and application shell
services/            Server-only external integrations
util/                Shared pure utilities used by multiple slices/platform code
constants/           Application-wide configuration
```

`app/` files should remain thin. They may define route metadata, caching,
redirect/not-found behavior, and compose a slice, but business behavior belongs
to the slice.

## Slice structure

A slice may expose separate entry points because Next.js server and client
boundaries must remain explicit:

- `index.js` — primary UI entry point.
- `server.js` — server-only queries and server-safe helpers.
- `state.js` — client state/provider API.
- Other root entry files, such as `Catalog/product-page.js`, may expose a second
  customer-facing flow owned by the same capability.

Private folders such as `api/`, `lib/`, `model/`, and component folders are
implementation details. `app/` and other slices must use the slice's root entry
points rather than importing those private files.

The Cart slice is the only current cross-slice dependency: Catalog and the
application header use `features/Cart/state.js` to add products and display cart
state. They do not import Cart internals.

## Shared-code rule

Move code to `components/` or `util/` only when it is capability-neutral and has
a stable reusable API. A single consumer does not automatically make a generic
primitive feature-specific, but names, props, copy, data fetching, or state tied
to one customer capability do.

Examples:

- `components/Button` and `components/Modal` are reusable primitives.
- `features/Catalog/PresentationSelector` knows product pricing and belongs to
  Catalog.
- `features/PlanDNA/PetCard` knows feeding-plan content and belongs to PlanDNA.
- `services/contentful.js` is shared infrastructure; Contentful queries live in
  the slice that uses them.

Do not recreate root-level `contexts/`, `hooks/`, or `models/` folders. Put those
modules inside their owning slice, or in shared code only after there are
multiple genuine consumers.

## Enforcement

Run:

```bash
npm run check:architecture
```

The check fails when:

- deprecated horizontal feature folders are reintroduced;
- a feature imports the App Router;
- a feature reaches into another slice instead of its public entry point;
- an App Router file reaches into slice internals; or
- platform/shared services depend on a feature.

The quality workflow runs this check for pull requests and pushes to `main`.
