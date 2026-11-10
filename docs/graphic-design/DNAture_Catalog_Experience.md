# DNAture — Catalog experience

**Decision date:** 2026-11-10  
**Live source snapshot:** 2026-11-10 19:03:43 UTC / 13:03:43 Costa Rica  
**Scope:** `/productos`, category entry points, filtering, search, and catalog navigation  
**Design authority:** [DNAture Design System](DNAture_Design_System.md) and [project rules](../../AGENTS.md)

This document separates the observed catalog from the new experience requirements. Inventory and timing figures are a single audit snapshot, not a guarantee of current availability or a production performance benchmark. The tables are reference documentation; they must not become a runtime catalog, price list, or stock cache.

## 1. What the actual catalog needs

The public catalog is the intersection of selectable Avify parent products and published Contentful `product` entries, joined by exact `avifySku`. The audit read product data only. It found 207 selectable commerce parents, 93 published editorial entries, and **89 matching public products**. Each matching product belongs to exactly one current commerce category.

| Category | Published products | Available at audit | With ingredient text |
|---|---:|---:|---:|
| Complementos | 20 | 20 | 20 |
| Deshidratados | 27 | 23 | 26 |
| Órganos | 9 | 9 | 9 |
| Recetas completas | 13 | 12 | 13 |
| Suplementos | 20 | 20 | 7 |
| **Total** | **89** | **84** | **75** |

All 89 products have a usable image and commerce price. Descriptions exist for 86. Twenty products have a total of 53 child variants. Presentations include `200g`, `500g`, `1k`, liquid volumes, and small/medium/large sizes. A product remains one result regardless of its variant count.

The five-product-per-category presentation initially exposed only 25 of these 89 products, and the same limit constrained search results. The catalog needs a complete, predictable collection that customers can narrow directly.

| Catalog pattern | Consequence for the experience |
|---|---|
| Complementos spans whole items, meat cuts, raw products, and cooked preparations. | Keep specific product names visible and make all names searchable; category alone is not enough. |
| Deshidratados is the largest category, with 27 products and several ingredient names shared with other categories. | Search and category filters must work together; retain preparation words such as “deshidratado”. |
| Órganos contains nine products: three organs across cordero, res, and ternero. | Multiword search such as “higado cordero” is useful, including without accents. |
| Recetas completas has 13 products, all with ingredient text and variant presentations. | Ingredient search and nearby presentation details help distinguish similar recipe names. |
| Suplementos has 20 products, but only seven have ingredient text. | Name search must remain effective; absent ingredient text is unknown, not evidence of absence. |
| Related raw and dehydrated products are distinct records. | Never merge products because their ingredient or normalized name overlaps. |
| Prices span different weights, volumes, and sizes. | Preserve “Desde” for variant products; price sorting is not a unit-price comparison. |

## 2. Ecommerce research and the adaptation

The references below informed the design. Their visual treatment and catalog scale are not a template to copy wholesale.

