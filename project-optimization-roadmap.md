# DNAture project optimization roadmap

- **Audit date:** 2026-07-17
- **Project state reviewed:** Next.js 16 App Router, React 18, Contentful-backed
  product catalogue
- **Document purpose:** turn the current cleanup effort into small, verifiable
  changes
- **Delivery note:** the project owner will handle commits and pull requests

## Executive summary

The application has a sound App Router foundation, but the audit found a few
correctness defects that should be fixed before broad cleanup:

1. Checkout validation reads address fields from the wrong object, so a complete
   customer form can be evaluated incorrectly.
2. The two dog-portion calculators expose input combinations that are missing
   from their lookup tables. Valid-looking choices can crash Plan DNAture or
   produce `NaN`.
3. Product slugs are copied directly from Contentful. Leading whitespace becomes
   `%20`, creating broken and non-canonical product URLs.
4. Cart and calculator state is mutated before React receives a shallow clone.
   This is unsafe under concurrent rendering and is already detected by React's
   stricter lint rules.
5. Product catalogue state is reconstructed in effects after hydration, leaving
   useful server-fetched content out of the initial render.
6. Purchase-order IDs are random values generated during rendering, so they can
   change between renders and differ from the downloaded order image.
7. The active Plan DNAture flow has an inert final CTA and uses an editable pet
   name as record identity, allowing rename/edit state to create duplicates.

The largest cleanup opportunities are also material:

- `public/` is approximately **119 MiB**.
- Static reference analysis found **70 candidate orphan assets totaling about
  84.9 MiB**. These need an access-log and staging check before deletion because
  public URLs can be used without a source-code import.
- There is an unused duplicate `PlanDNA2` flow, several unused contexts, hooks,
  components, styles, models, queries, and migration-era configuration files.
- There is no automated unit, component, end-to-end, or accessibility test suite.
- The lint configuration deliberately disables two rules that currently expose
  13 real React correctness errors.

The recommended order is: establish a safety net, fix customer-facing
correctness, repair React state/data boundaries, remove confirmed dead code,
address accessibility and performance, and finally tighten operations,
documentation, and continuous quality controls.

## Scope and method

This roadmap is based on:

- route, component, service, hook, context, configuration, and documentation
  inspection;
- an import/reference scan for dead code and static assets;
- the existing Next.js build artifacts;
- normal ESLint plus targeted runs of disabled or missing rules;
- review of SSR/client boundaries, metadata, cache behavior, semantic HTML,
  keyboard interaction, local storage, images, and third-party integrations.

Targeted linting confirmed:

- **13 errors** when `react-hooks/immutability` and
  `react-hooks/set-state-in-effect` are enabled;
- **14 unused-variable errors** when `no-unused-vars` is enabled.

This was a static audit. Browser performance scores, production access logs,
dependency vulnerabilities, and hosting behavior must be measured rather than
inferred.

## Priorities

| Priority | Meaning | Response |
| --- | --- | --- |
| P0 | Confirmed user-flow or data correctness problem | Fix before general cleanup |
| P1 | High-impact React, Next.js, performance, or accessibility issue | Address in the next cleanup milestones |
| P2 | Maintainability, SEO, operational, or lower-risk improvement | Schedule after the core flow is protected |
| Decision | Product or infrastructure choice is required | Do not delete or redesign until the owner decides |

## Current baseline

### Application and tooling

- Next.js `16.2.10` with the App Router and Webpack.
- React and React DOM `18.3.1`.
- MUI `5.14`, `@mui/material-nextjs` `9.1.1`, Font Awesome,
  `react-slick`, and `react-material-ui-carousel`.
- Scripts exist for lint, build, router-baseline verification, and production
  verification.
- No test runner, browser test framework, accessibility test framework, or CI
  workflow is configured.
- `.github/workflows/` is empty.

### Routes to protect

- `/`
- `/productos/`
- `/productos/[slug]/`
- `/cart/`
- `/calculadora/`
- `/plan-dnature/`
- `/preguntas-frecuentes/`
- `/login/` pending a product decision
- not-found and application error states

Until the Phase 3 decision, record `/login/` only as a current-route
characterization; do not treat the placeholder form as an accepted customer flow.

### Existing strengths

- Dynamic App Router `params` are awaited correctly.
- `useSearchParams` is enclosed by Suspense.
- Missing products use `notFound()`.
- Contentful requests have explicit timeouts, revalidation, and cache tags.
- MUI uses the Next App Router cache provider.
- `reactStrictMode` is enabled.
- Product descriptions no longer render invalid CMS HTML.

## Findings

### P0 — Correctness and customer flows

#### COR-01: Checkout validation evaluates missing fields incorrectly

**Evidence**

- `components/ClientForm/ClientFormContainer.js:53-57` stores `provincia`,
  `canton`, and `direccion` under `client.address`.
- `components/ClientForm/ClientFormContainer.js:71-75` validates every field as
  `client[field.name]`.
- `isInputValid()` evaluates `undefined?.trim() !== ""` as true, so an absent
  required value is treated as valid by application state.

**Impact**

The submit-button state can consider required fields valid when they are missing.
Native browser validation partly masks the problem, but application state and
error display do not agree with the actual form.

**Recommended change**

- Add one field-value helper that reads address fields from `client.address` and
  all other fields from `client`.
- Treat null, undefined, and whitespace-only strings as empty.
- Reuse it for validation and error display.
- Validate email and phone format, not only non-empty values.
- Add focused unit and component tests before changing the form structure.

**Exit criteria**

- A complete valid form enables submission.
- Each missing required field blocks submission and shows the correct error.
- Remembered customer data follows the same validation path.

#### COR-02: Valid-looking calculator choices can crash or return `NaN`

**Evidence**

- `features/PlanDNA/PetData/questions.js:67-71` emits `notCastrated`.
- The medium and large lookup branches are named `noCastrado` at
  `features/PlanDNA/util.js:54` and `features/PlanDNA/util.js:88`.
- `features/PlanDNA/util.js:124-131` dereferences the lookup without validation,
  so medium/large non-castrated adult dogs can crash the flow.
