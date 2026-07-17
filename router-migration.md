# Pages Router to App Router Migration Roadmap

## Document status

- **Project:** DNAture
- **Current framework:** Next.js 16.2.10, React 18.3.1, JavaScript
- **Current router:** Pages Router
- **Target router:** App Router
- **Estimated effort:** 5–8 engineering days plus focused QA
- **Recommended delivery:** Several reviewable PRs, one coordinated production release

## 1. Executive summary

This migration should preserve the current visual design, routes, Contentful
content, cart behavior, and deployment configuration while replacing the Pages
Router with the App Router.

The project is already on Next.js 16.2.10, so this is primarily an application
architecture migration rather than a framework upgrade. The work consists of:

1. Creating the App Router root layout and provider boundary.
2. Moving 11 public routes from `pages/` to `app/`.
3. Replacing Pages Router data-fetching functions with async Server Components.
4. Moving Contentful product and post lookup from hidden query-string IDs to
   stable URL slugs.
5. Replacing `next/router` and `next/head`.
6. Defining explicit Server and Client Component boundaries.
7. Preserving Contentful caching and revalidation behavior.
8. Adding route-level loading, error, metadata, and not-found handling.
9. Verifying every route, cart interaction, responsive flow, and direct URL.

The migration does **not** require TypeScript, Tailwind CSS, React 19, a new
state library, a Contentful SDK change, or a visual rebrand. Those changes
should remain separate so router regressions are easier to identify and roll
back.

## 2. Goals

- Move all user-facing routes to the App Router.
- Preserve all existing public URLs and `trailingSlash` behavior.
- Preserve the current MUI, Emotion, Sass modules, Font Awesome, and Roboto
  styling.
- Preserve current Contentful fallback behavior.
- Preserve or improve the current ISR behavior for products and blog posts.
- Make clean product and blog URLs work without a hidden `?id=` parameter.
- Keep Contentful delivery credentials out of the browser bundle.
- Keep the shopping cart available throughout client-side navigation.
- Provide correct metadata for static and dynamic pages.
- Finish with no runtime dependency on `pages/_app.js`, `pages/_document.js`,
  `next/router`, `next/head`, `getStaticProps`, or `getServerSideProps`.

## 3. Non-goals

The following work is intentionally outside this migration:

- Converting JavaScript to TypeScript.
- Moving the repository under `src/`.
- Replacing MUI with Tailwind CSS.
- Replacing React Context with Zustand or another state library.
- Changing the Contentful GraphQL API to the REST SDK.
- Redesigning pages or components.
- Implementing a new authentication system.
- Enabling Next.js Cache Components in the same change.
- Enabling the React Compiler.
- Replacing Google Analytics with a different analytics provider.

These can be tackled after the App Router migration has reached production and
is stable.

## 4. Current-state inventory

### 4.1 Routes

The Pages Router currently contains 11 public routes and two framework files:

| Current file | URL | Current behavior |
| --- | --- | --- |
| `pages/index.js` | `/` | Static categories from Contentful |
| `pages/productos/index.js` | `/productos` | ISR product catalog, 120 seconds |
| `pages/productos/[product]/index.js` | `/productos/:slug` | Client-side fetch using `?id=` |
| `pages/blog/index.js` | `/blog` | ISR blog listing, 120 seconds |
| `pages/blog/[post]/index.js` | `/blog/:slug` | Request-time fetch using `?id=` |
| `pages/blog/busqueda/index.js` | `/blog/busqueda` | Request-time search |
| `pages/calculadora/index.js` | `/calculadora` | Interactive client feature |
| `pages/cart/index.js` | `/cart` | Interactive cart and checkout |
| `pages/login/index.js` | `/login` | Interactive login UI |
| `pages/plan-dnature/index.js` | `/plan-dnature` | Interactive plan flow |
| `pages/preguntas-frecuentes/index.js` | `/preguntas-frecuentes` | Static FAQ with client accordion |
| `pages/_app.js` | Framework | Providers, global styles, MUI cache |
| `pages/_document.js` | Framework | HTML shell and MUI SSR integration |

There is no local `pages/api` directory to migrate.

### 4.2 Data fetching

Current Pages Router data functions:

- `getStaticProps`
  - `pages/index.js`
  - `pages/productos/index.js`
  - `pages/blog/index.js`
- `getServerSideProps`
  - `pages/blog/[post]/index.js`
  - `pages/blog/busqueda/index.js`
- Client-side Contentful fetching
  - `features/Product/index.js`