| Reference | Observed pattern or published guidance | DNAture adaptation |
|---|---|---|
| [Chewy: food collection](https://www.chewy.com/b/food-332) | Product collections use category and attribute refinement alongside product results. | Keep a clear filter area beside one collection; expose only attributes supported by DNAture data. |
| [IKEA: sofas and sectionals](https://www.ikea.com/us/en/cat/sofas-sectionals-fu003/) | Collection browsing combines products, filtering, and sorting. | Keep results, their count, and sorting together rather than splitting matching products into short shelves. |
| [Baymard: ecommerce filter UI](https://baymard.com/blog/ecommerce-filter-ui) | Filter design needs to support shoppers narrowing and comparing a product collection. | Use familiar labeled controls, multiple category selection, and visible result feedback. |
| [Baymard: applied filters](https://baymard.com/research-articles/how-to-design-applied-filters) | Applied filters need an understandable overview and removal controls. | The project now keeps selection in the labeled checkboxes and search field. Separate active-filter chips and clear-all controls were removed at the owner’s request. |
| [Baymard: product-finding research](https://baymard.com/research-articles/product-finding-2024-launch) | Product finding spans navigation, lists, filtering, and search as one connected task. | Treat search, filters, results, and browser history as one coherent interaction. |
| [Google: pagination and incremental loading](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading) | Search discovery needs crawlable navigation; crawlers do not operate interactive controls like customers. | Keep real category links and server-visible product content. At 89 products, a full collection avoids unnecessary pagination complexity. Reassess if the catalog grows substantially. |

**Our design decision:** keep the complete modest catalog searchable locally, use an open product collection, and preserve URL state. This is an adaptation to the audited inventory and DNAture's flat visual language, not a claim that the reference stores use the same technical architecture.

### Unsplash gallery adaptation — 2026-11-10

Inspection of the public HTML and inline CSS at [Unsplash’s Spanish homepage](https://unsplash.com/es) showed equal-width column containers, 24px horizontal/vertical gutters, and images with source width/height attributes. Its responsive image sizing describes one column below 768px, two below 992px, and three on desktop, capped at 416px per image. Later images use native lazy loading. The live browser preview service was unavailable; these observations come from the returned page source and styles.

For DNAture, keep the photo-led staggered composition while preserving visible product names, category labels, neutral prices, availability, and native ingredient/presentation disclosures. The audited 89-product snapshot contains 68 exactly square images and 21 non-square images (some only differ by one pixel). Preserve those proportions rather than inventing tall crops or cutting off packaging.

The implementation uses one semantic list, with one column below 640px, two from 640px, and three from 1280px. The catalog’s desktop filter column accounts for the later three-column breakpoint. Horizontal gutters use the shared 24px token; a 48px vertical gap separates each product’s information from the next image. A small ResizeObserver enhancement measures article heights into CSS Grid row spans. Sparse placement keeps DOM, keyboard, and top-to-bottom visual order aligned, including after sorting. It reflows when disclosures, fonts, and viewport sizes change. Without the observer, an ordinary responsive grid remains usable. No gallery dependency, duplicated responsive lists, image cropping, or new network request is needed for filtering.

## 3. Layout and information hierarchy

The existing shared interior hero, breadcrumbs, typography, and alignment remain the entry to the page. Below it:

1. **Compact search strip.** A visible search label, wide search field, and clear action. This strip becomes sticky immediately below the main header without covering focus or consuming most of a phone screen.
2. **Filters and results.** Desktop uses a narrow aligned filter column and a wider product collection. Mobile uses an inline filter disclosure, sorting, and a single-column image-led gallery. Result totals are announced to assistive technology without a visible count below the heading.
3. **One complete collection.** Every matching parent product is available in the results. Category selection changes the collection; it does not require a trip through a five-item shelf.
4. **Product details in place.** Keep image, name, visible category, price, and availability together. Native disclosures reveal ingredients and available presentation information without inventing a separate destination or duplicating product entries.

Products share one cool page surface. Desktop entries form a staggered gallery with natural image proportions; narrow screens use full-width images followed by their product information. No product cards, per-item tinted boxes, rounded borders, elevation, or hover scaling. Category colors identify their category through restrained text and rules; prices use the normal primary text color. Reuse the shared spacing scale and accessible category ink colors.

## 4. Search and filtering contract

### Live search

- Update results on every keystroke without requiring Enter. Enter remains a valid native search-form action with GET URL semantics. The streamed catalog currently requires JavaScript; the loading boundary gives visitors with scripting disabled an explicit support link instead of an indefinite loading message.
- Search published names, commerce names, ingredients, parent SKUs, and variant names/SKUs. Keep these fields in a compact browser payload; do not send full editorial records or commerce administration data.
- Normalize case and accents. Multiword search does not require one contiguous phrase: “higado cordero” can match “Hígado de cordero”. All meaningful terms must match rather than broadening an unsuccessful query silently.
- Rank useful exact/name matches ahead of secondary ingredient matches under relevance ordering. The display remains deterministic when scores tie.
- Preserve input focus and the user's in-progress text. Avoid heavy result animations, focus jumps, or a server request per keystroke.
- Announce an accurate result count and display an understandable empty state. Keep the entered query and selected checkboxes visible, with search clearing and empty-state recovery. Do not restore the removed share button, active-filter row, or visible total below the results heading.
- Search is discovery, not a declaration of dietary suitability. A mention of an ingredient does not establish its proportion, exclusivity, absence of allergens, or suitability for an animal.

### Filters and sorting

| Control | Required behavior |
|---|---|
| Categories | Multiple categories use OR: a product may match any selected category. No selection means all categories. Keep names visible alongside counts. |
| Availability | A clear “Solo disponibles” option uses commerce-derived availability. Combine it with search/category filters using AND. |
| Sort | Offer relevance, name A–Z, price ascending, and price descending. Preserve the chosen sort in the URL. |
| Applied filters | Use the checked category/availability controls and search input as the selection display. Unchecking one preserves the others. No separate active-filter chips or clear-all row. |
| Result count | Announce matching parent products once in the live region; retain facet counts and the mobile “Ver productos” action. No visible total below the results heading. |
| Ingredients/options | Use native disclosures. Show available source text; do not fill missing data with inferred statements. |

No pet-species, age, health-condition, protein-exclusion, or “allergy-safe” filter is warranted by the current structured model. Add those only after explicit fields are defined, reviewed, and populated.

### URL and history

Use readable category slugs as repeated filter values, for example:

```text
/productos?q=pollo&categoria=complementos&categoria=deshidratados&disponible=1&orden=price-asc
```

The query string represents the selected search, categories, availability, and sort. Category IDs remain an internal source identity; display names must not depend on opaque identifiers. Preserve compatible existing category entry points and links.

Use the native History API integrated with Next.js so a filter change does not reload the page or refetch the catalog. The first keystroke starts a search-session history entry; subsequent typing replaces that entry rather than creating one Back step per character. Discrete filter actions create history entries. Back/Forward restores controls and results together, and a copied URL opens the same selection. Links remain real links and forms retain native GET semantics. Keyboard users retain focus during updates. The existing Next.js streamed boundary requires JavaScript to reveal the catalog; do not claim full browsing without scripting.

Do not scroll back to the hero after changing a filter. Keep the compact controls and the beginning of the updated collection reachable, including when the visitor filters after browsing far down the page.

## 5. Loading strategy and performance evidence

The audit measured the following single cold read through the existing configured integrations:

| Read or payload | Observed audit value |
|---|---:|
| Full Avify selectable catalog, three pages | 1,586ms |
| Published Contentful product collection | 218ms |
| Existing compact 89-product browser payload | 30,427 bytes JSON / 8,327 bytes gzip |
| Joined editorial + commerce records | 186,860 bytes JSON / 33,153 bytes gzip |

The original payload measurements above describe the previous implementation. The implemented search payload, including ingredients, active presentations, and normalized search fields, measures **58,031 bytes JSON / 13,280 bytes gzip** for the same 89-product snapshot. The integration timings are neither page-load timings nor latency guarantees.

The new delivery requirements are:

- Load the browse snapshot on the server with the existing short-lived Avify and Contentful caches and source validation. Keep explicit loading and retryable error states.
- Remove sales-history reporting from the critical catalog path. It is unnecessary for browsing or relevance and currently introduces a separate sequence of order-page reads, request gaps, and rate-limit retries.
- Keep the existing Avify pagination and freshness behavior unless separate evidence justifies changing them. The observed 1.6-second cold source scan is a remaining dependency, not a performance gain achieved by the UI redesign.
- Send the compact fields needed for the public collection and local search once. Filter, sort, and search without additional catalog network requests.
- Reserve image dimensions/aspect ratios to prevent layout shifts. Use responsive optimized images and lazy loading; rendering the complete product list must not eagerly download every original image.
- Keep the implementation dependency-light. This catalog does not currently require a search provider, database mirror, infinite scrolling, pagination, or virtualization.
- Continue checking purchase-time prices and stock independently. A browse snapshot is not an inventory reservation.

## 6. Editorial and data work still needed

### Four published entries are outside the public join

| Published Contentful product | Audit finding |
|---|---|
| Uña de gato | Its `avifySku` is absent from the selectable Avify parent response. |
| Taurina | Its `avifySku` is absent from the selectable Avify parent response. |
| Moringa | Its `avifySku` is absent from the selectable Avify parent response. |
| Testículos de Toro en trozos | No `avifySku` is set. |

Their absence is a source-join finding, not a determination that they should be published or are in stock. Review the editorial-to-commerce mappings before exposing them.

### Fields and authority

- **Categories:** Avify supplies the five current categories. Contentful still contains older `Proteínas` and `Snacks` labels. Do not let those legacy fields create a second filter taxonomy.
- **Prices and stock:** Avify is authoritative. Contentful includes historical price/presentation objects and availability flags that can disagree with commerce.
- **Species:** The current product model has no structured suitability field. Existing animal icons describe ingredient sources such as pollo, res, trucha, and caballo. They are not dog/cat eligibility markers.
- **Ingredients:** Fourteen products lack ingredient text. Thirteen are in Suplementos; the remaining product is Galleta wild. These products remain findable by name and SKU.
- **Product descriptions:** Existing copy includes free-form formatting and claims. Searchable text must not silently become new product advice, filters, certifications, or nutritional claims.
- **Presentations:** Child variant names are structured commerce data. Keep them associated with their parent. Do not infer a standard unit price from unrelated weights/volumes or old editorial prices.

## 7. Acceptance criteria

Verification on 2026-11-10 used the live 89-product catalog at 1440, 390, and 320px. Forty-five targeted interaction checks passed, including rapid typing, combined filters, sorting, Back/Forward, keyboard disclosures, deep scrolling, and empty-state recovery. Filter interactions issued no document or RSC requests and produced no runtime errors. Direct URL loading restored a nine-product query and all controls in both server-rendered markup and the hydrated interface. At 200% text size, controls wrapped without page overflow at all three widths. JavaScript-disabled visitors receive explicit guidance and a support link; the streamed interactive catalog itself requires scripting.

The gallery revision was checked in Chromium against the live catalog at 1440, 1024, 768, 390, and 320px. Original image proportions, lazy loading, reading order, and non-overlapping entries passed, including keyboard-expanded details. Live search, combined filters, price sorting, Back/Forward, direct shared URLs, and mobile filter controls passed without document/RSC requests during filtering or runtime errors. The category gallery and 200% text checks also passed; the narrow-screen sort control was corrected to stay within its container. All 30 catalog service/model tests, targeted lint, TypeScript, and the production build passed.

Keep the following acceptance checks for future changes:

- The full 89-product audit fixture is reachable, including products beyond each category's former first five.
- Accented and unaccented multiword searches, ingredient searches, and parent/variant SKU searches find the expected products on input.
- Multiple categories, availability, and sort combine correctly; counts reflect the full matching collection.
- Clearing a query, one category, or all filters produces predictable results and preserves focus where appropriate.
- Filter/search interactions issue no document or catalog refetch requests after the initial snapshot loads.
- Copying a filtered URL, opening it directly, using Back/Forward, and submitting the native form reproduce usable state.
- At narrow phone widths and enlarged text, controls wrap without page overflow, touch targets remain usable, and sticky search does not cover focused controls or results.
- Keyboard focus, native disclosures, accessible labels, and result announcements work without relying on category color.
- Images retain reserved space and load responsively; the complete catalog does not depend on eagerly loading all images.
- Source outages retain a clear error and retry path. Tests distinguish upstream failures from UI regressions.

## 8. Audited product inventory

Names below reproduce the published display names, with surrounding whitespace removed. “Available” refers only to the audit snapshot. “Single listing” means no commerce child variants were returned; it does not assert a package size. Variant labels reproduce commerce data and may need editorial normalization independently.

<details>
<summary>Complementos — 20 products</summary>

| Published name | Commerce presentations | Available at audit |
|---|---|---|
| Alas de pollo | 1k, 500g | Yes |
| Cabezas de trucha | Single listing | Yes |
| Carne de caballo cruda en trocitos | Single listing | Yes |
| Carne de res cocinada | Single listing | Yes |
| Carne de res cruda triturada | Single listing | Yes |
| Carne de Res y Caballo | Single listing | Yes |
| Codorniz entera | Single listing | Yes |
| Corazón de cordero | Single listing | Yes |
| Corazón de Res | Single listing | Yes |
| Corazón de ternero | Single listing | Yes |
| Costillas de cordero | Single listing | Yes |
| Dieta blanda de caballo con verduras | Single listing | Yes |
| Dieta blanda de caballo sin verduras | Single listing | Yes |
| Huesos recreativos | Single listing | Yes |
| Lengua de Cordero | Single listing | Yes |
| Patas de conejo crudas | Single listing | Yes |
| Patas de Pollo | Single listing | Yes |
| Pechuga de Pollo | 1k, 500g | Yes |
| Sardinas | Single listing | Yes |
| Testículos de Toro | Single listing | Yes |

</details>

<details>
<summary>Deshidratados — 27 products</summary>

| Published name | Commerce presentations | Available at audit |
|---|---|---|
| Bazo deshidratado | Single listing | Yes |
| Bully Sticks | Single listing | Yes |
| Cabezas de trucha deshidratadas | Single listing | Yes |
| Caja de Treats Mixtos | Single listing | Yes |
| Codorniz deshidratada | Single listing | Yes |
| Corazón deshidratado | Single listing | No |
| Cuellos de pollo deshidratados | Single listing | Yes |
| Cuerno de Res deshidratado | grande, mediano, pequeño | Yes |
| Espadines deshidratados | Single listing | No |
| Esqueletos de trucha deshidratados | Single listing | Yes |
| Galleta wild | Single listing | No |
| Hígado deshidratado | Single listing | No |
| Mejillones deshidratados | Single listing | Yes |
| Mixtos deshidratados (grande) | Single listing | Yes |
| Oreja de Res con pelo deshidratadas | grande, mediano, pequeño | Yes |
| Oreja de res sin pelo deshidratada | grande, mediano, pequeño | Yes |
| Orejas de cordero deshidratadas | Single listing | Yes |
| Patas de Conejo deshidratadas | Single listing | Yes |
| Patas de cordero deshidratadas | Single listing | Yes |
| Patas de pollo deshidratadas | Single listing | Yes |
| Pulmón de res deshidratado | Single listing | Yes |
| Sardinas deshidratadas | Single listing | Yes |
| Tendones de Caballo deshidratados | Single listing | Yes |
| Testículos de Toro deshidratados | Single listing | Yes |
| Trenza Bully Sticks | Single listing | Yes |
| Tráqueas de cordero deshidratadas | Single listing | Yes |
| Tráqueas de res deshidratadas | Single listing | Yes |

</details>

<details>
<summary>Órganos — 9 products</summary>

| Published name | Commerce presentations | Available at audit |
|---|---|---|
| Bazo de Cordero | Single listing | Yes |
| Bazo de Res | Single listing | Yes |
| Bazo de Ternero | Single listing | Yes |
| Hígado de cordero | Single listing | Yes |
| Hígado de res | Single listing | Yes |
| Hígado de ternero | Single listing | Yes |
| Riñón de cordero | Single listing | Yes |
| Riñón de res | Single listing | Yes |
| Riñón de Ternero | Single listing | Yes |

</details>

<details>
<summary>Recetas completas — 13 products</summary>

| Published name | Commerce presentations | Available at audit |
|---|---|---|
| DNA WILD ANCESTOR | 1k, 500g | Yes |
| DNA WILD SPIRIT | 1k, 500g | Yes |
| DNAture para gato | 200g, 500g | Yes |
| DNAture Pollo | 1k, 200g, 500g | Yes |
| DNAture Pollo y Búfalo | 1k, 200g, 500g | No |
| DNAture Pollo y Caballo | 1k, 200g, 500g | Yes |
| DNAture Pollo y Cordero | 1k, 200g, 500g | Yes |
| DNAture Pollo y Res | 1k, 200g, 500g | Yes |
| DNAture Pollo y Ternero | 1k, 200g, 500g | Yes |
| DNAture Trucha y Búfalo | 1k, 200g, 500g | Yes |
| DNAture Trucha y Caballo | 1k, 200g, 500g | Yes |
| DNAture Trucha y Pollo | 1k, 200g, 500g | Yes |
| DNAture Trucha y Res | 1k, 200g, 500g | Yes |

</details>

<details>
<summary>Suplementos — 20 products</summary>

| Published name | Commerce presentations | Available at audit |
|---|---|---|
| Ajo y Perejil | Single listing | Yes |
| Caldo de Hueso | 1L, 500ml | Yes |
| Callostrum | Single listing | Yes |
| Chucrut | Single listing | Yes |
| Colágeno | Single listing | Yes |
| Hemp seeds (semillas de cáñamo) | Single listing | Yes |
| Hierro | Single listing | Yes |
| Huevos de codorniz | Single listing | Yes |
| Kefir | 200ml, 500ml | Yes |
| Levadura de cerveza | Single listing | Yes |
| Levadura nutricional | Single listing | Yes |
| Mejillón de labio verde | Single listing | Yes |
| Polen de abeja | Single listing | Yes |
| Potasio | Single listing | Yes |
| Rosehip powder | Single listing | Yes |
| Suplemento Senior DNA | Single listing | Yes |
| Tripa Verde | Single listing | Yes |
| Vinagre de manzana | Single listing | Yes |
| Vitamina E | Single listing | Yes |
| Zinc | Single listing | Yes |

</details>