- Both UIs offer a very-active/deportista option for overweight dogs, but the
  overweight branches omit that key in `features/PlanDNA/util.js` and
  `util/portion-size.js`.
- Two separate portion engines maintain equivalent business rules with different
  languages and enum names.
- `components/WeightInput/index.js:29-38` lets `NaN` pass its range comparisons,
  while Plan DNAture checks only whether weight is truthy.
- The separate calculator accepts negative and unbounded values and only checks
  that weight is non-empty.

**Impact**

Plan DNAture can throw for a valid form combination. The separate calculator can
produce `NaN` for a selectable combination. Duplicate matrices make future drift
likely.

**Recommended change**

- Confirm the correct percentage for overweight, very-active dogs with the
  nutrition/domain owner. Until then, disable the unsupported combination and
  explain why.
- Consolidate both calculators on one domain module and one enum vocabulary.
- Validate lookup inputs and return a typed/result error instead of blindly
  dereferencing.
- Parse weight once and require `Number.isFinite(weight)` plus one
  domain-approved minimum/maximum range before calculation.
- Add table-driven tests for every allowed age, stage, size, castration,
  contexture, and activity combination.
- Do not silently invent a nutrition value to fill the missing table cell.

**Exit criteria**

- Every UI-selectable combination has one approved result.
- Unsupported combinations cannot be submitted.
- Nonnumeric, negative, zero, infinite, and out-of-range weights are rejected.
- Neither calculator can throw or return a non-finite/negative result for
  validated input.
- Both experiences consume the same tested calculation module.

#### COR-03: Unnormalized Contentful slugs produce `%20` URLs

**Evidence**

- `services/products.js:98-115` copies `urlSlug` without trimming or validating it.
- `features/Products/Catalog/index.js:76-80` and
  `features/Products/CatalogItem/index.js:73-75` encode the raw value.
- `app/productos/[slug]/page.js:22-45` queries and builds metadata from the raw
  route value.

**Impact**

A leading CMS space is encoded as `%20`, creating a distinct non-canonical URL.
It can also fail lookup when the requested and stored CMS values differ; even
when a whitespace-containing CMS record happens to match, the URL remains dirty
and unstable.

**Recommended change**

- Define and document one slug contract. Recommended starting contract:
  - trim leading/trailing Unicode whitespace and normalize text to NFC;
  - require the persisted canonical slug to match lowercase ASCII kebab-case
    (`^[a-z0-9]+(?:-[a-z0-9]+)*$`) unless the product owner deliberately chooses
    a Unicode URL policy;
  - reject empty values and block collisions after normalization;
  - preserve an explicit old-to-new redirect map when a persisted slug changes.
- Create a pure `normalizeProductSlug()`/validation function implementing that
  contract.
- Normalize and validate slugs at the Contentful service boundary.
- Centralize product URL construction.
- Clean existing Contentful entries.
- Treat the route param as decoded once by the framework; do not repeatedly
  decode it. Redirect a recognized legacy/normalizable value to the canonical
  URL and return not found for an unrecognized invalid value.
- Log or reject empty, duplicate, or otherwise invalid normalized slugs.

**Exit criteria**

- Catalogue links never contain encoded leading/trailing whitespace.
- A legacy whitespace URL permanently redirects to the canonical URL.
- Canonical metadata and sitemap URLs use the normalized slug.
- Unit tests cover ASCII/Unicode whitespace, NFC input, casing, invalid
  characters, empty values, collisions, and redirect mappings.

#### COR-04: Cart state is mutated in place

**Evidence**

- `contexts/shopping-cart-context.js:53-145` mutates cart state and item objects
  before committing shallow clones.
- The strict `react-hooks/immutability` audit reports these mutations.
- Storage parsing in the write path can call `JSON.parse` without a safe fallback.

**Impact**

Rapid updates can be lost, consumers can observe shared mutated objects, malformed
local storage can crash the cart, and behavior will become less predictable under
concurrent rendering.

**Recommended change**

- Move cart transitions to a pure `useReducer`.
- Use immutable item/cart updates and functional dispatches.
- Add a versioned storage schema with parsing, validation, migration, and a safe
  reset for malformed values.
- Decide on a retention period for remembered customer/cart data.
- Split or memoize context state and actions after correctness is restored.

**Exit criteria**

- Reducer tests cover add, increment, decrement, remove, total calculation,
  hydration, and malformed storage.
- No cart object or nested item is mutated.
- Multiple rapid actions produce the expected final quantity.
- The two disabled React lint rules pass for the cart.

#### COR-05: Purchase-order identity is created during render

**Evidence**

- `util/id-generator.js:9-13` includes `Math.random()`.
- `features/Cart/PurchaseOrder/PurchaseOrder.js:16-20` calls the generator while
  rendering.
- Visible and screenshot order views can render separately.

**Impact**

The order ID can change after any rerender and can differ between the visible and
downloaded versions of the same order.

**Recommended change**

- Generate an ID once when order confirmation begins.
- Store it as order data and pass it into every renderer.
- Use a browser-compatible UUID/random implementation; do not import Node
  `crypto` into the client bundle.
- Generate dates once with the order and format them in an explicit timezone.

**Exit criteria**

- One checkout has one stable ID and timestamp.
- The visible and downloaded order contain the same values.
- Rerendering does not change order identity.

#### COR-06: Screenshot failure is not handled safely

**Evidence**

- `features/Cart/CartContainer.js:28-33` can pass a failed/null screenshot result
  into the download helper.

**Impact**

An image-generation failure becomes an unhandled customer-facing failure at the
end of checkout.

**Recommended change**

- Guard the screenshot result.
- Catch and report generation/download errors.
- Disable repeated submission while capture is running.
- Preserve the cart when the download fails.
- Record the completed order only after the chosen success condition; currently
  cart history is stored before screenshot completion is known.

**Exit criteria**

- A failed/null capture never reaches the download helper.
- The customer receives recoverable feedback and can retry.
- The cart remains intact and is not recorded as completed prematurely.
- Loading/submission state always resets after success or failure.

