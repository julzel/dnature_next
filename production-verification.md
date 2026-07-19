# Production verification

Run this checklist against the deployed preview or staging URL before release.
The command verifies public HTTP responses, metadata, canonical URLs, trailing
slashes, sitemap/robots output, and (when configured) the Google Analytics
loader.

```bash
PRODUCTION_BASE_URL=https://preview.example.com \
PRODUCTION_PRODUCT_URL=/productos/current-product-slug \
npm run verify:production
```

To validate the production environment configuration from a CI job or the
hosting provider shell, also pass `--require-server-contentful-env`. This
requires `CONTENTFUL_SPACE_ID` and `CONTENTFUL_DELIVERY_API_KEY`, and fails if
either legacy `NEXT_PUBLIC_CONTENTFUL_*` variable is still present.

```bash
npm run verify:production -- --base-url=https://preview.example.com \
  --product-url=/productos/current-product-slug \
  --analytics-id=G-XXXXXXXXXX \
  --require-server-contentful-env
```

Before releasing, rename the current public Contentful variables in every
environment. The application currently retains their fallback for backward
compatibility, so the strict environment check will intentionally fail until
the server-only migration is completed.

Manual checks still required on the preview deployment:

- Mobile Safari/Chrome and desktop Chrome/Safari/Firefox smoke tests.
- Cart persistence, quantity changes, checkout modal, purchase order, and
  WhatsApp flow.
- Copied dynamic product URLs in an incognito window.
- Contentful publishing visibility within the 120-second product cache window
  (and the one-hour category cache window).
- Analytics page views and hosting logs for 404/500 rates and Contentful
  request volume after deployment.