The Contentful service currently uses a GraphQL `POST` request in
`services/util.js`. Next.js 16 does not persistently cache server `fetch`
requests by default, so the target implementation must declare its caching
policy rather than relying on implicit behavior.

### 4.3 Router dependencies

The following files use `next/router`:

- `components/Header/HeaderNav/NavigationBar/index.js`
- `features/Blog/BlogCategoryGrid.js`
- `features/Cart/CartActions/CartActionsContainer.js`
- `features/Home/Hero/index.js`
- `features/Product/GoBack/index.js`
- `features/Product/index.js`
- `features/Products/index.js`
- `features/Products/Catalog/index.js`

### 4.4 Metadata dependencies

The following files use or import `next/head`:

- `components/Page/index.js`
- `features/Blog/index.js`
- `pages/calculadora/index.js`
- `pages/preguntas-frecuentes/index.js`

The current `Page` component also owns Google Analytics scripts, Organization
JSON-LD, the favicon, and the shared header/footer layout.

### 4.5 Client-side behavior

The application has approximately 76 files containing hooks, event handlers,
router access, local storage, or browser APIs. Not every file needs a
`"use client"` directive. Only the entry point of each client subtree needs the
directive; everything imported below that entry point becomes part of the
client graph.

Important browser-dependent areas include:

- Shopping cart context and cart history in `localStorage`.
- Header responsive state and active navigation.
- Product filtering and search.
- Calculator and Plan DNAture flows.
- Modals and forms.
- Google Maps.
- Blog category navigation.
- Animation and viewport hooks.
- `window.innerWidth` access during render in `features/Cart/Cart.js`.

## 5. Target architecture

The minimal target should use a root-level `app/` directory. Moving all source
files into `src/` is not necessary for the router migration.

```text
app/
├── error.js
├── layout.js
├── loading.js
├── not-found.js
├── page.js
├── providers.js
├── analytics.js
├── productos/
│   ├── page.js
│   ├── loading.js
│   └── [slug]/
│       ├── page.js
│       ├── loading.js
│       └── not-found.js
├── blog/
│   ├── page.js
│   ├── loading.js
│   ├── [slug]/
│   │   └── page.js
│   └── busqueda/
│       └── page.js
├── calculadora/
│   └── page.js
├── cart/
│   └── page.js
├── login/
│   └── page.js
├── plan-dnature/
│   └── page.js
└── preguntas-frecuentes/
    └── page.js
```

Existing `components/`, `features/`, `contexts/`, `hooks/`, `services/`, and
`styles/` directories can stay in place.

### 5.1 Root layout responsibilities

`app/layout.js` should:

- Import global Sass and font styles.
- Render `<html lang="es-CR">` and `<body>`.
- Export shared metadata and `metadataBase`.
- Wrap the application in MUI's
  `@mui/material-nextjs/v16-appRouter` cache provider.
- Render the client `Providers` component.
- Render the shared `Layout`, including header, main content, and footer.
- Render shared analytics and Organization JSON-LD once.

`app/providers.js` should be a Client Component and should contain:

- MUI `ThemeProvider`.
- `ShoppingCartContextProvider`.
- `ScopedCssBaseline`.

The App Router cache provider should replace both the current Pages Router
`AppCacheProvider` and the custom `_document.js` Emotion integration.

### 5.2 Rendering model

Use Server Components by default. Add client boundaries only where state,
effects, event handlers, router hooks, context, or browser APIs are required.

Recommended high-level boundaries:

| Area | Target |
| --- | --- |
| Root `app/layout.js` | Server Component |
| `app/providers.js` | Client Component |
| Shared `Layout` | Server where possible |
| Header entry component | Client Component |
| Footer | Server Component |
| Home page | Server page with client feature islands |
| Product catalog | Server page plus client catalog/filter island |
| Product detail | Server page plus client purchase controls |
| Blog listing/post | Server page with small client islands |
| Blog search | Server page driven by `searchParams` |
| Calculator | Client feature under a server page |
| Cart | Client feature under a server page |
| Plan DNAture | Client feature under a server page |
| FAQ | Server page plus client accordion |

For the first migration pass, it is acceptable to place `"use client"` at a
feature entry point and optimize smaller islands afterward. Correctness is more
important than minimizing the client bundle during the initial cutover.

## 6. Routing and URL design

### 6.1 Route mapping