#### COR-07: Active Plan DNAture state and actions are incomplete

**Evidence**

- `components/PetCard/index.js:114-121` renders a final “Plan DNAture” button
  without an action.
- `features/PlanDNA/PlanDNA.js:39-47` uses the editable pet name as identity, so
  renaming during edit adds a duplicate instead of updating the original.
- `petToEdit` is not cleared when adding another pet or after edit completion, so
  the previous pet can reopen as the next entry.

**Recommended change**

- Decide and implement the final CTA destination/action, or remove the inert
  control until that product flow exists.
- Give pets stable IDs independent of display name, including a migration for
  existing local-storage records.
- Clear edit state on add, cancel, successful save, and delete.
- Reject or deliberately support duplicate display names without using them as
  record identity.

**Exit criteria**

- The final CTA performs its documented action and is keyboard-accessible.
- Renaming edits one pet rather than adding a second record.
- “Add another pet” always opens a clean form.
- Edit/add/delete behavior survives refresh and storage migration.

### P1 — React and Next.js architecture

#### REACT-01: Safety rules are disabled globally

**Evidence**

- `eslint.config.mjs:8-13` disables `react-hooks/immutability` and
  `react-hooks/set-state-in-effect` with a stale Pages Router comment.
- Enabling them produces 13 errors across cart, calculator, catalogue, product,
  filter, plan, selector, local-storage, and viewport code.

**Files currently reported**

- `components/Filter/FilterMobile/index.js`
- `components/PresentationSelector/index.js`
- `contexts/shopping-cart-context.js`
- `features/Calculator/CalculatorSteps/index.js`
- `features/PlanDNA/PlanDNA.js`
- `features/Product/ProductInfo/index.js`
- `features/Products/Catalog/index.js`
- `features/Products/CatalogItem/index.js`
- `hooks/useLocalStorage.js`
- `hooks/useWindow.js`

**Recommended change**

Refactor each violation, then re-enable both rules as errors. Do not merely add
local suppressions.

#### REACT-02: The products route bails out to client rendering

**Evidence**

- `features/Products/index.js:1-23` calls `useSearchParams()` inside a client
  wrapper and places the whole catalogue behind Suspense.
- Current production build HTML contains the fallback “Cargando productos…”
  instead of the catalogue.
- `features/Products/Catalog/index.js:15-20` initializes categories and filtered
  products as empty arrays and derives them in effects at lines 55-70.

**Impact**

Server-fetched product data is missing from the initial rendered catalogue, which
causes a client-render bailout, extra render cascades, visible layout changes, and
weaker crawlable output.

**Recommended change**

- Read `searchParams` in `app/productos/page.js` and pass the initial category as
  a server-derived prop.
- Make the category ID/query parameter the source of truth.
- Derive sorted categories, filter options, selected category, and products
  synchronously with pure functions or `useMemo`.
- Remove effects used only to mirror props or derive state.
- Initialize product presentation selection synchronously with one shared helper.

#### REACT-03: Broad client boundaries hydrate mostly static content

**Evidence**

- `features/Home/index.js:1` makes the whole home feature a Client Component.
- `features/Faq/index.js:1` makes the FAQ page client-side when only accordion
  interaction requires state.
- `features/Product/index.js:1` makes the complete product feature client-side.
- `features/Home/Hero/index.js` uses client navigation and viewport code while
  passing props that `Hero.js` does not use.

**Recommended change**

- Make static sections Server Components by default.
- Keep sliders, cart controls, FAQ disclosure state, map loading, and animation
  triggers as small client islands.
- Replace simple imperative navigation with `Link`.
- Use CSS media queries rather than rendering separate trees from viewport width.

#### REACT-04: Mobile detection swaps the header after hydration

**Evidence**

- `hooks/useWindow.js` renders a mobile default and corrects it after mount.
- `components/Header/Header.js:20-26` chooses different mobile and desktop trees.

**Impact**

Desktop users initially receive mobile navigation and then see it switch after
hydration.

**Recommended change**

Render one semantic navigation tree and use CSS for responsive layout/visibility.
Keep JavaScript only for menu state.

#### REACT-05: Product presentation state is duplicated

**Evidence**

- `features/Products/CatalogItem/index.js:58-66`
- `features/Product/ProductInfo/index.js:47-57`
- `components/PresentationSelector/index.js:24-28`

All mirror values through effects. The selector also hardcodes
`id="presentation-select"` for every rendered card.

**Recommended change**

- Add one pure `getDefaultPresentation()` helper.
- Keep one owner for selected presentation.
- Make `PresentationSelector` controlled.
- Use `useId()` or pass a stable unique ID.

#### NEXT-01: Product detail can request the same Contentful record twice

**Evidence**

- `app/productos/[slug]/page.js:22-25` loads the product for metadata.
- `app/productos/[slug]/page.js:43-45` loads it again for the page.
- The underlying request is POST.
- The installed React `18.3.1` does not export `cache()`.

**Recommended change**

Measure Contentful request counts first because framework fetch caching may
already cover this request. If duplicate calls remain, choose a React-18/
Next-16-compatible keyed cache with verified revalidation/tag semantics, or move
this optimization after the planned React upgrade and use React `cache()` then.
Do not add a process-global promise map that can leak data or grow without bound.

#### NEXT-02: Product outages become successful empty pages

**Evidence**

- `app/productos/page.js:13-22` catches every Contentful failure and returns an
  empty object.
- The route is statically generated/ISR cached.

**Impact**

A transient Contentful failure can deploy or cache a `200` page with an empty
catalogue while hiding the failure from monitoring.

**Recommended change**

Allow unexpected errors to reach `error.js`, or provide a deliberately versioned
last-known-good catalogue. Add product-content assertions to production
verification.

#### NEXT-03: Contentful credentials have an unsafe public fallback

**Evidence**

- `services/util.js:3-9` accepts `NEXT_PUBLIC_CONTENTFUL_*`.
- The service module has no `server-only` guard.
- The production verifier already considers public Contentful variables invalid.

