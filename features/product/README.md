# Product detail

Public pages live at `/producto/<Contentful urlSlug>`. Published products without
an editorial slug use their SKU. Catalog previews, category lists, related products,
and the landing-page selection link to the same canonical path.

The page uses the catalog's joined Contentful/Avify snapshot (30-second inventory
revalidation; 5-minute editorial revalidation). One React request cache shares the
lookup between metadata and rendered content. Published copy and ingredient data
come from Contentful; prices, active presentations, and stock come from Avify.
The legacy Contentful prices, availability, and ratings are not used.

The gallery and presentation selector contain the product interactions.
The main content, ingredients, default price, presentation list, breadcrumbs, and
inquiry link render on the server. Product text, metadata, breadcrumbs, and links are present in the server HTML. Ordinary browsers use a streamed loading shell; with
JavaScript disabled that shell offers contact/catalog links instead of an
indefinite skeleton. Gallery image links and a presentation note also provide
fallbacks when the complete response is rendered. WhatsApp inquiries include the selected
presentation SKU and canonical page URL; no checkout or order confirmation is
simulated. Final availability and delivery are coordinated with the team.

Nutrition rows in the existing `@` / underscore CMS format render as tables.
Other published copy renders as escaped text. Missing species eligibility,
nutritional adequacy, feeding directions, or storage facts are not inferred from
categories or illustrations. Source content still needs the normal editorial
review before new medical or nutritional claims are approved.

The local `docs/SEO-GEO/catalog-products.md` source now supplies a clearly labeled
reference profile: product type, species, life stages, sizes, chewing level, and
selection cautions. Price stays immediately below the title; reference facts and
native presentation controls precede the visible cautions and inquiry action.
Jump links lead to ingredients, the published description, and use/care guidance.
The profile and cautions are Server Components passed into the small interactive
selector as rendered slots; the full source dataset never enters its client bundle.

`features/catalog/data/product-reference-bindings.json` links 87 inspected parent
SKUs to exact source rows/names. No runtime title similarity is used. The generated
reference retains all 141 source rows and the document/workbook hashes, but omits
doses, frequency, health-benefit and breed claims, private comments, and source
notes (only the explicit incomplete-diet qualification is retained). A source
`No` for supervision or `Baja` for choking never becomes a safety
assurance. A missing allergy field never means allergen-free. The profile is
descriptive reference information, not an individual suitability determination.

Excluded and continuity-pending bound records are removed in the shared catalog
join, including direct product lookups, recommendations, and sitemap. The current
bindings hide Ajo y Perejil and Callostrum; Zinc and Hierro retain their CMS/commerce
pages without invented reference facts. The read-only inspection on 2026-11-11
found 93 published CMS entries, 207 selectable commerce records, and 89 joined
products before applying these two restrictions (87 after, 85 with profiles).

After replacing the source document, run `npm run catalog:generate`, review the
generated diff and SKU bindings, then `npm run catalog:check`. The production build
checks for stale reference data. New products need an explicit inspected binding;
an editorial label never approves Product/Offer schema or clinical claims.

Metadata includes a canonical, product title, neutral description, and actual
product social image. The sitemap includes joined published product URLs in
indexable environments, with no synthetic revision dates. Missing products use
Next's not-found/noindex handling; integration failures show a retry state and
noindex metadata. BreadcrumbList and WebPage structured data are emitted;
Product/Offer rich-result markup stays behind the existing verified-record gate
in `lib/seo/structured-data.ts` until the required reviewed facts are available.

Validation: `features/product/tests/server` covers offers, source-copy parsing,
paths, missing data, and related membership; `features/product/tests/e2e` covers
gallery interaction, selection/inquiries, metadata, missing products, and HTML
in the server response.
