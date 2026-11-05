# DNAture SEO + GEO implementation

Implementation date: 5 November 2026. Canonical origin confirmed by the project owner:
`https://dnaturefood.com`. Source documents are preserved as supplied.

## Implemented foundation

| Playbook requirement | Project implementation |
| --- | --- |
| Spanish Costa Rica, brand terminology | `lang="es-CR"`, Spanish copy, official tagline, `es_CR` Open Graph locale; one language version, so no invented hreflang alternates |
| Server-rendered public information and normal links | `/`, `/nosotros`, `/ciencia`, `/ciencia/nuestros-criterios`; headings, main/nav landmarks, keyboard skip link, visible breadcrumbs |
| Unique titles/descriptions and stable canonicals | `lib/seo/metadata.ts`; canonical origin from `SITE_URL`; query parameters excluded; no trailing slash except the HTTP root path; canonical root serialized as `https://dnaturefood.com` |
| Public discovery | `app/sitemap.ts`, explicit implemented-page registry in `lib/seo/pages.ts`; no product drafts, private routes, fake dates, or future URLs |
| Social identity | Open Graph/Twitter metadata and generated 1200 × 630 PNG; DNAture wordmark text and a letter-based favicon |
| Organization identity | Homepage `Organization` + `WebSite` JSON-LD with name, URL, tagline and language; no invented address, credentials, affiliations, ratings, or social profiles |
| Breadcrumbs | Visible trails and matching `BreadcrumbList` JSON-LD on secondary pages |
| Product evidence gate | `productData()` only returns offers for records marked verified, with reviewer/date, SKU, label fields, HTTPS image and positive finite CRC price; excluded/draft records return no schema |
| Preview and private-route indexing | Root robots metadata and `X-Robots-Tag` headers; explicit production launch flag; Vercel/Netlify preview guards; private account/cart/search/order paths always noindex |
| Search discovery versus training | Explicit `OAI-SearchBot` search rule; `GPTBOT_POLICY` independently configurable, with no training-specific decision made by default |
| Search platform verification | Optional `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` metadata; actual property verification still requires account access |
| Regression protection | Production SEO tests without JavaScript, policy tests, real preview-build tests, browser navigation tests and reviewed desktop/mobile light/dark screenshots |

The current science pages describe the brand's approach and publication criteria.
They are not clinical guidance, reviewed veterinary articles, or evidence of the
adequacy of a particular product. They intentionally carry no `Article`, `Product`,
`LocalBusiness`, medical endorsement, review, shipping-policy, or returns markup.
Add those types only when an implemented page and its verified visible facts support them.

## Configuration and launch

Settings are documented in `.env.example`. Add individual settings to the existing
environment rather than replacing `.env.local`.

```dotenv
SITE_URL=https://dnaturefood.com
SEO_INDEXING_ENABLED=false
GOOGLE_SITE_VERIFICATION=
BING_SITE_VERIFICATION=
GPTBOT_POLICY=inherit
```