**Recommended change**

- Add `import 'server-only'`.
- Require only `CONTENTFUL_*` variables.
- Validate configuration with clear server-side errors.
- Remove public fallbacks after the deployment environment is migrated.

This is an unsafe configuration path, not proof that credentials are currently in
the browser bundle.

#### NEXT-04: Static sub-routes inherit incorrect social metadata

**Evidence**

- `app/layout.js:29-47` fixes Open Graph and Twitter values to the home page.
- Static child routes usually define only title, description, and canonical.
- Existing production verification checks tag presence rather than route-specific
  values.

**Recommended change**

Create a metadata factory that sets canonical URL, Open Graph URL/title/
description, and Twitter title/description together. Verify exact values per
route.

#### NEXT-05: Dynamic products are absent from the sitemap

**Evidence**

- `next-sitemap.config.js:11-23` adds only static paths.
- The generated sitemap has no `/productos/[slug]/` entries.

**Recommended change**

Prefer App Router `app/sitemap.js` and `app/robots.js`, sourcing product entries
from normalized Contentful data. Stop committing generated files if deployment
can generate them reliably.

#### NEXT-06: Contentful payloads lack a runtime schema boundary

`services/products.js` assumes nested collections, images, prices, and slugs have
the expected shape and mutates response objects during normalization.

Normalize into new immutable objects at the service boundary, validate required
fields, and log/reject bad records without silently corrupting the catalogue.
Delete the unused string-interpolated ID query; if a dynamic GraphQL query is ever
retained, pass values as GraphQL variables.

### P1 — Accessibility and hydration safety

#### A11Y-01: Global styles remove keyboard focus indicators

**Evidence**

`styles/globals.scss:53-64` removes outlines from every button and every focused
input without providing an equivalent visible focus treatment.

**Recommended change**

Restore a high-contrast `:focus-visible` style for links, buttons, inputs,
selects, and custom controls. Do not suppress browser focus unless a replacement
is visible in every theme and state.

#### A11Y-02: Product-card controls are nested inside links

**Evidence**

- `features/Products/CatalogItem/index.js:73-124` wraps a selector and cart buttons
  inside `Link`.
- `features/Home/Products/index.js:29-56` nests `ProductButton`, a real button,
  inside a link.

**Impact**

Nested interactive elements are invalid and create unreliable keyboard,
screen-reader, click, and navigation behavior.

**Recommended change**

Make only image/title content a link and keep selector/cart controls as siblings.
Style home category links directly as buttons instead of nesting a button.

#### A11Y-03: Custom interactive elements omit keyboard behavior

**Examples**

- Drawer close control
- Header menu toggle
- Cart item delete control
- Product-detail back control
- FAQ question toggles
- Calculator option cards

Several are `div`/`span` elements with click handlers and `role="button"` but no
equivalent keyboard handler.

**Recommended change**

Prefer native `button` elements. Where that is impossible, implement Enter/Space,
focus indication, disabled state, and the appropriate ARIA state.

#### A11Y-04: Modal and drawer lack dialog behavior

`components/Modal/Modal.js` and `components/Drower/index.js` lack a dialog role,
`aria-modal`, accessible title linkage, focus trapping, Escape handling, and
focus restoration. Their close controls also need accessible names.

Use an accessible dialog primitive or implement and test the complete dialog
interaction model. Restore the prior body overflow value rather than forcing
`auto`.

#### A11Y-05: FAQ and cart notification markup can produce invalid HTML

- FAQ content uses `dangerouslySetInnerHTML` with hand-authored HTML that includes
  malformed fragments.
- `features/Cart/CartNotification/index.js` places MUI `Typography` inside a
  paragraph, which can render nested paragraphs.

Convert static FAQ content to structured JSX/data, use native
`details`/`summary` or proper disclosure buttons, and make inline Typography render
as `span`.

#### A11Y-06: Hidden navigation and icon actions are not exposed correctly

- `components/Header/DropdownMenu/index.js` hides navigation with a transform,
  leaving its links in the keyboard tab order.
- WhatsApp, cart, QuickAdd, modal-close, and other icon-only actions lack explicit
  accessible names.

Conditionally render or use `hidden`/`inert` for the closed menu, connect its
trigger with `aria-expanded` and `aria-controls`, and add context-specific
`aria-label` values to icon-only actions.

#### A11Y-07: The generic Button drops native button props

`components/Button/index.js:3-7` accepts only a small prop subset. It discards
`type`, `aria-*`, refs, data attributes, and other normal button behavior even
though callers already pass `type`.

Forward native props and refs, and default reusable non-submit actions to
`type="button"`. Add tests so a future wrapper cannot silently remove semantics.

#### A11Y-08: Login is a nonfunctional placeholder

`features/Login/index.js` renders unlabeled inputs without a working action.

This route needs a product decision:

- remove it and its fake auth artifacts if authentication is not planned; or
- implement a real, secure authentication flow with labelled fields, validation,
  error handling, and tests.

Do not leave a public form that appears functional but is not.

### P1 — Performance and media

#### PERF-01: Image optimization is disabled globally

**Evidence**

- `next.config.js:4-14` permits Contentful images but sets `unoptimized: true`.
- `imageLoader.js` and `next.config.alternative.js` contain an inactive alternate
  approach.

**Impact**

Original images are served without responsive Next/Contentful transformations,
increasing transfer size and likely hurting LCP.

**Recommended change**

- Reproduce and resolve the hosting `_ipx` problem in a preview environment.
- Re-enable the Next optimizer or configure one tested Contentful image loader in
  the active config.
- Provide accurate `sizes`, dimensions/aspect ratio, and priority only for the
  actual LCP image.
- Delete the inactive alternate config after the chosen path works.

#### PERF-02: Public assets are unusually large

`public/` is approximately **119 MiB**. The largest files include:

| Asset | Approximate size |
| --- | ---: |
| `public/products/hero.JPG` | 16.0 MiB |
| `public/images/plandna-desk.jpg` | 10.5 MiB |
| `public/images/ribbonOrange.svg` | 10.0 MiB |
| `public/images/plandna-mobile.jpg` | 9.7 MiB |
| `public/images/hero2.jpg` | 8.5 MiB |
| `public/images/products-diet.jpg` | 7.4 MiB |
| `public/images/products-snacks.jpg` | 5.9 MiB |
| `public/images/hero.jpg` | 5.2 MiB |
| `public/images/fondo_zacate.png` | 4.5 MiB |

Static reference analysis found 70 candidate orphan files totaling roughly
84.9 MiB. Public files can be consumed through direct external URLs, so this is a
candidate set rather than automatic deletion authorization.

**Recommended change**

1. Check production/CDN access logs for direct requests.
2. Delete candidates in an isolated cleanup change.
3. Test all routes and social/share assets in staging.
4. Resize/compress retained raster images and simplify oversized SVGs.
5. Record image budgets for future additions.

#### PERF-03: The likely home LCP image is a CSS background

`features/Home/Hero/Hero.module.scss` loads the roughly 1.6 MiB
`hero3_wide.jpg` as a background. That prevents responsive `next/image`
selection and makes preload/prioritization harder to express.

Render the visual as an accessible/decorative `Image fill` with correct `sizes`
and LCP priority, or use a responsive `picture` if the art direction differs by
breakpoint. Verify the result through a preview Lighthouse trace.

#### PERF-04: A utility barrel pulls heavy browser code into unrelated routes

**Evidence**

- `features/Calculator/CalculatorSteps/index.js` imports calculator helpers from
  `util/index.js`.
- That barrel eagerly imports screenshot code (`html2canvas`) and a Node-crypto
  based ID generator.
- Existing build artifacts contain associated large html2canvas and
  crypto-browserify chunks.

**Recommended change**

Import precise utility modules from client code, remove the Node `crypto` client
dependency path, and use dynamic imports for screenshot generation if it is only
needed at checkout.

#### PERF-05: Repeated scroll and timer work can be consolidated

- `components/AnimationBox/index.js` installs a scroll listener per instance and
  measures layout on scroll.
- `components/Map/index.js` initializes Google Maps immediately even when it is
  below the fold.
- `components/Slider/index.js` uses a module-global interval, allowing slider
  instances to interfere with one another.

Use a shared `IntersectionObserver`, load Maps near visibility or on interaction,
keep timers in component refs, use functional state updates, pause work while the
page is hidden, and respect `prefers-reduced-motion`.

#### PERF-06: UI libraries overlap

The application uses MUI, Font Awesome, `react-slick`,
`react-material-ui-carousel`, and a custom slider.

Measure route bundles first, then consolidate overlapping carousels/icons where
the visual and maintenance benefit justifies migration. Upgrade React, MUI, and
carousel compatibility as one tested task; do not upgrade React in isolation.

#### PERF-07: Font loading is fragmented

`app/layout.js` loads multiple Roboto packages while `styles/fonts.scss` defines
many TTF/OTF faces without `font-display`. The tracked `fonts/` directory is
approximately 2.3 MiB.

Inventory which families/weights are visible, move retained local faces to
`next/font/local`, prefer subsetted WOFF2/variable fonts, and remove unused font
files only after visual regression checks.

### P2 — Maintainability and dead code

#### CLEAN-01: Confirmed zero-inbound runtime code

The import graph found a complete duplicate Plan flow, unused contexts/hooks/
models/mocks, zero-inbound components and styles, obsolete product query code,
and an inactive Next configuration. The exact canonical checklist is under
**Removal inventory** below.

**Important:** keep `components/ClientForm/ClientForm.js` and
`ClientFormContainer.js`; the cart imports them directly.

#### CLEAN-02: Hidden or placeholder features require decisions

| Candidate | Evidence | Decision |
| --- | --- | --- |
| `/login` and `features/Login/**` | Reachable placeholder with no real auth | Remove or implement |
| `features/Home/NutritionalAppointments/**` | Imported but never rendered | Restore intentionally or delete |
| Historical migration/rebranding documents | Contain removed Blog and Pages Router guidance | Archive or rewrite |

#### CLEAN-03: Unused variables and commented code are not enforced

Targeted linting found 14 unused-variable violations. Examples include unused
icons and auth props in SubHeader, an unused currency change handler, stale Hero
props, a hidden nutritional appointments import, and commented calculator/header
paths.

Remove the violations, then enable `no-unused-vars` with an intentional convention
for ignored callback parameters. Avoid leaving feature code commented out in live
modules; Git already preserves it.

#### CLEAN-04: Migration-era indirection and duplicate styles remain

- `hooks/useCompatibleNavigation.js` is an App Router migration shim; replace
  simple navigation with `Link` or direct `next/navigation` hooks.
- `styles/Home.module.css` is an unused starter stylesheet.
- `styles/_colors.scss` duplicates the live variables file.
- Several empty/unused product and currency CSS modules can be removed.
- Many files import default `React` only for JSX; clean these mechanically after
  higher-risk work, while retaining imports where `React.*` is actually used.

### P2 — SEO, security, privacy, and operations

#### SEO-01: Several routes lack a meaningful visible H1

- Products uses category H2 headings but no route-level H1.
- Calculator begins with an H2.
- Home places its H1 in a zero-sized, transparent `.seo-hidden` class.
- FAQ's hidden H1 contains copied calculator text while its visible title is an
  H2.

Give each public route one descriptive, preferably visible H1. Make the FAQ title
the H1 and remove the incorrect copied text. Validate heading order with both an
automated accessibility check and the rendered document outline.

#### OPS-01: Automated regression coverage is absent

There are no unit, component, end-to-end, accessibility, or visual regression
tests and no CI workflow. Current verification scripts mostly inspect HTTP/HTML
and cannot detect interaction failures, console errors, hydration warnings, or
keyboard problems.

Add layered coverage:

- unit tests for cart reducer/totals, form validation, slug normalization,
  presentation selection, portion calculation, and storage parsing;