| Pages Router | App Router | Rendering target |
| --- | --- | --- |
| `pages/index.js` | `app/page.js` | Static/cached Server Component |
| `pages/productos/index.js` | `app/productos/page.js` | ISR/cached Server Component |
| `pages/productos/[product]/index.js` | `app/productos/[slug]/page.js` | Dynamic Server Component |
| `pages/blog/index.js` | `app/blog/page.js` | ISR/cached Server Component |
| `pages/blog/[post]/index.js` | `app/blog/[slug]/page.js` | Dynamic Server Component |
| `pages/blog/busqueda/index.js` | `app/blog/busqueda/page.js` | Dynamic Server Component |
| `pages/calculadora/index.js` | `app/calculadora/page.js` | Static page with client feature |
| `pages/cart/index.js` | `app/cart/page.js` | Static page with client feature |
| `pages/login/index.js` | `app/login/page.js` | Static page with client feature |
| `pages/plan-dnature/index.js` | `app/plan-dnature/page.js` | Static page with client feature |
| `pages/preguntas-frecuentes/index.js` | `app/preguntas-frecuentes/page.js` | Static page with client feature |

Changing the dynamic folder name from `[product]` or `[post]` to `[slug]` does
not change the public URL.

### 6.2 Query strings

The following query-string behavior must be retained:

- `/productos?category=recetas`
- `/blog/busqueda?field=category&value=nutrición`
- `/blog/busqueda?field=hashtags_contains_some&value=...`

The following query-string behavior should be removed:

- `/productos/:slug?id=<contentful-id>`
- `/blog/:slug?id=<contentful-id>`

Product and post pages must load from the visible slug so copied, bookmarked,
indexed, and directly entered URLs behave correctly.

### 6.3 Router API replacements

| Pages Router usage | App Router replacement |
| --- | --- |
| `useRouter` from `next/router` | Hooks from `next/navigation` |
| `router.pathname` | `usePathname()` |
| `router.query.category` | `useSearchParams().get("category")` or page `searchParams` |
| `router.query.id` | Remove; fetch by route slug |
| `router.push({ pathname, query })` | Build and push a URL string |
| `router.back()` | `router.back()` from `next/navigation` |
| `getServerSideProps({ query })` | Await page `params` or `searchParams` |

Any statically rendered Client Component that calls `useSearchParams()` should
be placed inside a meaningful `Suspense` boundary.

## 7. Contentful migration design

### 7.1 Server-only access

Update `services/util.js` to:

- Add `import "server-only"`.
- Use `CONTENTFUL_SPACE_ID`.
- Use `CONTENTFUL_DELIVERY_API_KEY`.
- Remove runtime fallback to `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`.
- Remove runtime fallback to `NEXT_PUBLIC_CONTENTFUL_DELIVERY_API_KEY`.
- Allow callers to pass cache lifetime and cache tags.
- Preserve the existing five-second timeout and partial-data error shape.

Before removing public variables, confirm that the non-public variables exist
in every development, preview, staging, and production environment.

### 7.2 Slug queries

Add the following service functions:

```text
getProductBySlug(slug)
getProductSlugs()
getPostBySlug(slug)
getPostSlugs()
```

Required GraphQL changes:

- Query products by the Contentful `urlSlug` field.
- Query blog posts by the Contentful `slug` field.
- Return zero or one result and normalize missing results to `null`.
- Keep current optional-linked-entry handling for blog posts.
- Keep current product formatting for images, icons, and description.

Existing ID-based functions can remain temporarily for compatibility but should
be removed after all callers use slugs.

### 7.3 Caching policy

Do not enable `cacheComponents` during this migration. Preserve behavior with
explicit fetch revalidation and tags first.

Recommended initial policy:

| Data | Suggested lifetime | Suggested tag |
| --- | ---: | --- |
| Home categories | 1 hour | `categories` |
| Product catalog | 120 seconds | `products` |
| Product detail | 120 seconds | `product:<slug>` and `products` |
| Blog listing | 120 seconds | `posts` |
| Blog post | 120 seconds | `post:<slug>` and `posts` |
| Blog search | No persistent route cache | None |

The exact configuration can be passed to the Contentful fetch wrapper with
`next: { revalidate, tags }`.

After migration, a separate enhancement can enable Cache Components and replace
this strategy with `"use cache"`, `cacheLife()`, and `cacheTag()`.

### 7.4 Dynamic pages

Product and blog post pages should:

1. Await `params`.
2. Read `params.slug`.
3. Fetch data on the server.
4. Call `notFound()` if the entry does not exist.
5. Render data into a mostly server-rendered view.
6. Pass only the data required for interaction into client controls.
7. Export `generateMetadata()`.

