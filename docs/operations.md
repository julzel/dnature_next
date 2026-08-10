# Operations runbook

## Ownership

The DNAture project owner owns deployment configuration, production verification,
dependency-update review, monitoring triage, and the external policy decisions
listed below. The technical maintainer owns the App Router implementation and
must update this runbook when integrations change.

## Required environment variables

| Variable | Visibility | Purpose |
| --- | --- | --- |
| `CONTENTFUL_SPACE_ID` | server only | Contentful space identifier |
| `CONTENTFUL_DELIVERY_API_KEY` | server only | Contentful delivery token |
| `AVIFY_API_KEY` | server only | Avify API credential used by the server-only integration service |
| `AVIFY_GRAPHQL_URL` | server only | Optional Avify GraphQL endpoint override; defaults to `https://api.avify.com/graphql` |
| `NEXT_PUBLIC_SITE_URL` | public | Canonical production origin; defaults to `https://dnaturefood.com` |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | public | Browser Maps key |
| `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID` | public | Maps style identifier |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS` | public | GA measurement ID; no script loads without consent |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Hosted Supabase project URL for customer accounts |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public | Publishable Supabase browser key; RLS remains the authorization boundary |
| `ACCOUNT_REGISTRATION_MODE` | server only | `invitation` for the pilot; `public` only after the public-launch gates |
| `ACCOUNT_PORTION_PLANNING_ENABLED` | server only | Keeps clinical portion guidance disabled until written approval |
| `ACCOUNT_STAGE_2_ENABLED` | server only | Keeps Red Veterinaria disabled during Stage 1 |
| `MONITORING_INGEST_URL` | server only | Approved monitoring endpoint |
| `MONITORING_INGEST_TOKEN` | server only | Optional bearer token for that endpoint |

Do not use a `NEXT_PUBLIC_` prefix for Contentful, Avify, or monitoring
credentials. Keep Avify endpoint overrides server-side.

Customer-account deployment, Supabase migration, Resend SMTP, Google OAuth,
pilot restrictions, and rollback are documented in
[`accounts/stage-1-implementation.md`](./accounts/stage-1-implementation.md).

The `/avify-test/` diagnostic route is development-only. The root proxy returns
an HTTP 404 before rendering in production, and the page repeats the production
guard as defense in depth. It performs live, uncached requests and must not be
used as an availability monitor.

## Assisted-shopping operations

Checkout prepares a request for manual coordination; it is not a payment or
order-processing system. The application:

1. reconciles product identity and price against the published Contentful
   catalogue;
2. collects only the fields required by the selected fulfillment option;
3. attempts to generate a PNG in the customer's browser; and
4. opens a prefilled WhatsApp conversation after the customer explicitly asks
   to continue.

The catalogue check does not query Avify inventory or reserve stock. When
available, the PNG is not uploaded, attached, or sent by the application; the
WhatsApp text retains a limited product-summary fallback. DNAture staff must confirm
availability, final amount, payment, location, and timing in WhatsApp before the
request is treated as an order.

The official WhatsApp number is centralized as E.164 digits in
`constants/contact.js`. Changing it requires checking the header, contact
section, mobile navigation, checkout message, customer guide, and the receiving
WhatsApp Business account. Customers may write 24/7; staffed support is Monday
through Friday, 8:00 a.m.–5:00 p.m. Costa Rica time, with replies within two
business hours. The product owner must still name the operational owner and
fallback process before launch.

The approved commercial contract is:

- Contentful catalogue prices are net and exclude IVA;
- checkout adds 13% IVA to the subtotal; and
- delivery adds an estimated ₡3,500 fee. Staff confirms GAM coverage before
  accepting the request.

Totals remain labelled as estimates because inventory, coverage, and merchant
acceptance are confirmed manually. Do not change this formula or publish
stronger fulfillment promises without product-owner approval.

## Pre-release checklist

1. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin, without a path.
2. Deploy preview, then run `npm run verify:production -- --base-url <preview-url> --product-url <normalized-product-url>`.
3. Confirm `/robots.txt` references `/sitemap.xml`, and confirm normalized product URLs occur in the sitemap.
4. Inspect response headers for every public route. The configured CSP permits only the current Contentful image host, Google Maps, Google Analytics, and same-origin resources. Update and preview-test it whenever an integration changes.
5. Configure HSTS at the hosting/CDN layer after HTTPS is confirmed; it is intentionally not set by application code because the host controls HTTPS termination.
6. Set `MONITORING_INGEST_URL` to the approved provider and test a deliberately triggered preview error. Monitoring events contain only a redacted name, message, route, source, and timestamp.
7. Run `npm run audit:public-assets` and review every reported candidate manually; a static reference scan alone is not evidence that an asset can be deleted.
8. Run `npm run review:performance` and investigate warnings with three comparable preview captures before changing a performance baseline.
9. Verify the approved net-price basis, 13% IVA calculation, ₡3,500 estimated delivery fee, and GAM coverage wording in the deployed checkout.
10. Confirm that the official WhatsApp Business account is reachable by the trained operator during the approved schedule, that the two-business-hour response target is monitored, and that a fallback process is available.

Complete manual smoke tests on mobile Safari/Chrome and desktop
Chrome/Safari/Firefox. The assisted-shopping test must cover:

- add, increment, decrement, remove, empty, and restore-cart behavior;
- optional instructions entered in the drawer and edited at checkout;
- explicit pickup and delivery selections, including conditional address
  fields and all seven Costa Rican provinces;
- required payment preference and validation errors in Spanish;
- guest checkout and authenticated profile/address prefill without forcing a
  sign-in;
- catalogue reconciliation with an unchanged item, changed price, removed
  product, Contentful failure, and a second review after a change;
- displayed subtotal, IVA, fulfillment amount, and estimated total;
- edit-data and return-to-cart paths from the final review;
- unique PNG download, correct visible request data, repeat download, and
  failure recovery;
- prefilled WhatsApp destination and encoded product summary, with no name,
  email, phone, address, or notes in the URL;
- the explicit instruction that the customer must attach the PNG when
  available and send the message manually;
- closing while preserving the cart and starting another request; and
- 320 px layout, keyboard/focus behavior, slow connections, and blocked
  downloads or external-app navigation.

Also verify copied product URLs in an incognito window, Contentful publishing
visibility, analytics page views, CSP behavior for `wa.me`, and hosting 404/500
rates. A successful image download or WhatsApp click is not evidence of a
received order; operational verification requires a test message and human
acknowledgement in the approved test conversation.

Asset deletion requires production access-log evidence for the candidate paths,
a preview deployment, and a before/after verification with `lint`, unit tests,
the production build, browser tests, and `verify:production`. Keep the audit
report outside the repository unless it is intentionally approved as release
evidence.

## Google integrations

Before production, the project owner must record evidence that the Maps key is
restricted to production/preview HTTP referrers and only the Maps JavaScript API
and required Places/marker APIs, with quotas and billing alerts enabled. The key
is intentionally public because Maps loads it in the browser.

Analytics is opt-in. `app/analytics.js` loads Google Analytics only when a
consent manager sets local-storage key `dnature-analytics-consent` to `granted`
and dispatches a `dnature-analytics-consent` event. Do not configure the
measurement ID in a market until the project owner has approved the consent
notice, lawful basis, and retention settings with the relevant legal/privacy
reviewer.

## Maintenance

Dependabot opens weekly dependency and GitHub Actions updates. The scheduled
`Dependency maintenance` workflow runs a production dependency audit and checks
that every installed package declares license metadata. The project owner reviews
and resolves failures weekly; legal/privacy review approves new or changed
licenses before release.