- component tests for product cards, presentation controls, cart, FAQ, and modal;
- Playwright smoke tests for the primary customer journeys;
- automated axe checks and a small set of visual snapshots;
- CI checks for lint, strict React rules, unit tests, build, and browser smoke.

#### OPS-02: Production verification is too shallow

Extend `scripts/verify-production.mjs` to check:

- route-specific canonical, Open Graph, and Twitter values;
- at least one product and category on the catalogue;
- normalized product links;
- one direct product detail request;
- sitemap product URLs;
- absence of client console and hydration errors through browser smoke tests.

Both existing verifiers currently make the dynamic product route optional.
Discover a valid normalized slug during verification or require one in CI, and
give every network request an abort timeout.

#### OPS-03: Security headers and runtime monitoring need an explicit policy

No application security-header policy is configured. Add and preview-test:

- Content Security Policy;
- `Referrer-Policy`;
- `X-Content-Type-Options`;
- `Permissions-Policy`;
- HSTS at the hosting layer.

The CSP must account for Contentful images, Google Maps, Analytics, and WhatsApp.
Do not copy a generic policy that silently breaks these integrations.

`app/error.js` should report production errors to an approved monitoring service
with redacted context rather than relying only on `console.error`.

Because the Google Maps browser key must be public, confirm HTTP-referrer and API
restrictions, quotas, and billing alerts in Google Cloud. Document whether
Analytics requires a consent gate for the markets in which the site operates.

#### OPS-04: Browser storage contains customer data without lifecycle controls

Remembered customer details and cart history need:

- schema versioning and runtime validation;
- a retention/expiry policy;
- safe migrations and corruption recovery;
- data minimization and a clear user-controlled removal path;
- a privacy review of which address/contact fields should persist.

#### DOC-01: Operational documentation is stale

- `README.md:15-19` refers to `pages/index.js` and Pages Router API routes.
- `eslint.config.mjs` describes live App Router code as legacy Pages Router code.
- `router-migration.md`, `router-migration-baseline.md`, and
  `rebranding-renewed-dnature-next.md` contain historical Blog or migration
  guidance that no longer matches the application.

Update the README for the real environment, scripts, architecture, deployment,
Contentful configuration, and verification flow. Archive historical documents or
label them clearly as non-current.

## Phased implementation plan

Phase numbers describe dependency and rollback order, not severity: a contained
dead-code pass follows the architecture work because it reduces the surface area
before higher-risk semantic and performance changes. P0/P1 labels still determine
what must block release.

Estimates are preliminary focused-engineering ranges, not calendar commitments.
Re-estimate each phase after the Phase 0 baseline. They exclude Contentful
editorial work, domain/policy decisions, access-log availability, deployment
lead time, and external review.

### Phase 0 — Safety net and measurable baseline

- **Estimate:** 3–6 engineer days
- **Risk:** low
- **Dependency:** none

- [ ] Record a production/preview baseline for each protected route.
      The reproducible capture is implemented and a local fixture baseline is
      stored; run it with `BASELINE_BASE_URL` when the preview origin is known.
- [x] Capture route bundle sizes, lab Web Vitals, request count, and
      transferred image bytes on mobile and desktop.
- [x] Add a unit-test runner and DOM/component testing support.
- [x] Enumerate the full portion-input matrix; characterize supported cases and
      record the known unsupported/mismatched cases as explicit Phase 1
      regressions pending the domain decision.
- [x] Add Playwright smoke coverage for:
      - home → catalogue → product → cart → checkout;
      - category query filtering;
      - calculator and plan flows;
      - FAQ interaction;
      - direct product load, malformed slug, not found, and error paths.
- [x] Fail browser tests on page errors, console errors, and hydration warnings.
- [x] Add axe checks for the main routes.
- [x] Add CI for install, lint, tests, build, and smoke tests.

**Exit criteria**

- Existing critical flows are reproducible locally and in CI.
- Baseline numbers are stored with environment/device details.
- Cleanup regressions can fail CI before deployment.

### Phase 1 — Customer-flow correctness

- **Estimate:** 4–8 engineer days after the nutrition rule is approved
- **Risk:** medium
- **Dependency:** Phase 0 focused tests

- [ ] Fix nested checkout address validation.
- [ ] Confirm the missing overweight/very-active nutrition rule with the domain
      owner.
- [ ] Align the `notCastrated`/`noCastrado` enum mismatch.
- [ ] Consolidate the two portion-size engines and reject unsupported inputs.
- [ ] Add finite, domain-bounded weight validation in both flows.
- [ ] Give saved pets stable IDs, reset edit state correctly, and resolve the
      inert final Plan DNAture CTA.
- [ ] Normalize product slugs at the service boundary.
- [ ] Centralize product URL generation.
- [ ] Clean invalid Contentful slugs and add canonical redirects.
- [ ] Replace mutable cart operations with a pure reducer.
- [ ] Harden local-storage parsing and schema handling.
- [ ] Generate stable order IDs/timestamps outside render.
- [ ] Guard screenshot/download failure.

**Exit criteria**

- The checkout flow passes with valid data and rejects invalid data correctly.
- Every selectable calculator/plan combination returns an approved finite result.
- Pet add/edit/rename/delete and the final Plan CTA pass regression tests.
- `%20` links are no longer generated.
- Legacy whitespace URLs redirect predictably.
- Cart/order unit tests pass under rapid and malformed-storage scenarios.

### Phase 2 — React state and server/client boundaries

- **Estimate:** 4–8 engineer days
- **Risk:** medium
- **Dependency:** Phases 0–1

- [ ] Remove effect-derived catalogue/filter state.
- [ ] Read product `searchParams` in the Server Component so production HTML
      contains the catalogue rather than only its Suspense fallback.
- [ ] Make presentation selection controlled and synchronous.
- [ ] Fix calculator mutations with functional immutable updates.
- [ ] Refactor remaining strict-rule violations.
- [ ] Re-enable `react-hooks/immutability` and
      `react-hooks/set-state-in-effect`.
- [ ] Split home, FAQ, header, and product UI into Server Components plus small
      client islands.