`generateStaticParams()` is recommended after slug fetching is stable. It
should prebuild known product and post paths while leaving dynamic parameters
enabled for newly published content.

## 8. Metadata and analytics

### 8.1 Shared metadata

Move shared metadata out of `components/Page/index.js` and into
`app/layout.js`.

The root metadata should define:

- `metadataBase`.
- Default title.
- Title template.
- Default description.
- Open Graph site name and locale.
- Twitter card defaults.
- Favicon through the App Router favicon convention or metadata.

Correct the current default image URL from `/public/images/hero3.jpg` to
`/images/hero3.jpg`; files inside `public/` are served from the site root.

### 8.2 Per-route metadata

Use static `metadata` exports for:

- Products.
- Blog.
- Calculator.
- Cart.
- Login.
- Plan DNAture.
- FAQ.
- Blog search.

Use `generateMetadata()` for:

- Product detail pages.
- Blog post pages.

Dynamic metadata must use the same cached slug lookup as the page so the
application does not make unnecessary duplicate Contentful requests.

### 8.3 Structured data

Render Organization JSON-LD once in the root layout.

Optionally add, as a follow-up:

- Product JSON-LD on product detail pages.
- Article JSON-LD on blog post pages.
- FAQPage JSON-LD on the FAQ page.

JSON-LD output must escape or serialize untrusted content safely.

### 8.4 Google Analytics

Move the shared Google Analytics loader to the root layout. Add a small Client
Component using `usePathname()` and `useSearchParams()` if SPA page-view events
need to be sent on every client-side navigation.

Do not duplicate analytics scripts in individual pages.

## 9. MUI and styling migration

### 9.1 Cache provider

Replace:

```js
@mui/material-nextjs/v15-pagesRouter
```

with:

```js
@mui/material-nextjs/v16-appRouter
```

The installed `@mui/material-nextjs` package already exposes the Next.js 16 App
Router integration.

### 9.2 Theme boundary

The current theme is created in `theme.js`. Because the theme object is passed
to MUI's client provider, either:

- Import it from the client `app/providers.js`, or
- Mark a thin theme module as client-only if required by the build.

Keep the current palette, typography, responsive font sizing, and overrides.

### 9.3 Link adapters

Next.js 16 can reject a framework component passed as a function-valued prop
across a Server/Client boundary. Audit these existing MUI patterns:

- `features/Blog/BlogBreadcrumbs.js`
- `features/Blog/Post/PostTags.js`

If necessary, add a small `"use client"` Link adapter and pass that adapter to
MUI's `component` prop.

### 9.4 Existing CSS

Keep:

- `styles/globals.scss`.
- Sass variables and mixins.
- CSS modules.
- Fontsource Roboto imports.
- Font Awesome global CSS.

No CSS rewrite should be bundled with this migration.

## 10. Detailed implementation phases

### Phase 0 — Baseline and safety net

**Estimate:** 0.5–1 day

#### Tasks

- [ ] Record a successful `npm run lint`.
- [ ] Record a successful production build with valid Contentful variables.
- [ ] Capture current screenshots for all 11 routes at mobile and desktop widths.
- [ ] Record current metadata for home, product, blog, and blog post routes.
- [ ] Record current Contentful fallback behavior.
- [ ] Add browser smoke tests for core routes if a test runner is available.
- [ ] Document the production environment variables.
- [ ] Confirm whether `/api/current_user` is expected to exist externally or is
      currently unused.

#### Minimum smoke flows

- [ ] Navigate from home to a product category.
- [ ] Filter and search the product catalog.
- [ ] Open a product directly from its copied URL.
- [ ] Add products to the cart.
- [ ] Navigate to the cart and change quantities.
- [ ] Open and cancel the checkout form.
- [ ] Navigate from blog listing to a post.
- [ ] Search blog posts by category and tag.
- [ ] Complete the calculator flow.
- [ ] Start and navigate the Plan DNAture flow.
- [ ] Expand FAQ entries.

#### Exit criteria

- Baseline build and screenshots are available for comparison.
- Known pre-existing failures are documented and are not misclassified as
  migration regressions.

### Phase 1 — App Router foundation

**Estimate:** 0.5–1 day

#### Tasks

- [x] Create `app/layout.js`.
- [x] Create `app/providers.js` with `"use client"`.
- [x] Configure `AppRouterCacheProvider` from `v16-appRouter`.
- [x] Move ThemeProvider, cart provider, and ScopedCssBaseline into providers.
- [x] Import global Sass, Roboto weights, and Font Awesome CSS from the root
      layout.
