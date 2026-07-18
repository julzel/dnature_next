# Phase 0 baseline and safety net

This document defines the reproducible baseline added during Phase 0. The
machine-readable measurements live in `performance-baseline.json`.

## Environments

- Local fixture: an optimized production build with deterministic
  categories/products, enabled only with `E2E_USE_FIXTURES=1`, served at
  `http://127.0.0.1:3100`.
- Preview/production: supply the deployed origin with `BASELINE_BASE_URL`.
  Contentful and deployment behavior are measured as-is.
- Profiles: Playwright Desktop Chrome and iPhone 13 emulation. The JSON records
  viewport, device scale, touch/mobile flags, Node version, platform, browser,
  timestamp, Git revision, and source URL.

## Commands

```sh
npm test
npm run test:e2e
npm run test:a11y
npm run baseline:performance
BASELINE_BASE_URL=https://preview.example.com npm run baseline:performance
```

The performance capture records status, navigation duration, DOM content loaded,
load, lab LCP, lab CLS, request count, total response bytes, JavaScript bytes,
and image bytes for every main route on desktop and mobile. These are lab
signals, not field Core Web Vitals. Run Lighthouse in Chrome against the same
preview URL for release sign-off; store its HTML/JSON artifact with the
deployment rather than comparing noisy local development scores.

## Browser failure policy

Every smoke and axe test automatically fails on uncaught page errors, console
errors, React hydration mismatch messages, or the React 19 `element.ref`
warning. The explicit 404 and error-boundary tests allow only their expected
errors and assert that those errors occurred.

The axe baseline currently contains three pre-existing serious color-contrast
findings, one each on the product detail, calculator, and empty-cart routes.
Their rule, severity, route, and node count cannot grow. All new serious or
critical findings fail the suite.

## Determinism

CI never needs Contentful credentials. The fixture switch is server-side and
inactive by default. Browser tests use a separate `.next-e2e` directory so they
can run while a developer has the regular Next.js server open.