- [ ] Replace viewport-render branching with CSS responsiveness.
- [ ] Replace simple programmatic navigation with `Link`.
- [ ] Measure metadata/page Contentful request counts and implement a
      React-18-compatible deduplication path only if duplicate calls remain.
- [ ] Add a `server-only` Contentful boundary and remove public env fallbacks.
- [ ] Stop converting unexpected catalogue failures to empty `200` pages.

**Exit criteria**

- Both React correctness rules pass without blanket suppression.
- Catalogue/product content exists in initial HTML.
- A direct products request contains catalogue headings/items before hydration.
- Product metadata and page rendering issue one request-level load.
- Client component scope is limited to interactive leaves.

### Phase 3 — Dead code, configuration, and asset cleanup

- **Estimate:** 2–5 engineer days, with public assets as a separate gated change
- **Risk:** low for code; medium for public assets
- **Dependency:** smoke coverage from Phase 0

- [x] Enable `no-unused-vars` after clearing all current violations.
- [x] Delete the canonical **Removal inventory** in small groups.
- [x] Remove obsolete product queries and unused exports.
- [x] Remove the non-functional `/login` placeholder and fake-auth artifacts.
- [x] Delete the unrendered nutritional appointments feature.
- [x] Remove commented-out feature branches and unused props/imports.
- [x] Keep the active image configuration and delete obsolete alternatives.
- [ ] Check access logs for candidate orphan public URLs.
- [ ] Delete verified orphan assets in a separate, easy-to-review change.
- [x] Run a clean `npm ci` and re-evaluate dependencies from a clean tree.

**Exit criteria**

- Lint, build, verification scripts, and route smoke tests pass.
- Runtime-code deletions are import-graph confirmed and pass build/smoke tests.
- Public-file deletions have both production access-log review and staging route/
  social-asset verification.
- `public/` size reduction is recorded.
- No inactive alternate implementation remains without an owner and rationale.

### Phase 4 — Semantic HTML and accessibility

- **Estimate:** 4–7 engineer days
- **Risk:** medium because markup and interaction change
- **Dependency:** Phase 0 browser/a11y tests

- [x] Remove nested controls from product/home links.
- [x] Restore a visible global `:focus-visible` treatment.
- [x] Replace clickable `div`/`span` elements with buttons.
- [x] Give every selector a unique labelled ID.
- [x] Implement an accessible modal interaction model.
- [x] Make closed navigation non-focusable and label every icon-only action.
- [x] Forward standard native props through the generic Button.
- [x] Convert FAQ content from HTML strings to structured content.
- [x] Fix paragraph nesting in cart notifications.
- [x] Add keyboard, focus, reduced-motion, and screen-reader support.
- [x] Verify the removed `/login` route and navigation are not included in runtime configuration.

**Exit criteria**

- No interactive element is nested inside another interactive element.
- All controls work with keyboard alone.
- Modal focus enters, remains within, and returns correctly.
- Automated axe checks have no serious/critical violations on protected routes.

### Phase 5 — Images, bundles, and runtime performance

- **Estimate:** 10–20 engineer days across three independently deliverable
  workstreams
- **Risk:** medium; hosting and visual validation required
- **Dependency:** measured Phase 0 baseline and Phase 3 asset inventory

**5A — Image pipeline and assets (4–8 days after a 1–2 day hosting spike)**

- [ ] Restore tested image optimization.
- [x] Replace the home hero CSS background with a responsive LCP image strategy.
- [ ] Resize/compress retained assets and simplify the oversized SVG.
- [x] Add explicit image dimensions, `sizes`, and intentional LCP priority.

**5B — Runtime loading and route bundles (3–6 days)**

- [x] Replace utility-barrel client imports with direct imports.
- [x] Lazy-load screenshot and Maps code.
- [x] Replace per-instance scroll work with `IntersectionObserver`.
- [x] Make slider timers instance-local and motion-aware.
- [ ] Add a bundle analyzer and route-level JS/image budgets.

**5C — Fonts and UI dependency consolidation (3–6 days)**

- [ ] Evaluate consolidation of carousel and icon libraries using measured data.
- [ ] Consolidate and optimize local font loading with `next/font/local`.
- [ ] Upgrade MUI/carousel/React compatibility as a separately tested change.

**Exit criteria**

- Preview image delivery uses responsive transformed assets.
- No calculator route chunk contains checkout-only screenshot/crypto code.
- Provisional preview gates are agreed before implementation: median mobile lab
  LCP across three like-for-like runs improves by at least 15%, home image
  transfer falls by at least 40%, CLS does not regress by more than 0.02, and
  initial route JS does not grow by more than 5%. Replace these once, with a
  documented rationale, if the Phase 0 baseline proves them inappropriate.
- The agreed numerical performance budgets run in CI or preview verification.

### Phase 6 — SEO, operations, security, privacy, and documentation

- **Estimate:** 8–16 engineer days across three independently deliverable
  workstreams, plus policy/infrastructure review
- **Risk:** low to medium
- **Dependency:** normalized slugs and stable routes

**6A — SEO and content discovery (2–4 days)**

- [ ] Generate route-specific social metadata.
- [ ] Give every public route one correct, preferably visible H1.
- [ ] Add dynamic product URLs to the sitemap.
- [ ] Align canonical trailing-slash behavior with final production URLs.
- [ ] Consider Product JSON-LD after validating the available product fields.

**6B — Security, monitoring, and privacy (4–8 days plus review)**

- [ ] Add security headers with integration-specific CSP testing.
- [ ] Verify Google Maps key restrictions and document Analytics consent policy.
- [ ] Add production monitoring and redaction rules.
- [ ] Define storage retention/privacy behavior.

**6C — Maintenance automation and documentation (2–4 days)**

- [ ] Add dependency update automation and scheduled audit/license checks.
- [ ] Rewrite the README and archive/update stale planning documents.
- [ ] Document ownership for Contentful schema and slug quality.

**Exit criteria**

- Metadata, sitemap, robots, headers, and monitoring are verified on preview.
- Dynamic product URLs are discoverable and canonical.
- Operational documentation matches the deployed App Router application.
- Storage and dependency maintenance policies have named owners.