- [x] Move shared header/footer rendering into the root layout.
- [x] Add default metadata and `metadataBase`.
- [x] Add Organization JSON-LD.
- [x] Add root `loading.js`.
- [x] Add root `error.js`.
- [x] Add root `not-found.js`.
- [x] Add or move shared analytics.

#### Compatibility requirement

Keep `pages/_app.js` and `pages/_document.js` while any Pages Router routes
remain. They are still required by those routes and must only be removed at the
end.

The foundation intentionally does not add an App Router `page.js`, because that
would duplicate one of the existing public Pages Router routes. The first
public App Router route will be introduced in Phase 4.

#### Exit criteria

- At least one temporary App Router route renders with the same MUI and Sass
  styling as the current application.
- No duplicate Emotion styles or hydration warnings appear.
- App and Pages routes can run in the same development process.

### Phase 2 — Client boundaries and navigation compatibility

**Estimate:** 1–1.5 days

#### Tasks

- [x] Mark the Header entry component as a Client Component.
- [x] Mark the shopping cart provider as a Client Component.
- [x] Establish client entry points for Products, Cart, Calculator, Plan
      DNAture, FAQ, and interactive Blog components.
- [x] Replace active-navigation `router.pathname` with `usePathname()`.
- [x] Replace product category `router.query` access.
- [x] Convert object-style `router.push()` calls to URL strings.
- [x] Preserve `router.back()` behavior through the Pages/App compatibility
      layer.
- [x] Wrap URL-reading client components in `Suspense`.
- [x] Fix MUI Link adapter boundaries where needed.
- [x] Remove direct `window.innerWidth` access from
      `features/Cart/Cart.js`; use the existing responsive hook, MUI media
      query, or CSS.
- [x] Verify every browser API is read in an effect, event handler, or guarded
      client-only path.

`next/compat/router` remains in shared components while the Pages Router is
still active. It is intentionally replaced with `next/navigation` route hooks
when each component becomes App Router-only in later phases.

#### Exit criteria

- No migrated component imports `next/router`.
- No server-rendered path throws `window is not defined`,
  `document is not defined`, or `localStorage is not defined`.
- No missing-Suspense build errors occur for `useSearchParams()`.

### Phase 3 — Contentful server layer

**Estimate:** 1–1.5 days

#### Tasks

- [ ] Make Contentful services server-only.
- [ ] Remove public credential fallbacks after deployment variables are ready.
- [ ] Extend `fetchFromContentful()` with explicit revalidation and tags.
- [ ] Implement `getProductBySlug()`.
- [ ] Implement `getProductSlugs()`.
- [ ] Implement `getPostBySlug()`.
- [ ] Implement `getPostSlugs()`.
- [ ] Preserve category fallback content.
- [ ] Preserve partial blog post data handling.
- [ ] Preserve Contentful timeout behavior.
- [ ] Add focused tests for data normalization and missing entries.

#### Exit criteria

- Product and post data can be fetched using only the URL slug.
- Contentful credentials do not appear in client bundles.
- Missing products and posts return `null`.
- Cache lifetimes are explicit and testable.

### Phase 4 — Static and low-risk routes

**Estimate:** 0.5–1 day

Migrate low-risk routes first:

1. `/preguntas-frecuentes`
2. `/calculadora`
3. `/plan-dnature`
4. `/login`

#### Tasks per route

- [x] Create the matching `app/.../page.js`.
- [x] Keep the page itself as a Server Component.
- [x] Render the existing interactive feature through a client boundary.
- [x] Add static metadata.
- [x] Remove the corresponding Pages Router file in the same change to avoid a
      duplicate route.
- [x] Run lint and build.
- [ ] Compare mobile and desktop screenshots.

#### Exit criteria

- All four routes render and navigate correctly.
- Calculator and Plan DNAture retain state during normal App Router navigation.
- The login page behavior matches the baseline.

### Phase 5 — Home, products, and cart

**Estimate:** 1–2 days

These routes should be migrated as one coordinated slice because they share
product discovery, cart state, header state, and navigation.

#### Home

- [x] Create `app/page.js`.
- [x] Fetch categories directly in the async Server Component.
- [x] Preserve fallback categories.
- [x] Apply the categories cache policy.
- [x] Keep Hero, Banner, and other interactive home features behind client
      boundaries only where needed.

#### Products listing

- [x] Create `app/productos/page.js`.
- [x] Fetch products directly on the server.
- [x] Preserve the 120-second refresh behavior.
- [x] Read the initial `category` from page `searchParams` or from a client
      search-parameter boundary.
