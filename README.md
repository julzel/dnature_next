DNAture's Spanish (`es-CR`) website, built with Next.js, TypeScript, and plain CSS.
The canonical production origin is `https://dnaturefood.com`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

For development on another device, set `ALLOWED_DEV_ORIGINS=192.168.100.13`
in `.env.local` and restart the dev server. Separate multiple hostnames with commas;
omit the protocol and port.

The homepage at [http://localhost:3000](http://localhost:3000) currently contains the
header, a full-viewport hero with lorem ipsum copy, two CTAs, a dog photograph, and empty contact
and footer sections. Its header feature lives in
`features/header/`: a 78px navigation row and an expandable
search panel below navigation. Search currently covers the published editorial pages.
The navigation row fades from transparent to solid white over the first 45px of scrolling
below 1024px, and over 60px on desktop.
The header logo starts white and changes with the same scroll progress as the
background, reaching its brand color when the background becomes solid white.
It also scales from two-thirds size (76px wide) to full size (114px wide) over that
same scroll distance, with its layout space reserved to prevent surrounding elements shifting.
Below 1024px, a menu button beside search opens a left-side navigation drawer
with keyboard focus containment, Escape/backdrop dismissal, and reduced-motion support.
The hero is implemented in `features/hero/` and uses a full-width photograph with
the text and CTAs layered above it on mobile and desktop. Contact and footer placeholders live in
`features/contact/` and `features/footer/`.
The current hero photo is `public/images/hero-02.jpg`; the previous photo is
preserved at `public/images/hero.jpg`.
Review the extracted prototype at [http://localhost:3000/prototype](http://localhost:3000/prototype).
Both routes are noindex and excluded from the public sitemap.

The landing page's personalized experience lives in `features/experience/`.
It uses a three-question flow inspired by [Creative Types](https://mycreativetype.com/):
cat/dog selection, pet name, and a keyboard-accessible breed autocomplete, followed
by an editable profile review. Answers stay in React state for the current page;
they are not sent to a server or persisted across reloads. The local starter breed
catalogue uses [FCI](https://www.fci.be/es/nomenclature/varietes.aspx) and
[CFA](https://cfa.org/breeds/) names, Spanish search aliases, mixed/unknown options,
and an explicit custom-entry choice for breeds outside the list. Changing species
clears the previous breed. Motion respects the user's reduced-motion preference.

Edit `components/landing-prototype.tsx` to work on the prototype. The shared header
and footer for the prototype and editorial pages live in `app/(site)/layout.tsx`.

The landing-page prototype follows `docs/graphic-design/DNAture_Design_System.md`,
using the supplied monochrome logos, original photography, brand/category color
tokens, and the specified Avenir/Segoe UI/Arial system-font fallback. Licensed
Avenir Next LT Pro and Gotham Ultra webfont files have not been supplied.

Interface surfaces use cool white (`#F6FAFF`) and blue-gray (`#F1F5F9`), overriding
the design proposal's warm-white surface.

The prototype includes three experience tabs, optional pet discovery, product-family
filters and information dialogs, family search, mobile navigation, native FAQ
accordions, and honest account/cart empty states. It does not create profiles,
recommend diets, or process purchases. Family imagery is illustrative; approved live
SKU, price, stock and species eligibility are still required for commerce.

## SEO and GEO

The project implementation follows `docs/SEO-GEO/DNAture_SEO_GEO_Strategy_2026.md`.
See [the implementation and launch guide](docs/SEO-GEO/implementation.md) for the
requirement mapping, content gates, remaining dependencies, and launch checks.

The default setup is **noindex**. To enable indexing on a reviewed production
deployment, set `SEO_INDEXING_ENABLED=true` and rebuild. The canonical origin is
configured by `SITE_URL`, defaulting to `https://dnaturefood.com`. Known Vercel and
Netlify preview environments remain noindex even if the flag is enabled. Other
hosting providers must leave the flag disabled on their preview deployments.
`.env.example` documents the settings; preserve existing secrets when adding them
to `.env.local` or deployment configuration.

Implemented: unique page metadata, canonicals, Open Graph/social images,
Organization/WebSite identity, visible breadcrumbs with JSON-LD, sitemap,
crawler rules, private-route noindex headers, and Search Console/Bing verification
token hooks. The source product catalog is an editorial reference; verified live
SKU data is required before product pages, offers, or merchant feeds are published.

## Testing

Install the project dependencies and Playwright browsers:

```bash
npm ci
npx playwright install chromium firefox webkit
```

On Linux, use `npx playwright install --with-deps chromium firefox webkit`
to install the browser system dependencies as well.

```bash
npm test                       # All end-to-end and regression tests
npm run test:e2e               # Chromium, Firefox, WebKit, and mobile Chromium
npm run test:seo               # Production metadata, crawlability, schema, and policy checks
npm run test:seo:preview       # Separate build proving preview responses remain noindex
npm run test:regression        # Content, responsive layout, and screenshot checks
npm run test:ui                # Interactive test runner
npm run test:report            # Open the last HTML report
npm run lint
npm run typecheck
```

Each test invocation builds the application and starts a production server at
`http://127.0.0.1:3100`. Keep port 3100 available; an existing server is intentionally
not reused. No separate development server is required. The initial build needs
no font downloads: typography uses the design system's system-font fallback.
Next.js loads local environment files normally; the tests do not require application
secrets. The primary Playwright config explicitly
tests production indexing; the preview config rebuilds with preview deployment flags.
Both use port 3100 and must run sequentially.

The end-to-end suite in `tests/e2e/` and colocated `features/*/tests/e2e/` checks successful page loading, brand content,
browser runtime errors, internal navigation, breadcrumbs, and the Spanish 404
response. Add tests for new user journeys here as the application grows.

The regression suite in `tests/regression/` checks the main content's accessibility
tree, horizontal overflow, visible actions, and full-page screenshots at desktop
(1440 × 900) and mobile (390 × 844) sizes, in light and dark mode. The configuration
fixes locale, timezone, motion preferences, and pixel density for repeatable results.

### Reviewing visual changes

Screenshot baselines are versioned in `tests/regression/__screenshots__/` and
separated by operating system and project. Missing or changed screenshots fail
normal test runs. After an intentional design change:

```bash
npm run test:regression:update
npm run test:regression
```

Review the changed PNGs and HTML report before committing the updated baselines.
Do not update baselines just to make an unexplained failure pass. The inline
accessibility snapshot in `tests/regression/home.spec.ts` should also be reviewed
when page content or structure changes.

The included screenshot baselines were generated on macOS 26 / Apple Silicon
using the Playwright version locked in `package-lock.json`. CI runs on `macos-26`
to match that environment. Screenshots can differ by OS, browser version, and font
rendering; see [Playwright's visual comparison guidance](https://playwright.dev/docs/test-snapshots).
On another OS, generate and review that platform's baselines explicitly; functional
end-to-end tests can run without screenshot baselines. After upgrading Playwright,
reinstall its browsers and review any changed screenshots.

### Continuous integration and failures

`.github/workflows/tests.yml` runs lint, all browser tests, preview-indexing checks, and TypeScript checks
on pull requests, pushes to `main` or `master`, and manual dispatch. It uses two
workers, retries failures twice, rejects focused tests (`test.only`), and never
updates baselines automatically.

The HTML report is written to `playwright-report/`; preview tests use its `preview/`
subdirectory. Failed tests retain screenshots,
video, and traces in `test-results/`; CI uploads both directories as the
`playwright-results` artifact for 14 days. View a trace with
`npx playwright show-trace <path-to-trace.zip>`. Reports and failure artifacts are
ignored by Git; baseline PNGs are committed with the tests.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