### Phase 7 — Continuous optimization

**Estimate:** ongoing

- [ ] Review bundle and Web Vitals changes on performance-sensitive work.
- [ ] Keep strict lint, unit, browser, and accessibility gates required in CI.
- [ ] Review dependency updates on a regular cadence.
- [ ] Run quarterly dead-code/public-asset scans.
- [ ] Track Contentful slug/content validation failures.
- [ ] Revisit client boundaries whenever a static parent gains `"use client"`.

## Suggested PR-sized change sequence

The owner will create commits and pull requests. The items below are intended as
small review/rollback units within the larger phases:

1. Test harness and CI baseline.
2. Portion-table domain correction, enum alignment, and engine consolidation.
3. Plan pet identity/edit-state repair and final CTA decision.
4. Checkout validation regression fix.
5. Product slug normalization, CMS cleanup, and redirects.
6. Immutable cart reducer, storage hardening, and stable order identity.
7. Catalogue/presentation derived-state cleanup and strict React rules.
8. Server/client boundary reductions.
9. Dead JS/CSS/config removal.
10. Public asset cleanup after access-log verification.
11. Semantic controls, modal, FAQ, and accessibility fixes.
12. Image pipeline and bundle/performance workstreams.
13. Metadata, sitemap, security, monitoring, privacy, and documentation
    workstreams.

Avoid combining the cart rewrite, mass asset deletion, UI-library upgrades, and
accessibility markup changes in one review.

## Removal inventory

### Safe after normal build and smoke verification

- [ ] `features/PlanDNA2/**`
- [ ] `hooks/useScrollTop.js`
- [ ] `contexts/global-context.js`
- [ ] `contexts/scroll-context.js`
- [ ] `contexts/user-context.js`
- [ ] `hooks/useAuth.js`
- [ ] `hooks/index.js`
- [ ] `models/dog.js`
- [ ] `models/purchase-order.js`
- [ ] `mock/users.js`
- [ ] `components/AspectRatioBox/**`
- [ ] `components/ClientLink/index.js`
- [ ] `components/CounterInput/index.js`
- [ ] `components/CustomSelect/index.js`
- [ ] `components/Form/**`
- [ ] `components/Loading/**`
- [ ] `components/ClientForm/index.js` only
- [ ] `features/Home/Diet/**`
- [ ] `features/Home/DNAtureSystem/dnature-plan-steps.js`
- [ ] `features/Product/consts.js`
- [ ] unused ID-based query and `getProduct` in `services/products.js`
- [ ] `getDateDMY` and its `util/index.js` import/export only; keep
      `util/dates.js` because CartHistory uses `formatToLocaleDate`
- [ ] unused dark theme
- [ ] unused styles identified by the reference scan
- [ ] inactive Next config after image strategy selection

### Requires an explicit product or production-data decision

- [ ] `/login`, `features/Login/**`, and fake auth artifacts
- [ ] `features/Home/NutritionalAppointments/**`
- [ ] 70 candidate orphan public assets
- [ ] historical migration/rebranding documents
- [ ] generated sitemap files committed under `public/`

## Validation matrix

| Area | Required checks |
| --- | --- |
| Static quality | ESLint, strict React rules, unused variables, build |
| Home | Desktop/mobile layout, navigation, slider, animations, map loading |
| Products | Initial HTML content, filtering, selector, quick add, normalized links |
| Product detail | Direct load, metadata, not found, add to cart, canonical redirect |
| Cart/checkout | Quantities, delete, persistence, form validation, stable ID, download failure |
| Calculator | Every input combination, finite result, rapid changes, refresh/persistence |
| Plan | Every input combination, add/edit/rename/delete, final CTA, persistence, direct load |
| FAQ | Keyboard disclosure, focus, valid content, screen reader labels |
| Errors | 404, Contentful unavailable, malformed storage, screenshot failure |
| SEO/security | Canonicals, OG/Twitter, sitemap, robots, structured data, headers |
| Performance | Route JS, image bytes, request count, mobile LCP/CLS/INP |

### Current baseline commands

```bash
npm ci
npm run lint
npm run build
npm run verify:router-baseline
npm run verify:production
```

### Target gates after Phases 2–3

```bash
npx eslint . \
  --rule 'react-hooks/immutability:error' \
  --rule 'react-hooks/set-state-in-effect:error' \
  --rule 'no-unused-vars:error'
```

These target rules intentionally do **not** pass today: the audit found 13 React
correctness errors and 14 unused-variable errors. Add the project unit,
component, accessibility, and browser-test commands to this gate when Phase 0
selects the tooling.

## Items that require measurement or confirmation

The audit intentionally does **not** claim the following without additional data:

- Which candidate public assets receive direct production traffic.
- Current Core Web Vitals or exact Lighthouse improvements.
- Current registry vulnerability status; run audits from a clean install with
  network access and review results rather than treating counts as proof of risk.
- Whether Netlify's current adapter supports the preferred Next image path without
  configuration changes.
- Whether Contentful POST requests are already deduplicated across metadata and
  page rendering; React 18.3.1 has no `cache()` export, so measure before choosing
  a compatible strategy or deferring to the React upgrade.
- Which overlapping UI dependency creates the most user-visible bundle cost.
- Whether login or nutritional appointments are future product requirements.

## Definition of done

The cleanup program is complete when:

- all P0 defects have regression tests and are fixed;
- every selectable calculator and Plan DNAture input has one approved finite
  result from a shared domain module;
- strict React correctness and unused-code lint rules are enabled;
- customer-facing routes pass unit, browser, accessibility, and build checks;
- cart and calculator updates are immutable and deterministic;
- initial product/catalogue HTML contains the server-fetched content;
- client boundaries cover only interactive UI;
- confirmed dead code and verified orphan assets are removed;
- image optimization and performance budgets are active;
- metadata, sitemap, security headers, monitoring, and storage policy are
  production-verified;
- the README and current architecture documentation match the deployed project;
- no cleanup task depends on undocumented tribal knowledge.