- [x] Preserve filtering, search suggestions, and responsive filters.
- [x] Change product links to clean slug-only URLs.

#### Product detail

- [x] Create `app/productos/[slug]/page.js`.
- [x] Fetch by `params.slug` on the server.
- [x] Move product description formatting to a server-safe utility.
- [x] Call `notFound()` for missing products.
- [x] Add `generateMetadata()`.
- [x] Deliberately defer `generateStaticParams()`; products are available on
      first request through the dynamic route and 120-second data cache.
- [x] Pass product data to client purchase controls.
- [x] Remove the client `useEffect` Contentful fetch.

#### Cart

- [x] Create `app/cart/page.js`.
- [x] Preserve cart context and current-cart behavior.
- [x] Replace render-time `window.innerWidth`.
- [ ] Manually verify local cart history hydration in a browser.
- [ ] Manually verify quantity changes, remove actions, forms, modals, canvas capture,
      purchase order, and WhatsApp flow.

#### Exit criteria

- A copied `/productos/:slug` URL works without `?id=`.
- Category query parameters work on initial load and client navigation.
- Adding a product and navigating to `/cart` preserves the cart.
- Product and cart pages have no hydration warnings.
- Product metadata comes from Contentful.

### Phase 6 — Blog

**Estimate:** 1–1.5 days

#### Blog listing

- [ ] Create `app/blog/page.js`.
- [ ] Fetch posts in the Server Component.
- [ ] Preserve the 120-second refresh behavior.
- [ ] Move blog metadata from `features/Blog/index.js` to the route.
- [ ] Keep category-grid navigation client-side or replace clickable papers
      with links.
- [ ] Change post links to clean slug-only URLs.

#### Blog post

- [ ] Create `app/blog/[slug]/page.js`.
- [ ] Fetch by `params.slug`.
- [ ] Call `notFound()` for missing posts.
- [ ] Add `generateMetadata()`.
- [ ] Optionally add `generateStaticParams()`.
- [ ] Preserve Contentful rich-text rendering and optional linked-entry
      behavior.
- [ ] Verify post product links use clean product slugs.

#### Blog search

- [ ] Create `app/blog/busqueda/page.js`.
- [ ] Await `searchParams`.
- [ ] Validate the `field` allowlist before constructing a Contentful query.
- [ ] Normalize missing or malformed query values to an empty result.
- [ ] Keep search results request-driven or assign a deliberate caching policy.
- [ ] Add static search-page metadata.

#### Exit criteria

- A copied `/blog/:slug` URL works without `?id=`.
- Category and tag searches return the same results as the baseline.
- Rich text, images, author information, tags, and product recommendations
  render correctly.
- Blog post metadata comes from Contentful.

### Phase 7 — Cleanup and cutover

**Estimate:** 0.5 day

#### Tasks

- [ ] Confirm all public routes now exist under `app/`.
- [ ] Remove the `pages/` route files.
- [ ] Remove `pages/_app.js`.
- [ ] Remove `pages/_document.js`.
- [ ] Remove the obsolete `components/Page` wrapper.
- [ ] Remove obsolete `emotionCache.js` if no longer imported.
- [ ] Remove all `next/router` imports.
- [ ] Remove all `next/head` imports.
- [ ] Remove all `getStaticProps`, `getServerSideProps`, and `getInitialProps`
      usage.
- [ ] Remove old ID-based product/post query-string construction.
- [ ] Remove unused imports exposed by migration.
- [ ] Run lint and production build.
- [ ] Inspect the build's route rendering output.
- [ ] Run the complete browser regression suite.

#### Exit criteria

The following commands return no matches:

```bash
rg "next/router|next/head|getStaticProps|getServerSideProps|getInitialProps" \
  app components features contexts hooks services
```

The application builds without the `pages/` directory.

### Phase 8 — Production verification

**Estimate:** 0.5–1 QA day

#### Before deployment

- [ ] Deploy to a preview or staging environment.
- [ ] Verify server-only Contentful variables.
- [ ] Verify direct product and blog URLs.
- [ ] Verify Google Analytics only loads once.
- [ ] Verify metadata and canonical URLs.
- [ ] Verify sitemap and robots output.
- [ ] Verify trailing-slash behavior.
- [ ] Verify Contentful changes become visible within the expected cache window.
- [ ] Run mobile Safari and mobile Chrome smoke tests.
- [ ] Run desktop Chrome, Safari, and Firefox smoke tests.