- `SITE_URL` must be a public HTTPS origin, with no path, port, query, fragment or credentials.
- Indexing is enabled only when `NODE_ENV=production` and `SEO_INDEXING_ENABLED=true`.
- `VERCEL_ENV` and Netlify `CONTEXT`, when present, must also be `production`.
- Other hosting providers must explicitly leave `SEO_INDEXING_ENABLED=false` for previews.
- Change these settings before building: metadata routes and Next.js header rules are generated from the build configuration. Rebuild after changing them; changing only the environment of an existing build is insufficient.
- A disabled deployment has noindex metadata, global `X-Robots-Tag: noindex, nofollow`, and an empty sitemap.
- `robots.txt` permits crawling so crawlers can actually see the noindex directives. Blocking a URL in robots.txt can prevent Google from seeing noindex. [Google's noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- `GPTBOT_POLICY=inherit` emits no GPTBot-specific group, so that crawler inherits the general allow rule. `allow` and `disallow` are available for an explicit brand decision. Search discovery remains separately allowed. No training opt-out has been silently assumed.
- Robots directives are not access control. Add authentication/authorization before implementing real account, pet or order pages. Current private paths have no application pages and return 404.

For a public launch, review the actual published content, set the production-only
indexing flag, rebuild, and inspect the deployed HTML, `robots.txt` and `sitemap.xml`.
Confirm the production host redirects HTTP and alternate hostnames to the canonical
origin using hosting/domain configuration. No redirect to an unconfirmed host was added.
Do not serve the same build on public preview hosts without the preview controls.

Submit the deployed sitemap in Search Console and Bing after verifying the domain
property. Domain/DNS verification can be used without the optional HTML tokens.
The project does not claim that either property has already been verified.

## Catalog and editorial publication

`catalog-products.md` contains 141 source rows: 132 labeled “Descripción comercial”,
7 “Excluir”, and 2 “Continuidad pendiente”. These are source/editorial statuses, not
verified availability or approval to sell. Several linked rule documents referenced
by that file (`catalog.md`, its source README and the workbook) are not present in
this directory. They cannot be treated as an implemented nutrition rules engine.

No raw catalog rows are imported into public routes, structured data, feeds or
recommendations. In particular, source values such as “alimentación completa y
balanceada”, breed-specific goals, doses, “supervisión: no”, and disease-related
notes are not automatically accepted as safe, substantiated public claims.

Before publishing a product:

1. Confirm a live SKU/variant, official name, category, nutritional role and species/life-stage suitability with the responsible product and qualified nutrition reviewers.
2. Obtain current ingredients, analysis, presentation, reviewed use/storage/safety information, image approval, CRC price and actual stock/fulfillment data.
3. Record the responsible approver and real review date. “Descripción comercial” alone is not a verified status.
4. Implement one canonical `/producto/{slug}` page with those visible facts and crawlable links from a real family page. Preserve one public identity across personalized experiences.
5. Pass the verified record to `productData()` and `JsonLd`; the schema helper is a publication guard, not a scientific validator or a catalog integration. The page must independently enforce its publication status and use the same data source as its offer and feed.
6. Add only approved live URLs to the public-page registry or extend sitemap generation with a verified-live product query. Add genuine editorial modification dates only when available.
7. Validate deployed schema in Google's Rich Results Test and verify price/stock parity with checkout and any merchant feed.

For a clinical/scientific article, obtain identifiable author/reviewer credentials,
primary sources and editions, actual publication/review dates, scope and limitations.
Show the evidence box described in the strategy and add Article data only when those
facts are present on the page. The policy page is not a substitute for expert review.

No arbitrary category pages, cat-suitability claims, medical guides, local storefronts,
delivery zones or policy pages have been created from unverified source rows.

## Verification commands

```bash
npm run lint
npm run typecheck
npm test
npm run test:seo:preview
```

Run the production and preview browser suites sequentially; both own port 3100 and
rebuild the application. The primary Playwright config explicitly enables production
indexing for tests. The preview config deliberately sets the launch flag to true
while supplying preview deployment context, proving the preview guard wins.

`npm run test:seo` runs just the production SEO/policy checks. Tests cover all four
implemented public URLs, query-independent canonicals, language, titles/descriptions,
OG/Twitter data, accessible HTML without JavaScript, sitemap membership, private-path
headers, breadcrumb/brand schema, social image responses, training policy separation,
JSON-LD script escaping and the product publication gate. Browser/visual tests were
updated for the actual DNAture content instead of the Next.js starter screen.

Reports: `playwright-report/` (production) and `playwright-report/preview/` (preview).
Baseline PNGs remain under `tests/regression/__screenshots__/`. CI runs both suites
and uploads their reports and failure artifacts.

## Work that needs real operations, evidence or connected accounts

| Dependency | Next action |
| --- | --- |
| Search Console and Bing account/property | Verify ownership; submit the deployed sitemap; inspect canonical/indexing status and assign an owner |
| Qualified product/regulatory approval | Resolve SKU roles, label data, species/age, safety, claims and exclusions before PDP/category publication |
| Named professional reviewers and actual source material | Approve the complete-versus-complementary guide, label guide and other science articles |
| Fulfillment, support, legal and return terms | Supply current business/contact information, delivery zones, storage handling and approved policies before publishing the respective pages |
| GA4, consent and measurement ownership | Agree on consent and attribution, then wire real ecommerce events to actual actions; no analytics tracker is injected from a pre-existing ID alone |
| Merchant Center inventory readiness | Confirm channel eligibility and publish a feed only when live inventory/pricing/fulfillment are authoritative |
| Field performance | Measure real LCP/INP/CLS after launch; optimize against P75 field data, not invented scores |
| GEO monitoring | Record a fixed monthly prompt sample and cited URLs, accuracy, date/settings and identifiable referrals; do not imply guaranteed AI placement |

The foundation uses ordinary discoverability and factual structured data. No special
AI schema or `llms.txt` file is required for Google's AI features. [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features)
Organization data remains limited to documented facts. [Google organization guidance](https://developers.google.com/search/docs/appearance/structured-data/organization)