#### After deployment

- [ ] Verify home, product listing, product detail, blog listing, and blog detail
      HTTP responses.
- [ ] Verify there are no elevated 404 or 500 rates.
- [ ] Verify Contentful request volume does not spike.
- [ ] Verify analytics page views.
- [ ] Verify cart persistence during navigation.
- [ ] Verify copied dynamic URLs from an incognito session.

## 11. Testing plan

The repository currently has no automated test files. At minimum, add
Playwright or equivalent browser smoke coverage before the final cutover.

### 11.1 Route smoke matrix

| Route | Desktop | Mobile | Direct load | Client navigation |
| --- | :---: | :---: | :---: | :---: |
| `/` | Required | Required | Required | Required |
| `/productos` | Required | Required | Required | Required |
| `/productos/:slug` | Required | Required | Required | Required |
| `/blog` | Required | Required | Required | Required |
| `/blog/:slug` | Required | Required | Required | Required |
| `/blog/busqueda?...` | Required | Required | Required | Required |
| `/calculadora` | Required | Required | Required | Required |
| `/cart` | Required | Required | Required | Required |
| `/login` | Required | Required | Required | Required |
| `/plan-dnature` | Required | Required | Required | Required |
| `/preguntas-frecuentes` | Required | Required | Required | Required |

### 11.2 Product and cart tests

- Product catalog renders Contentful results.
- Category deep links select the correct category.
- Search suggestions navigate to the correct clean URL.
- Direct product URLs work without query parameters.
- Missing products show the App Router not-found UI.
- Product presentation and quantity selection work.
- Add-to-cart updates the header count.
- Cart survives navigation among all App Router pages.
- Cart quantity changes and removals work.
- Cart history handles empty, malformed, and valid local storage.
- Checkout modals work at mobile and desktop breakpoints.

### 11.3 Blog tests

- Blog list renders posts.
- Direct post URLs work without query parameters.
- Missing posts show not-found UI.
- Category search works.
- Hashtag search works.
- Malformed search parameters return an empty safe state.
- Rich text and linked assets render.
- Blog product recommendations navigate to clean product URLs.

### 11.4 Rendering and hydration tests

- No hydration errors in the browser console.
- No `window`, `document`, or `localStorage` server errors.
- No Emotion style-order or flash-of-unstyled-content regression.
- No missing `Suspense` boundary build failures.
- No duplicated header, footer, analytics, or metadata tags.

### 11.5 SEO tests

- Default title and description exist.
- Product titles, descriptions, and images are dynamic.
- Blog titles, descriptions, and images are dynamic.
- Open Graph URLs use the production origin.
- Public image paths do not contain `/public/`.
- HTML language is `es-CR`.
- Organization JSON-LD is valid.

## 12. Incremental migration and release strategy

Next.js allows `app/` and `pages/` to coexist, but crossing between routers
causes a hard navigation. This project stores the active shopping cart in React
Context and does not automatically persist every active-cart mutation.

Therefore:

- Development can proceed route by route.
- Review can proceed PR by PR.
- A mixed-router production release can reset the active cart when users cross
  router boundaries.
- Production should receive the fully migrated route set in one coordinated
  release unless temporary active-cart persistence is implemented first.

Never keep the same public route in both `pages/` and `app/`. When an App Router
route is added, remove or rename its Pages Router counterpart in the same PR.

### Rollback

Before cutover:

- Keep the final Pages Router commit identifiable.
- Avoid unrelated dependency or styling changes.
- Keep Contentful schema unchanged.
- Ensure server-only environment variables are added before public fallbacks
  are removed.

If production verification fails, revert the migration PRs as a group and
redeploy the last Pages Router commit. Contentful content and public URLs should
remain compatible with the rollback.

## 13. Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Mixed-router navigation resets cart context | Lost active cart | Release all cart-related routes together or temporarily persist active cart |
| Missing Client Component boundary | Build/runtime errors | Add boundaries at feature entry points and run production builds frequently |
| Direct browser API access | SSR failure | Move access into effects/hooks or guarded client paths |
| Implicit fetch caching changes | Stale content or excessive Contentful traffic | Add explicit revalidation/tags and monitor request volume |
| Product/post lookup still depends on `?id=` | Broken copied URLs and SEO | Query Contentful by visible slug |
| Public Contentful delivery token remains exposed | Unnecessary credential exposure | Use server-only variables and `server-only` imports |
| MUI/Emotion streaming mismatch | FOUC or duplicate CSS | Use the installed `v16-appRouter` cache provider |
| `useSearchParams()` lacks Suspense | Production build failure or CSR bailout | Add stable-size Suspense fallbacks |
| MUI `component={Link}` crosses boundary | Next.js 16 serialization error | Add a client Link adapter |
| Dynamic `params` treated synchronously | Next.js 16 runtime/build error | Always await `params` and `searchParams` |
| No automated regression suite | Undetected behavior changes | Add core Playwright smoke tests before cutover |
| Contentful unavailable during build | Build failure or missing static paths | Preserve fallbacks and permit runtime dynamic paths |

## 14. Suggested PR and branch plan

Use `rebranding/main` as the integration branch if the repository adopts the
`rebranding/*` namespace.

### PR 1 — Foundation

```text
rebranding/app-router-foundation
```

- Root layout.
- Providers.
- MUI App Router integration.
- Global styles and fonts.
- Root metadata, analytics, loading, error, and not-found files.

### PR 2 — Navigation and client boundaries

```text
rebranding/app-router-client-boundaries
```

- `next/navigation` conversion.
- Client entry points.
- Suspense boundaries.
- Browser API fixes.
- MUI Link adapter.

### PR 3 — Contentful server layer

```text
rebranding/app-router-contentful
```

- Server-only credentials.
- Slug-based queries.
- Explicit caching and tags.
- Service tests.

### PR 4 — Static routes

```text
rebranding/app-router-static-routes
```

- FAQ.
- Calculator.
- Plan DNAture.
- Login.

### PR 5 — Products and cart

```text
rebranding/app-router-commerce
```

- Home.
- Products listing.
- Product detail.
- Cart.
- Dynamic product metadata.

### PR 6 — Blog

```text
rebranding/app-router-blog
```

- Blog listing.
- Blog post.
- Blog search.
- Dynamic blog metadata.

### PR 7 — Cleanup and QA

```text
rebranding/app-router-cleanup
```

- Remove Pages Router.
- Remove obsolete wrappers and caches.
- Add or finalize end-to-end tests.
- Staging verification.

PRs may be reviewed independently but should be merged into an integration
branch and released together unless active-cart persistence is addressed.

## 15. Effort estimate

| Workstream | Estimate |
| --- | ---: |
| Baseline and safety net | 0.5–1 day |
| Root layout, providers, MUI, metadata foundation | 0.5–1 day |
| Client boundaries and navigation conversion | 1–1.5 days |
| Contentful slug lookup and caching | 1–1.5 days |
| Static routes | 0.5–1 day |
| Home, products, product detail, and cart | 1–2 days |
| Blog routes | 1–1.5 days |
| Cleanup, build verification, and QA fixes | 0.5–1 day |

Some phases overlap. The expected total is approximately **5–8 engineering
days**, followed by **0.5–1 dedicated QA day**.

The estimate assumes:

- No Contentful schema changes are required.
- Current designs and behavior are preserved.
- Authentication remains unchanged.
- No TypeScript or styling migration is included.
- Required deployment environment variables can be updated promptly.

## 16. Definition of done

The migration is complete when:

- [ ] All 11 public routes are served from `app/`.
- [ ] The `pages/` directory is no longer required.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes with production-like environment variables.
- [ ] No source imports `next/router` or `next/head`.
- [ ] No source exports `getStaticProps`, `getServerSideProps`, or
      `getInitialProps`.
- [ ] Product and blog detail routes work without `?id=`.
- [ ] Missing product and post slugs render not-found UI.
- [ ] Product and blog caching behavior is explicit.
- [ ] Contentful delivery credentials are server-only.
- [ ] MUI and Sass render without hydration or style-order regressions.
- [ ] Cart state survives normal navigation.
- [ ] Mobile and desktop smoke tests pass.
- [ ] Metadata, analytics, sitemap, robots, and JSON-LD are verified.
- [ ] Production monitoring shows no meaningful increase in 404s, 500s, or
      Contentful request volume.

## 17. Official references

- [Next.js App Router migration guide](https://nextjs.org/docs/15/pages/guides/migrating/app-router-migration)
- [Next.js App Router documentation](https://nextjs.org/docs/app)
- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js fetch caching](https://nextjs.org/docs/app/api-reference/functions/fetch)
- [Next.js `useRouter`](https://nextjs.org/docs/app/api-reference/functions/use-router)
- [Next.js `generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [Next.js `generateMetadata`](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [MUI Next.js integration](https://mui.com/material-ui/integrations/nextjs/)
