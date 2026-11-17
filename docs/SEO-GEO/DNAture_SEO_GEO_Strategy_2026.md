# DNAture — SEO + GEO Strategy & Execution Playbook

**Version:** 1.0  
**Prepared:** 5 November 2026  
**Market hypothesis:** Costa Rica first; expand only where products, fulfillment and support are verified  
**Primary website language:** Spanish (`es-CR`)  
**Brand foundation:** `BRANDBOOK 2.pdf` (79 pages)  
**UX foundation:** DNAture Flat Editorial Design System v0.2; three experiences within one website  
**Scope:** New-site strategy and implementation specification — **not** a live-site audit, keyword-volume study, legal opinion, or certification of any product claims.

> **Evidence labels used throughout:** **[BRAND]** = documented in DNAture's brand book, with page references. **[OFFICIAL]** = search platform or industry guidance linked in the sources. **[PROPOSAL]** = a strategic or creative recommendation for DNAture. **[VERIFY]** = fact, claim, customer demand, capability, or product attribute that must be checked before publication. An example URL, keyword, metadata field or schema value is not automatically a verified fact.

---

## 0. Executive decision

**Build DNAture as a searchable, evidence-led pet-nutrition knowledge and commerce platform — not just a catalog.** Public pages should answer a real question, explain the distinction between nutritional roles, and make a verified product easy to evaluate or buy. Returning customers should find their prior products faster, without changing what search engines can index.

### Five strategic pillars

1. **Own the meaningful distinction: _alimentar_ vs. _nutrir_.** Translate the brand's scientific positioning into clear, specific public explanations, rather than vague superiority claims. [BRAND pp. 4, 11–17, 20–21]
2. **Make the product taxonomy unambiguous.** Lead shoppers and search engines through *Recetas Complete*, *Recetas de Trucha*, *Recetas Cocidas*, *Recetas Wild*, *Complementos Nutricionales*, *Complementos de Masticación*, *Masticables*, *Treats*, and *Suplementos* — **without pretending these categories are nutritionally interchangeable**. [BRAND pp. 14, 33–35]
3. **Create original, accountable expertise.** Build a DNAture Science / Educación hub with named qualified reviewers, product-specific evidence, accurate limitations and update dates. Do not manufacture scientific endorsement. [BRAND pp. 3–6, 10–17; OFFICIAL: Google people-first guidance and FEDIAF]
4. **Engineer discovery from the start.** Crawlable product and category URLs, correct canonicalization, real HTML content, usable internal links, robust product structured data, strong performance, merchant data and accessible, indexable educational pages. [OFFICIAL: Google Search Central]
5. **Earn visibility across search and AI discovery.** Treat GEO — **Generative Engine Optimization** — as discoverability and factual reliability across AI answers, not a shortcut. Measure Google AI features with Search Console's 2026 dedicated reports; monitor ChatGPT citations via a repeatable manual sample. [OFFICIAL: Google 2026 AI guidance; OpenAI crawler documentation]

**Recommended positioning for search:** _DNAture: nutrición fisiológica informada por evidencia y adaptada a las necesidades de cada animal._ **[PROPOSAL]** This is a positioning sentence, **not** a validated product efficacy, medical or individualized-treatment claim. Retain the official tagline: **“Nutrición con esencia en el ADN.”** [BRAND pp. 20–21]

### Definitions — two meanings of GEO

- **GEO-AI (primary meaning here): Generative Engine Optimization.** Improve the likelihood that AI-assisted search systems can discover, understand and accurately reference DNAture. There is **no guaranteed AI citation or ranking method**.
- **Geo-local (also covered): geographic/local SEO.** Make store identity, geographic service areas, delivery options, business profiles, and real stockists findable in Costa Rica.

**What this document deliberately does not assume:** a live domain, existing analytics, organic traffic, exact SKUs, prices, clinical substantiation, stockists, physical storefronts, shipping geography, food-safety registrations, verified customer reviews, or published nutritional analyses. Those are implementation dependencies, not facts established by the brand book.

---

## 1. What the brand book supports — and what it does not

| Brand-book evidence | Search/experience implication | Guardrail |
|---|---|---|
| Manifesto: respect each animal's biology; educate and accompany guardians [pp. 4–6] | Center information architecture on species, nutritional function and knowledge, not only SKUs | Avoid implying the site can diagnose or prescribe diets |
| Voice: scientific, expert, warm, empathetic, responsible, educational, transparent [pp. 10–13] | Helpful explanations, human bylines, references, gentle microcopy | No intimidating jargon, unreviewed disease advice or sensational medical promises |
| Authorized words: *Suplementos, Recetas complete, Recetas de trucha, Recetas cocidas, Complementos nutricionales, Complementos de masticación, Recetas wild, Masticables, Treats* [p. 14] | Use approved taxonomy in headings, breadcrumbs, product navigation and filters | Do not let high-volume generic queries replace official category names |
| Disallowed brand wording includes *BARF, huesos carnosos, presas completas* and *snacks* in functional-product contexts [p. 14] | Favor *nutrición fisiológica*, approved product family labels and precise ingredient descriptions | Do not chase “BARF” as a core brand landing-page keyword without explicit brand approval |
| *Recetas Complete* described as a nutritional base; *Recetas de Trucha* and *Recetas Cocidas* are presented as non-Complete, specialist/functional recipes [p. 33] | Important pages explaining complete vs complementary use; distinctive product disclaimers | **Never** label a trout/cooked recipe “alimento completo” unless the specific formula has been reformulated and independently verified |
| Several categories and products are described for dogs; brand ambition includes dogs and cats [pp. 3–6, 33–35] | Separate informational content by species **when accurate** | Do not launch “alimento completo para gatos” pages if cat SKUs and suitability are unverified |
| Authentic, natural, documentary/editorial photography; engraved animal illustrations [pp. 36–37, 42–54] | Rich original visual evidence, image discovery and strong product photography | Avoid copying the brand book's layout mockups as if they were accurate live packaging photos |
| Science/education, transparent claims, community, expert assistance [pp. 11–17, 55–63] | “Ciencia”, author/reviewer details, technical FAQs, sourcing/traceability content | Evidence must exist and be attributable before scientific and regulatory claims are published |

### A critical content-policy rule

The brand book is a **brand direction**, not a scientific dossier or legal approval document. For each SKU, DNAture must separately confirm whether any claim such as **“completo,” “balanceado,” “hipoalergénico,” “terapéutico,” “previene,” “mejora la digestión,” “formulado conforme a FEDIAF,”** or **“validado científicamente”** is supportable by current formulation records, analyses, recognized standards, labeling and applicable Costa Rican rules. The fact that the brand book references FEDIAF does **not** prove certification or conformity of a specific SKU.

**Prioritize safety:** a licensed veterinarian or qualified veterinary nutrition professional should review material touching disease management, deficiencies, allergies, puppies/kittens, pregnancy, raw food hygiene and diet switching for medically vulnerable animals. Display clear boundaries between general education and individualized veterinary advice.

---

## 2. Goals, audiences and search journeys

### North-star business outcome

**Grow verified product discovery and qualified organic revenue while increasing trust and repeat purchasing.** Organic sessions and AI mentions are diagnostics, not the end goal.

| Journey | Search intent / user question | Public SEO destination | Conversion | Private experience |
|---|---|---|---|---|
| **01 · Discover** (first-time guardian) | “¿Qué es alimentación completa para perros?”, “¿cómo se diferencia un complemento?” | Evergreen guide → product-family page → product detail | First qualified purchase / request for advice | Optional pet profile after trust is established |
| **02 · Continue** (returning guardian) | Brand / product name, exact flavor, package size, availability | Stable product URL or customer sign-in | Reorder without hunting for the product | **Mi DNAture:** saved pets, prior purchases and reorder; private URLs not indexed |
| **03 · Verify** (veterinarian / informed guardian) | Nutritional composition, ingredients, use limitations, formulation method | Science hub → verified evidence / technical product information | Appropriate consultation, professional inquiry or informed purchase | Optional professional resources with access control if justified |
| **04 · Find nearby** (Costa Rica) | “DNAture en Costa Rica”, pickup/delivery and real stockists | Fulfillment page and real location pages | Purchase or verified physical-store visit | None required |

**Key SEO architecture rule:** personalization must not create a second, inconsistent public version of the same URL. Preserve one stable, crawlable public product and article URL, with a canonical URL. Personalization enriches the logged-in experience; it does not replace publicly available product information or show materially different facts to crawlers.

### Concrete KPIs — establish a baseline first

- **Commercial:** non-brand organic attributed purchases/revenue, organic product-view → add-to-cart → checkout → purchase conversion, repeat-purchase rate; compare by attribution method.
- **Discovery:** Google Search Console clicks/impressions/CTR by branded, non-branded, category, guide and SKU query; indexable URLs actually indexed; priority URL coverage.
- **GEO-AI:** impressions, page exposure and country/device patterns in Search Console **Generative AI performance**; separately sampled ChatGPT answer citations/accuracy; AI-referral traffic where referrers are identifiable.
- **Trust:** qualified article review rate, percentage of SKU pages with verified suitability, source links, formulation status and reviewed feeding/safety information; product-support inquiries caused by confusion.
- **Experience:** P75 Core Web Vitals (LCP ≤ 2.5 s; INP ≤ 200 ms; CLS ≤ 0.1), mobile conversion, time-to-reorder, search → product click-through.

Do **not** publish arbitrary “+100% traffic in 90 days” promises. Set numeric growth targets after establishing baseline and available inventory, competition and resources.

---

## 3. Search demand strategy — keyword map, not keyword stuffing

**[PROPOSAL]** These are search-intent hypotheses for a Spanish-speaking Costa Rican market, **not measured search volumes or confirmed rankings**. Validate against Search Console, Google Trends (Costa Rica), Keyword Planner, site-search logs, customer-support tickets, retailer questions and actual SERPs. Cluster by **search intent** and make **one genuinely useful destination for each main intent**; avoid many thin query-variant pages.

### 3.1 Initial keyword / intent clusters

| Priority hypothesis | Intent cluster | Example customer-language queries (Spanish) | Primary destination | Brand alignment / caveat |
|---|---|---|---|---|
| P0 | Brand navigation | `DNAture`, `DNAture Costa Rica`, `DNAture productos` | Home + About + catalog | Defend exact brand results; keep canonical naming |
| P0 | Buy exact product | `DNAture pollo`, `[nombre SKU] DNAture`, `[SKU] precio` | Verified PDP | Exact SKU name, size, stock, price, delivery; no made-up offerings |
| P0 | Complete formulations | `alimento completo para perros`, `recetas completas para perros` | `/productos/recetas-complete/` + complete-vs-complementary guide | Nutritional completeness verified per item |
| P0 | Nutrition distinctions | `alimento completo vs complementario perros`, `qué es un complemento nutricional canino` | Educational pillar guide | Cornerstone differentiation; reviewer mandatory |
| P0 | Brand trust / science | `nutrición fisiológica perros`, `alimentación fisiológica mascotas` | Science hub + glossary | Explain term with references and limits, not slogans |
| P1 | Ingredients / proteins | `comida para perros con trucha`, `receta con caballo para perros` | Relevant verified category/PDP | Species, role and ingredients validated; no medical inference |
| P1 | Product form | `alimento crudo para perros`, `comida cocida para perros` | Format guide + relevant category | Explain hygiene, suitability, completeness and product handling |
| P1 | Function of extras | `complementos de masticación para perros`, `masticables para perros` | Category pages + educational guide | Keep *masticables* and *complementos* distinct where relevant |
| P1 | Functional treats | `treats para perros`, `premios para perros` | Treats category | Brand uses “treats”; common generic synonyms can appear naturally in explanatory prose if approved |
| P1 | Supplements | `suplementos nutricionales para perros`, `suplementos para mascotas` | Supplements category + cautionary guide | No health outcome claims or individualized dosages without review |
| P1 | Selection assistance | `cómo leer etiqueta alimento para perros`, `cómo elegir alimento para mi perro` | Guide / product-choice flow | Add actual labels and examples; no automated diagnosis |
| P1 | Delivery intent | `comida para perros a domicilio Costa Rica`, `entrega DNAture [zona]` | Shipping + checkout + real fulfillment page | Only if locations, delivery windows and cold-chain capabilities are real |
| P1 | Careful transitions | `cómo cambiar alimento de perro`, `transición alimentación perros` | Vet-reviewed guide | General advice with medical exceptions; no individualized recommendations |
| P2 | Research depth | `análisis garantizado alimento perros`, `FEDIAF alimentación perros`, `requerimientos nutricionales perros` | Science reference articles | Source current standards, do not claim any certificate not held |
| P2 | Professional demand | `ficha técnica DNAture`, `[SKU] composición nutricional` | Public factual technical page / PDF download | Technical fields must match verified batch/formula documents |
| Conditional | Feline nutrition | `alimentación completa gatos`, `complementos gatos` | Publish **only** where accurate products and professional expertise exist | Brand covers cats conceptually; validate actual feline inventory first |
| Conditional | Physical findability | `DNAture cerca de mí`, `dónde comprar DNAture [ciudad]` | Legitimate stockist or store location | Only publish verified stores and stocked points; no invented city pages |

**Page keyword rule:** 1 principal intent + several natural supporting questions. Title, H1, introduction, internal links and product data should use clear human language; exact-match repetition is not a quality signal.

### 3.2 Validation procedure (before freezing navigation)

1. Export customer service questions and existing search/site-search terms, if available.
2. Review Costa Rica-specific SERPs on mobile for **commercial vs explanatory** results; log whether Google shows maps, product results, AI Overviews, video or traditional listings.
3. Add tools' estimated volume/difficulty/CPC only with source, date, country and known uncertainty; do not mix vendors' estimates as exact facts.
4. Score intent opportunities using the formula below, then select **8–12 priority public pages** rather than publishing 100 thin pages.
5. Audit competitors for unexplained gaps and questions; do not imitate their unsubstantiated nutrition claims.
6. Revisit every 60–90 days based on GSC data and actual customer behavior.

**Suggested score (0–5 each):** `Priority = (BusinessFit × 0.30) + (IntentMatch × 0.25) + (EvidenceReadiness × 0.20) + (OrganicOpportunity × 0.15) + (ProductionEase × 0.10)`. **EvidenceReadiness below 3/5 blocks clinical or efficacy content regardless of search demand.**

---

## 4. Recommended indexable information architecture

All URL paths below are **proposed slugs**, not claims about an existing site. Keep URLs short, descriptive and stable; one primary public page per category/product.

```text
/                                  Homepage — brand + first discovery
/productos/                        All verified products / shopping index
/productos/recetas-complete/        Main category (if verified products available)
/productos/recetas-de-trucha/      Specialist/complementary category
/productos/recetas-cocidas/        Specialist/cooked category
/productos/recetas-wild/           Wild category
/productos/complementos-nutricionales/
/productos/complementos-de-masticacion/
/productos/masticables/
/productos/treats/
/productos/suplementos/
/producto/{sku-slug}/               Canonical product detail (real SKU only)
/ciencia/                           Science & evidence hub
/ciencia/que-es-nutricion-fisiologica/
/ciencia/alimento-completo-vs-complementario/
/ciencia/como-leer-una-etiqueta/
/ciencia/nuestros-criterios/       Methodology, limitations, reviewed references
/guias/                             Educational guide index
/guias/{tema}/                      Reviewed evergreen practical articles
/glosario/                          Searchable, maintained definitions
/nosotros/                          Real company, team, mission and story
/contacto/                          Contact/support and business details
/preguntas-frecuentes/              Helpful on-site FAQs (not an FAQ rich-result tactic)
/envios-y-entregas/                 Actual geographic delivery and handling terms
/devoluciones/                      Verified return and cancellation policy
/privacidad/
/terminos/
/donde-comprar/                     Only if there are real, verified stockists
/tiendas/{ubicacion-real}/          Only for genuine eligible locations
/profesionales/                     Public science/professional information if real
```

**Not indexable:** `/carrito/`, `/checkout/`, `/mi-dnature/`, `/mi-dnature/mascotas/`, `/cuenta/`, order success pages, internal search results (`/buscar/?q=...`), empty/duplicate filter combinations and staging. Use the right combination of authentication, noindex, canonicals and crawl controls for each; **robots.txt alone is not a privacy mechanism**.

### 4.1 Navigation and internal-linking graph

`Inicio → Productos → Familia → Producto`  
`Inicio → Ciencia → Artículo fundamental → Familia / producto relacionado`  
`Guía práctica → definiciones verificadas → productos apropiados (if any)`  
`Producto → familia → guía sobre su función → documentación respaldatoria`  
`Footer → contacto, políticas, evidencia, preguntas frecuentes`

Product pages must be crawlable from normal `<a href>` links, **not discoverable only through a search input, JS click event or personalized recommendation**. For longer categories, use real paginated links and avoid infinite-scroll-only discovery. [Google ecommerce navigation and pagination]

### 4.2 One domain, three experiences

**Descubrir:** public editorial homepage, product navigation, species/function entry points, education. Index content according to canonical intent.  
**Mi DNAture:** authenticated account dashboard for prior orders and pets. `noindex`, never expose personal pet health details to search bots. Public PDP links point to the same canonical URLs as Discover.  
**Ciencia:** public, indexable reference pages for explanations and verified sources; gated professional materials may exist later, but do **not** promise that gated PDFs will rank. Publicly explain what each document contains.  
**Rule:** no cloaking; don't render misleading nutrition data to bots or show different pricing/availability without clear geographic context.

---

## 5. Page-level SEO and conversion blueprints

### 5.1 Homepage — intent: DNAture + differentiation

**Page title [PROPOSAL]:** `DNAture | Nutrición fisiológica para perros y gatos` — edit product-species wording to match real offering.  
**H1 [PROPOSAL]:** `Nutrición con esencia en el ADN` (official tagline).  
**Supporting paragraph:** in plain Spanish, say **what DNAture actually sells** and explain its evidence-informed approach.  
**Key sections:** prominent species/product navigation (only factual options); concise definition of *nutrición fisiológica*; clear distinction between main recipes and complements; editorial product entry points; scientist/team transparency; links to education; contact and verified delivery information.  
**Internal links:** 3–6 primary family pages, complete-vs-complementary guide, methodology, contact.  
**Structured data:** one `OnlineStore` or appropriate `Organization` identity on a home/about page; site name and accurate identity fields.  
**Avoid:** only aspirational slogans, hard-to-read overlay text, a hero without indexable body copy or false pet-specific claims.

### 5.2 Category page — intent: product role + comparison

**Example:** `/productos/recetas-complete/`  
**Title:** `Recetas Complete para perros | DNAture` (only when the category truly contains canine complete recipes).  
**H1:** `Recetas Complete`.  
**Opening:** 2–4 sentences defining intended nutritional role, species and key caveats based on reviewed descriptions.  
**Required blocks:** real linked SKU rows with descriptive anchors; filters only on verified facets (species, role, protein, preparation, pack size, life stage only if approved); unique category explanation; link to an educational guide; relevant purchasing and delivery info.  
**Markup:** normal breadcrumbs; **do not** put one generic merchant `Product` rich-result object on a multi-product category page.  
**Avoid:** automatically creating thousands of thin keyword-filter pages.

### 5.3 Product detail page — the highest-value organic asset

**Required verified fields in the product information system (PIM):**

| Field | Why it matters |
|---|---|
| Official product name, parent SKU and variation IDs | Clear indexing, product identity and reconciliation |
| Species / life-stage suitability (where established) | Avoid unsafe misclassification |
| Nutritional classification: complete, complementary, etc. | Prevent wrong use; directly reflects DNAture's brand distinctions |
| Purpose and **limits** of use | Be precise about regular vs specialist roles |
| Full ingredient statement and guaranteed analysis | Help evaluation and provide accurate reference material |
| Net weight, storage, handling and feeding information | Real-world utility, including relevant raw-food precautions |
| Current CRC price, currency, stock, package variants | Commerce SEO; must match actual website and feed |
| Delivery availability by served region | Costa Rica customer confidence and fulfillment accuracy |
| Approved images, packaging identifiers, GTIN (if assigned) | Visual and structured-data matching |
| Evidence status, approving professional, last reviewed | Trust and editorial accountability |
| Support route and contraindication/consultation flag if relevant | Avoid implied automatic medical recommendations |

**HTML content order:** H1 and product role → verified price/availability → primary purchase action → what the product is / isn't → species and life stage → ingredient and analysis tables → usage and storage → safety/limitations → related guide → optional technical sheet → linked family and support. Use the **flat row/table design system**, not card stacks.

**PDP SEO example (illustrative SKU):**

```text
URL: /producto/dnature-pollo/
<title>DNAture Pollo | Receta Complete para perros</title>
H1: DNAture Pollo
H2: ¿Qué tipo de receta es?
H2: Ingredientes y composición nutricional
H2: Conservación e indicaciones de uso
H2: Preguntas frecuentes sobre esta receta
```

**[VERIFY]** Product name and its category association are consistent with brand-book examples, but live SKU validity, formulation, sizes, suitability, price and composition need confirmation before shipping.

### 5.4 Education article — intent: answer and trust

Every substantive article should have a **specific question**, a concise helpful answer near the start, practical distinctions, an **evidence section**, clearly labeled exceptions, author/reviewer credentials with verification, a publication date and genuine “updated” date, plus contextual links to products only if relevant. Do **not** write filler solely to satisfy a word-count target or AI-search prompt variations.

**Example:** `/ciencia/alimento-completo-vs-complementario/`  
**H1:** `Alimento completo y alimento complementario: ¿cuál es la diferencia?`  
**First answer (to be expert-approved):** explain what “complete” and “complementary” mean **for the appropriate species and life stage**, why a complement should not silently replace a complete ration, and when veterinary input is appropriate. Cite FEDIAF and the correct product specification rather than making universal product promises.  
**Supplement:** simple comparison table, real brand products in appropriate categories, decision boundaries, sources and review dates.

### 5.5 Science / professionals page

Public explainer pages can document **who formulates and reviews**, **which standards are used**, **what is tested**, **what records are available**, **when guidance is not a diagnosis**, and how professionals can request documents. Only publish actual credentials, tests and protocols. Technical PDFs should have discoverable HTML summaries; PDFs can be valuable downloads, but a structured HTML source page is easier to maintain, link and navigate.

### 5.6 Trust, support and commerce policy pages

Make real contact details, shipping and any temperature-controlled handling requirements, returns restrictions, customer support routes, payment methods, applicable geographic coverage and business identity easy to find and accurately maintained. E-commerce search visibility is weakened when public site claims and live checkout reality conflict, even if metadata looks polished.

---

## 6. Copy, titles, descriptions and link-writing examples

**These are templates — not an instruction to publish unverified product facts.** Titles may be rewritten by search engines; prioritize clarity over rigid character counts. Avoid keyword-stuffed descriptions.

| Page | Proposed `<title>` | Suggested meta description |
|---|---|---|
| Home | `DNAture | Nutrición con esencia en el ADN` | `Conocé las familias de productos DNAture y nuestro enfoque de nutrición fisiológica, educación y acompañamiento para tutores de mascotas.` |
| All products | `Nuestros productos | Explorar recetas y complementos` | `Explorá las recetas, complementos, masticables, treats y suplementos DNAture. Revisá qué función cumple cada familia antes de elegir.` |
| Complete | `Recetas Complete para perros | DNAture` | `Conocé la familia Recetas Complete, su función nutricional y las fórmulas disponibles. Consultá ingredientes, presentación y disponibilidad.` |
| Trout | `Recetas de Trucha | DNAture` | `Descubrí las Recetas de Trucha y su uso específico. Revisá las indicaciones y por qué no deben confundirse con una receta Complete.` |
| Cooked | `Recetas Cocidas | DNAture` | `Explorá las Recetas Cocidas DNAture y su función nutricional, con información clara sobre uso, ingredientes y orientación profesional.` |
| Complements | `Complementos Nutricionales | DNAture` | `Conocé los complementos nutricionales DNAture y su lugar dentro de una alimentación adecuadamente planificada.` |
| Chews | `Masticables para perros | DNAture` | `Explorá la familia Masticables, sus ingredientes y recomendaciones de uso. Elegí con información clara.` |
| Science hub | `Ciencia y nutrición fisiológica | DNAture` | `Entendé los fundamentos de la nutrición fisiológica, las diferencias entre formulaciones y cómo evaluamos la evidencia.` |
| Comparison guide | `Alimento completo vs. complementario | DNAture` | `Aprendé la diferencia entre alimento completo y complementario, por qué importa y qué revisar antes de elegir una receta.` |
| Labels guide | `Cómo leer una etiqueta de alimento para perros | DNAture` | `Una guía para entender ingredientes, composición, indicaciones y límites de uso de un alimento para perros.` |
| Delivery | `Envíos y entregas en Costa Rica | DNAture` | `Consultá las zonas de entrega, condiciones de conservación y opciones de envío vigentes de DNAture.` (**publish only verified zones**) |
| About | `Quiénes somos | DNAture` | `Conocé el propósito de DNAture y nuestro compromiso con la evidencia, la educación y el cuidado responsable.` |

**Copy discipline:**

- Make headings understandable without the hero image: `Recetas de Trucha` is useful; `Volvé a su esencia` cannot carry a shopping page alone.
- Use official brand terms and plain consumer definitions together: `Recetas Complete — alimento de base [only if product facts verified]`.
- Link with context: `Conocé la diferencia entre un alimento completo y uno complementario` rather than `leer más`.
- Write in clear, Costa Rica-appropriate Spanish; decide with the brand team whether to use `vos` consistently. Do not alternate `tú/usted/vos` randomly.
- Avoid `mejor`, `cura`, `100% seguro`, `hipoalergénico`, `sin riesgo`, `avalado por expertos` or `cumple FEDIAF` without substantiation. Never describe evidence more strongly than it warrants.

---

## 7. Editorial authority: content clusters and publishing plan

### 7.1 Three pillar topics

**Pillar A — “Entender la nutrición”** (`/ciencia/`): physiological nutrition defined; complete vs complementary; reading labels; nutrients and food roles; quality and evidence standards.  
**Pillar B — “Elegir con criterio”** (`/guias/`): selecting products by verified role; preparation and storage; how to interpret ingredient lists and guaranteed analysis; feeding transitions with veterinarian caveats.  
**Pillar C — “Conocer DNAture”** (`/nosotros/`, `/productos/`): brand methods, formulation decision process (only if documented), verified product-family differences, traceability, real people and company details.

### 7.2 Prioritized editorial backlog

| Release | Proposed article / asset (Spanish) | Primary question | Proof or review required | Natural linking target |
|---|---|---|---|---|
| Launch | **¿Qué es la nutrición fisiológica?** | What does DNAture mean by it? | Real definition, sourced scope; nutrition review | Science hub / product families |
| Launch | **Alimento completo vs. complementario** | What does each do? | Current FEDIAF, SKU category data; veterinary nutrition review | Complete, trout, cooked |
| Launch | **Cómo leer la etiqueta de un alimento para perros** | Which fields matter? | Real label samples; technical/legal review | PDPs |
| Launch | **Qué revisar antes de elegir la alimentación de tu perro** | How to make an informed choice? | Veterinary review, limitations | Category hub |
| Launch | **Cómo organizamos nuestras familias de productos** | What do Complete, Wild, Treats etc. mean? | Approved taxonomy + reviewed SKU table | All family pages |
| Month 2 | **Recetas de Trucha: para qué están diseñadas y cuáles son sus límites** | Is this a complete daily diet? | Exact recipe documentation; specialist review | Trout category |
| Month 2 | **Recetas Cocidas: cómo entender su función nutricional** | When are they considered? | SKU-level classification and guidance | Cooked category |
| Month 2 | **Suplementos y complementos: diferencias y precauciones** | Are they interchangeable? | Current product data, vet review | Supplements / complements |
| Month 2 | **Qué significa el análisis garantizado en una etiqueta** | How to interpret the table? | Actual labels, scientific reviewer | PDP analysis tables |
| Month 2 | **Conservación e higiene de productos crudos** | How should they be handled? | Documented package instructions, food safety review | Relevant raw product pages |
| Month 3 | **Preguntas frecuentes sobre el cambio de alimentación** | How to plan a transition? | Veterinary review and contraindications | Help / PDPs |
| Month 3 | **La función de los masticables y treats** | How are they different? | Verified composition and usage | Chews / treats |
| Month 3 | **Cómo interpretamos la evidencia nutricional** | What evidence supports our content? | Named reviewer, reference policy, methodology | Science hub |
| Later | **Un caso de trazabilidad: del ingrediente al producto** | Can you substantiate provenance? | Actual records, permission, date | About / products |
| Later | **Entrevista técnica con nuestro equipo** | Who makes formulation decisions? | Verified staff credentials and quotes | Team / Science |
| Conditional | **Nutrición felina: guía de lectura de etiquetas** | What differs for cats? | Feline nutrition reviewer and actual relevance | Cat-appropriate products, if any |

**Quality > cadence:** begin with **4–6 carefully reviewed cornerstone assets and verified PDPs**, then maintain a realistic publishing rhythm (for example, two substantive pages/month if subject-matter review capacity permits). Update useful existing pages before making repetitive new ones.

### 7.3 The evidence box (reusable editorial component)

Every scientific explanation should contain a flat, clearly separated block:

```text
QUÉ SABEMOS — direct, supportable statement
EN QUÉ SE BASA — citations and edition/year of standard
QUÉ NO PODEMOS CONCLUIR — uncertainties, species/age limits
CUÁNDO CONSULTAR — professional referral threshold
REVISADO POR — real name, credential, review date
```

**[PROPOSAL]** This aligns with the brand's “científica + cuidadora + educadora” voice and helps readers understand source quality. It is **not** a special Google or LLM ranking format.

### 7.4 Independent reputation and earned mentions

Develop genuine relationships with verified veterinary nutritionists, academic programs, responsible animal-care organizations, real distributors and science communicators. Offer accurate source pages, original data only where it exists, interviews, educational collaborations and useful documentation. Seek relevant, **editorially earned** links and citations; avoid paid link schemes, fake testimonials, purchased “best pet food” awards and synthetic community recommendations. Always disclose commercial relationships.

---

## 8. GEO-AI — become easy to reference without gaming AI answers

### 8.1 What the 2026 guidance actually supports

Google's 2026 guidance says core SEO still underpins AI Overviews and AI Mode; **no special schema, new AI text file, forced content chunking or separate “AEO page” is required**. It emphasizes original non-commodity material, understandable organization, high-quality images, indexability and helpful reliable content. Google documents **query fan-out**, but that does *not* justify thousands of near-duplicate pages for hypothetical subqueries. [OFFICIAL: Google AI optimization guide, May 2026]

### 8.2 Make the facts easy to retrieve and verify

1. **Use stable, crawlable, self-contained HTML pages** for essential public facts. Avoid burying all important content in PDF-only, image-only or login-only experiences.
2. **Answer the visitor's actual question** in clear language near the relevant heading; follow with nuance, evidence and links — without imposing artificial short paragraph counts.
3. **Establish an explicit brand entity:** consistent business name DNAture, official logo, accurate company details, genuine team pages and real profiles. No invented founder, license, address, awards or affiliations.
4. **Use consistent nouns:** name the recipe's type and species before listing features. Repeat identifiers consistently across PDP, title, JSON-LD, product feed, technical sheet and public statements.
5. **Provide primary evidence:** current cited standards, real formulation notes, source dates, published nutritional analyses and authentic process explanations when authorized.
6. **Add context:** e.g. `Recetas de Trucha no son Recetas Complete` (as described in brand book p. 33); clarify limitations, when professional judgment applies, and where to verify SKU details.
7. **Offer purposeful media:** photographs of real approved packaging, labeled information graphics, transcripts for explanatory video. Keep the meaning accessible in text.
8. **Be citable off-site through genuine expertise:** independently useful research or education, not a paid mention farm.
9. **Correct and maintain:** show real updates where nutrition standards or product formulas change. Do not manufacture freshness by changing dates alone.
10. **Don't promise citations.** Search systems decide what to surface; the goal is factual clarity and a strong discovery foundation.

### 8.3 OpenAI crawler controls — separate Search from training

OpenAI distinguishes **`OAI-SearchBot`** (search discovery), **`GPTBot`** (potential model-training crawling) and **`ChatGPT-User`** (certain user-initiated visits). Its official documentation says these controls can be managed independently. **Allowing Search does not require permitting training.** [OFFICIAL: OpenAI crawler docs]

**Illustrative `robots.txt` — legal/brand review required** (replace the domain; customize for your platform):

```robots
# Standard search engines (Googlebot/Bingbot etc. use this group)
User-agent: *
Allow: /
Disallow: /checkout/
Disallow: /cuenta/
Disallow: /mi-dnature/
Disallow: /carrito/
Disallow: /buscar/

# OpenAI search discovery is a separate, specific group.
User-agent: OAI-SearchBot
Allow: /
Disallow: /checkout/
Disallow: /cuenta/
Disallow: /mi-dnature/
Disallow: /carrito/
Disallow: /buscar/

# Training use is a separate strategic/legal choice.
User-agent: GPTBot
Disallow: /

Sitemap: https://YOUR-REAL-DOMAIN.example/sitemap.xml
```

**Important engineering caveats:** robots groups and precedence need platform-specific testing; crawlers may still *know about* a blocked URL. Private pages require authentication and must never expose personal data. If you need a crawler to read `noindex`, blocking its crawl of that same page can prevent it from seeing that directive. Do not deploy this template without testing real URL behavior and checking policies of your CDN/WAF. Choose whether GPTBot is allowed only after an explicit brand/data-policy decision; the example disallows it to illustrate the distinction, not as an SEO requirement.

### 8.4 `llms.txt`, schema hacks and AI-only text

- **`llms.txt` is optional and low priority.** Google's 2026 guidance explicitly says Google Search doesn't use it for ranking/visibility. Maintain only if another identified integration or workflow genuinely benefits; do not call it an SEO requirement.
- **No “GEO schema” promises.** Use regular, accurate structured data because it may improve product search presentation and parsing, not because it guarantees AI answer placement.
- **Do not generate one page for every AI prompt.** Avoid scaled-content abuse, false summaries, keyword stuffing, invisible LLM-oriented blocks and manipulated citations.
- **Agent-friendly commerce is emerging, not an MVP dependency.** Clear semantic HTML, visible controls, predictable variant selectors and accurate prices are low-risk foundations; evaluate any new agent commerce protocols only when the store's platform and operations are ready.

### 8.5 GEO measurement protocol

- **Google:** inspect the **Search Generative AI performance** reports in Search Console (June 2026 launch; Google says worldwide rollout completed August 31, 2026). Track impressions, exposed URLs, country and device; note that *impressions are not purchases or verified citations*. [OFFICIAL]
- **ChatGPT and other assistants:** take a fixed sample of ~20–30 *representative, non-sensitive prompts* across explanatory, product comparison, navigation and local intents. Run monthly under documented settings, location, date and prompt variants. Record whether DNAture appeared, which URLs were cited, whether facts were correct and whether competitor references were relevant. Outputs vary; sampling is directional, not an industry-standard score.
- **Web analytics:** track identifiable organic and AI-source referrals when sent. Many answer interactions generate no visit and attribution can be incomplete; don't infer absent citations from absent referral sessions.
- **Quality audit:** manually flag any AI answer misclassifying a complementary recipe as complete and decide whether the site's own copy, schema or third-party claims caused the confusion.

#### Example monitoring prompts (research only, not pages to mass-produce)

- `¿Cuál es la diferencia entre una receta completa y una complementaria para perros?`
- `¿Qué debería revisar en la etiqueta de un alimento para perros?`
- `¿Cómo sé si una receta con trucha es una dieta completa?`
- `¿Dónde encuentro la información nutricional de DNAture?`
- `¿Qué productos ofrece DNAture en Costa Rica?`
- `¿Qué cuidados de conservación requiere un alimento crudo para mascotas?`
- `¿Cómo puedo comprar DNAture y conocer las zonas de entrega?`

---

## 9. Technical SEO engineering specification

### 9.1 Rendering and navigation

- Server-render or statically render essential public headings, SKU data, price/stock snapshots, policy and article copy when practical. Client-side enhancement is fine; the core should remain understandable if interactive widgets fail.
- Implement crawlable `<a href>` internal links; preserve a stable product slug regardless of audience mode.
- Canonical URLs should be accurate and self-referential on indexable primary pages. Product variant handling requires a deliberate single-page vs multi-page strategy; use Google `ProductGroup` guidance if variants warrant it.
- Avoid duplicated SKU pages created by categories, campaign parameters or customer personalization. `utm_*`, sort, pagination and filter URLs need a defined indexing/canonical strategy rather than indiscriminate blocking.
- Use XML sitemaps for canonical indexable URLs and update real `lastmod` when content meaningfully changes. Exclude account/order/cart/search pages, redirects, 4xx and `noindex` pages.
- For paginated catalogs, use actual unique URLs and linked “next” pages; bots do not reliably click JS-only Load More buttons. Ensure any infinite scroll has a crawlable paginated fallback.
- Make redirects explicit (301 for permanent moves), and return meaningful 404/410 for removed products with no relevant replacement. Maintain a redirect map during launch/migrations.
- Do not force location or language based only on IP; provide an explicit selector if the business expands. For a **single Spanish Costa Rica version**, `lang="es-CR"` and localized context are useful; `hreflang` is important **only** when there are alternate language/region versions to connect.

### 9.2 Performance and mobile

**Production targets (P75 real-user data):** LCP ≤ **2.5 s**, INP ≤ **200 ms**, CLS ≤ **0.1**. [OFFICIAL: Google Core Web Vitals]

- Use responsive product imagery (`srcset`, `sizes`, `width`/`height`), AVIF/WebP when appropriate, image CDN and restrained font payloads.
- Don't lazy-load the LCP hero image. Prioritize the one true hero image; defer below-the-fold decorative assets.
- Avoid giant brand-book raster exports and autoplay videos that delay purchase interfaces.
- Keep the flat editorial layout semantic: real headings, navigation landmarks, tables for actual data, obvious controls, not all information contained in artistic image overlays.
- Test mobile browsing and checkout on real mid-range connections, not only desktop Lighthouse.

### 9.3 Image and video SEO

- Publish original, approved product images with readable packaging shots (front + ingredients/composition where legally permitted). Use descriptive filenames such as `dnature-receta-pollo-presentacion.webp`, not `IMG_0042.jpg`.
- Use a proper HTML `<img src>` for indexable product imagery; Google does not index CSS background images the same way. Add meaningful alt text, not keyword strings.
- Add descriptive contextual captions to scientific photos; use image sitemap if CMS or CDN discovery is problematic.
- When producing explanatory videos, host on a discoverable page with written summary/transcript, useful thumbnail and appropriate video data when supported; no need to create video for every article.
- Keep packaging artwork, claim wording and net contents synchronized with the active SKU and batch/version information.

### 9.4 Structured data — minimum set and restrictions

| Type | Where | Benefit | Conditions |
|---|---|---|---|
| `OnlineStore` / `Organization` | Home or About | Entity and merchant identity | Only true name, logo, URLs, support, address if applicable |
| `BreadcrumbList` | Categories, PDPs, articles | Hierarchy / breadcrumb display eligibility | Visible navigable trail consistent with page |
| `Product` + `Offer` | Purchasable, single-product PDP | Product rich search eligibility | Real SKU, verified price/currency, stock, URL, image; match visible page |
| `ProductGroup` + variants | If real product variants and proper URLs exist | Group variant relationships | Follow single- vs multi-page Google variant rules |
| `MerchantReturnPolicy` and shipping policy data | Appropriate merchant/product/policy pages | Merchant presentation | Use only real, legally approved policy details |
| `Article` or `BlogPosting` | Substantive editorial pages | Clear metadata about content | Accurate author, publisher and dates; no promise of a rich result |
| `LocalBusiness` | **Real eligible physical business locations** | Local identity | Physical address and operating details must be accurate |
| FAQ content | Helpful visible Q&A | User understanding and possible organic matching | **Do not budget for FAQ rich results**: Google removed the FAQ rich-result feature in May 2026 |

**Illustrative product JSON-LD — do not publish placeholders:**

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[NOMBRE EXACTO DEL SKU]",
  "image": ["https://YOUR-REAL-DOMAIN.example/media/[foto-aprobada].webp"],
  "description": "[DESCRIPCIÓN VERIFICADA, VISIBLE EN LA PÁGINA]",
  "sku": "[SKU_REAL]",
  "brand": { "@type": "Brand", "name": "DNAture" },
  "offers": {
    "@type": "Offer",
    "url": "https://YOUR-REAL-DOMAIN.example/producto/[slug-real]/",
    "priceCurrency": "CRC",
    "price": "[PRECIO_REAL]",
    "availability": "https://schema.org/[InStock_OR_OutOfStock]",
    "itemCondition": "https://schema.org/NewCondition"
  }
}
```

**Notes:** the placeholders are *deliberately invalid* until filled. Never publish fake aggregate ratings, reviews or GTINs; never mark a category as one purchasable product; never use schema to claim veterinary validation that the visible page cannot support. Test with Google's Rich Results Test and the rendered HTML. Apply shipping/returns markup only when policy details exist and are accurately implemented. The presence of schema does not guarantee enhanced display.

### 9.5 Search indexing controls checklist

- [ ] Google Search Console domain property verified; sitemap submitted; property owners identified.
- [ ] Bing Webmaster Tools verified; sitemaps and optional IndexNow configured (notification ≠ guaranteed indexing).
- [ ] Production `robots.txt` and CDN/WAF access checked for Googlebot, Bingbot and authorized AI-search crawlers.
- [ ] All target articles, categories and PDPs return 200, appropriate canonical and actual HTML content; no accidental `noindex`.
- [ ] All private/account/order pages protect personal data and are excluded from indexable sitemap.
- [ ] Product structured data passes validation and matches visible CRC price, availability, SKU and variation selection.
- [ ] Variants/canonicals/facet rules documented before filters are launched.
- [ ] Top 20 images are indexable, licensed and compressed; all key product images use meaningful alt text.
- [ ] Mobile Core Web Vitals and accessibility tested; checkout remains usable.
- [ ] No staging domain, preview page, placeholder SKU, invented location or obsolete packaging indexed.

---

## 10. Costa Rica — geographic SEO and merchant discovery

**Operating assumption [VERIFY]:** Costa Rica is the initial commercial market because the brand book refers to local impact and expansion, but actual service zones, physical points of sale, cold-chain handling and delivery prices were not provided.

### 10.1 Local relevance without doorway pages

- State **real** country, available delivery areas, costs and fulfillment constraints on a dedicated page and at relevant PDP/checkout steps.
- Where a genuine public-facing DNAture location exists and is eligible, claim and maintain its **Google Business Profile**; Costa Rica is on Google's supported Business Profile country list. If it is online-only, verify eligibility before creating a profile; do **not** create a fake storefront.
- Keep the same verified business name, address (if public), phone/contact and hours across the site, business profiles and real third-party directories.
- A `Dónde comprar` directory should list only **current approved stockists** with actual address/location, contact, opening hours where verified, and ideally availability caveats. Do not generate thin city/municipality keyword pages with duplicated text.
- Consider genuine regional information on fulfillment, especially any cold-chain conditions, only where operationally verified. A location page that promises San José, Heredia or Cartago delivery without evidence is worse than no page.
- If there are real in-person locations, solicit authentic customer feedback without paying for positive reviews or filtering only satisfied customers.

### 10.2 Merchant Center and listings — check the actual channel

**Important 2026 verification:** Google's **Shopify Google & YouTube product-sync help lists Costa Rica (`CR`) with English and Spanish**, and official Merchant Center regional availability documentation includes Costa Rica. That means Costa Rica **must not be categorically described as unsupported**. Nevertheless, eligibility for a *particular* feature (Shopping ads, free online listings, free **local** listings, inventory ads, delivery extensions) varies by product, integration, account, policy and channel. Google documents **free local listings** with a narrower country list than its local inventory ads list, so verify each option separately. [OFFICIAL sources below]

**Action:** create or assess Merchant Center only after inventory/pricing/fulfillment are ready; configure product feed with correct destination country, `es`, CRC pricing, GTIN if real, accurate availability, approved images, shipping/return information and source-of-truth synchronization. Apply for relevant surfaces available to the actual DNAture account; monitor disapprovals and mismatches. **Do not rely on Merchant Center as the only way Google discovers product URLs.**

### 10.3 Language and future expansion

Start with **genuinely localized Spanish**, price display in CRC, delivery explanations relevant to Costa Rica, and local support details. If DNAture later offers country-specific storefronts, create **distinct crawlable URLs per locale** with correct reciprocal `hreflang` and consistent canonical decisions; do not translate product facts, labels or legal claims without validation. Don't create English pages just to seem international if fulfillment and translation quality are not ready.

---

## 11. Reorder, personalization and SEO — an implementation contract

**First-time visitors:** public landing pages should prioritize understandable product roles, verified proof and direct shopping. Do not gate basic SKU facts behind a quiz.  
**Returning customers:** use `/mi-dnature/` privately for repeat purchase, saved information, order history, optional reminders and favorites. Support exact product search and product deep links for people arriving from Google.  
**Science visitors:** provide free-to-read public evidence pages; link to available source documents and genuine professional contact without forcing a registration for basic factual content.

**Privacy and indexation:** do not put pet identity, medical conditions or personal order details into public URLs, visible analytics parameters or structured data; prevent indexation of private views. Never surface individualized dietary diagnosis as an automatic search snippet. Manage first-party consent and local privacy obligations.

**Flat-interface SEO advantage [PROPOSAL]:** editorial split screens, open product rows, accessible tables and article indices can provide **clear semantic headings, text links and scannable attributes**. This is **not** because “Google prefers no cards”; it is because the content and links can be transparent, accessible and genuinely useful. Avoid sacrificing information density to minimalism.

---

## 12. 2026 trends — what to do, what to watch, what to ignore

| Trend | DNAture action | Evidence / maturity | Priority |
|---|---|---|---|
| AI Overviews / AI Mode | Publish authoritative, accurate explanations and maintain indexable product pages | Documented 2026 Google guidance; no special AI ranking hack | **Now** |
| Generative AI reporting in Search Console | Create separate dashboard for AI feature impressions and exposed pages | Google reports worldwide rollout by 31 Aug 2026 | **Now** |
| Greater weight on non-commodity original content | Interviews, real formulation methodology, documented tests, reviewed guides | Google's official guidance prioritizes unique useful content | **Now** |
| Visual and multimodal discovery | High-quality real product/label imagery, meaningful alt, informative video when useful | Google image guidelines, 2026 multimodal reporting improvements | **Now / next** |
| Accurate merchant information | `Product`/`Offer`, verified inventory, shipping and returns, eligible Merchant Center feeds | Standard Google merchant/search documentation | **Now** |
| AI crawl controls | Decide search access separately from foundation-model training access | OpenAI official bot documentation | **Now** |
| Agent-friendly purchasing | Stable accessible controls, machine-readable product attributes | Emerging; 2026 Google guide mentions agent experiences | **Experiment later** |
| `llms.txt` file | Optional only for a known use; no claim of Google Search visibility benefit | Google says it does not use this file for Search | **Not required** |
| FAQ-rich-results tactics | Maintain FAQs for humans, not for a Google FAQ feature | Google removed FAQ rich results May 2026 | **Do not invest** |
| Mass programmatic “AI answer” content | Reject duplicate prompt pages and fabricated mentions | Google spam / AI optimization guidance | **Avoid** |
| Third-party “GEO citation scores” | Use cautiously, require repeatable methods and ground truth | No universal official cross-platform citation metric | **Experimental** |

**Trend watchlist owner:** revisit Google Search Central updates, Google Merchant policies, OpenAI crawler documentation, FEDIAF guidelines and search reporting every quarter. Do not make architectural changes based on a marketing case study or SEO influencer claim alone.

---

## 13. Governance: how DNAture prevents ranking success from creating misinformation

### 13.1 Roles and decision rights

| Owner | Accountable for | Approval gate |
|---|---|---|
| Brand / creative director | Voice, vocabulary, photography rights, approved claims language | Every core template and brand-sensitive page |
| Veterinary nutrition expert / qualified professional | Nutritional categories, limits, feeding recommendations, medical safety language | Every scientific, health-related or specialist-diet article |
| Product / regulatory owner | SKU master data, labels, ingredients, composition, certifications, local compliance | Every live PDP, claim and technical sheet |
| SEO/content editor | Search intent, architecture, titles, evidence citations, internal links, updates | Publish-ready briefs and editorial QA |
| Engineering / ecommerce | Canonicals, rendering, schema, crawl access, performance, feed sync and privacy | Technical launch checklist |
| Operations / support | Inventory, fulfillment zones, handling and returns, customer information | Policy and local pages |
| Analytics | Search Console, business events, reporting, experiments | KPI definitions and baseline |

### 13.2 Required publication checklist

- [ ] Intent and target audience are clear; page adds information not already covered elsewhere.
- [ ] Brand book terminology and officially authorized words are respected (especially p. 14).
- [ ] Product category and nutritional completeness are verified **per actual SKU**.
- [ ] Claims, source URLs, author credentials and dates have evidence and approval.
- [ ] No implied veterinary diagnosis, disease cure, false safety guarantee or fabricated certification.
- [ ] Scientific source includes edition/year, applicability and limitations, not just a scientific-sounding logo.
- [ ] Title, H1, intro and visible page facts are consistent.
- [ ] Public page is indexable if intended, canonical, linked and represented in sitemap.
- [ ] JSON-LD (where applicable) matches visible facts.
- [ ] Images are authentic, licensed, described and optimized.
- [ ] Mobile layout, keyboard accessibility, checkout path and page performance pass QA.
- [ ] Content owner and next review date are recorded.

### 13.3 Content update triggers

**Immediate review:** recipe reformulation, ingredients, nutritional classification, product name/label, safety guidance, applicable law, shipping policy or changed expert recommendation.  
**Quarterly:** product accuracy and critical landing-page performance review.  
**Every 6 months:** cornerstone science articles with references to standards and clinical context; more often if significant evidence or professional guidance changes.  
**Annual:** information architecture, terminology policy and resource allocation.  
Never update the visible date unless the content meaningfully changed.

---

## 14. Implementation roadmap — first 90 days

| Timing | Workstream & deliverables | Lead | Completion evidence |
|---|---|---|---|
| **Days 1–15** | Validate real catalog, SKU-role classification, species, compliance, delivery; establish analytics, business goals, domain strategy, keyword research baseline; confirm expert reviewer; approve content taxonomy | Product + clinical + SEO + operations | Master product table; written claims rubric; query-intent map |
| **Days 16–30** | Implement public URLs, SSR/HTML templates, titles, headings, link graph, canonical rules, XML sitemap, analytics, schema and robot policies; design flat Product/Category/Article templates | Engineering + UX + SEO | Crawl test; staging indexation QA; Rich Results Test |
| **Days 31–45** | Publish homepage, family pages for actually available products, approved PDPs, policy/support pages and 2–3 science cornerstones | Content + clinical + product | Public pages with verifiable claims and internal links |
| **Days 46–60** | Launch and inspect indexing, Merchant Center eligibility/feed, GSC/Bing, performance; fix taxonomy, canonical, image and checkout defects | Engineering + analytics + operations | No critical indexation errors; verified product data parity |
| **Days 61–75** | Add practical guides and internal-link upgrades; launch optional return-customer features without polluting public index; begin GEO prompt baseline | Content + product + analytics | Meaningful content coverage and documented AI sampling |
| **Days 76–90** | Analyze conversions, search queries, AI feature reports, support questions; revise weak pages; prioritize next quarter's proof-led assets | SEO + business owner + clinical | Baseline dashboard, prioritized backlog, review record |

### Prioritized backlog (impact × cost × risk)

| Tier | Action | Why first |
|---|---|---|
| **P0 / before launch** | SKU classification and claims audit | Cannot safely optimize mislabeled products |
| **P0** | Crawlable PDP/category URLs, titles, canonicals, sitemap | Foundational discovery |
| **P0** | Price/availability parity and complete visible purchasing info | Commerce trust and merchant parsing |
| **P0** | Complete vs complementary evergreen guide with expert review | Highest alignment with DNAture's distinction |
| **P0** | Analytics, Search Console, security and private-account indexation control | Avoid blind optimization and privacy exposure |
| **P1** | Science hub, reviewer pages and systematic internal linking | Long-term evidence authority |
| **P1** | Product imagery, performance, shipping/return metadata | SERP and conversion support |
| **P1** | Costa Rica business/local pages **only if eligible** | Real local discovery |
| **P1** | AI feature dashboard + responsible citation sampling | GEO measurement baseline |
| **P2** | Video, documented traceability stories, technical resource library | Differentiated value with higher production cost |
| **P3 / exploratory** | Agent commerce protocols, AI-only integration experiments | Immature / conditional ROI |

---

## 15. Dashboard specification and reporting cadence

### Recommended event/property design

**GA4 recommended standard ecommerce events:** `view_item_list`, `select_item`, `view_item`, `add_to_cart`, `begin_checkout`, `add_shipping_info`, `add_payment_info`, `purchase`, `refund` when applicable.  
**Optional custom events:** `nutrition_guide_open`, `scientific_source_click`, `product_technical_sheet_open`, `reorder_start`, `reorder_complete`, `pet_profile_saved`. Track **anonymous action counts only**; never send pet medical details, customer names, addresses or other sensitive values as event parameters.

**Report segments:** organic brand vs non-brand; category vs product vs guide; new vs returning **where consent and analytics configuration permit**; desktop vs mobile; Costa Rica vs other regions; ordinary search vs Search Console AI feature reports. Keep channel definitions stable.

| Reporting frequency | Report | Decision |
|---|---|---|
| Weekly after launch | Indexation/technical errors; critical product feed errors; checkout stability | Fix blockers immediately |
| Every 2 weeks | Top queries, pages gaining impressions, CTR gaps, landing-page conversion | Improve weak titles/content and product availability |
| Monthly | Organic revenue and assisted conversions; AI search exposure; trust metrics; prompt sample | Decide which page or evidence investment to prioritize |
| Quarterly | Topic coverage, technical debt, local channel effectiveness, claims audit and ROI | Reprioritize editorial roadmap and experiments |

### Initial launch acceptance criteria (process metrics, not made-up traffic targets)

- **100% of purchasable live SKUs** have accurate nutritional classification, publicly visible ingredients/analysis where applicable, real price/availability, approved product images and intended indexation.
- **100% of public priority pages** have unique meaningful titles, a clear H1, crawlable internal links, valid canonical behavior and page-type-appropriate schema when supported.
- **0 known critical cases** of complementary formulas presented as complete, fake reviews, unsupported veterinary claims, private pet/order data exposed or staging pages indexed.
- Product and catalog templates pass mobile functional QA and measured Core Web Vitals improvements are tracked against actual baseline.
- GSC, Bing, GA4 and merchant eligibility/reporting decisions are documented; at least one ongoing owner is assigned to each.

---

## 16. Briefs the team can immediately execute

### Brief A — Core guide: “Alimento completo vs. complementario”

- **Audience:** first-time guardians and evidence-seeking shoppers.
- **Intent:** understand the functional difference, not automatically pick an SKU.
- **Search concept:** `alimento completo vs complementario perros`.
- **Outline:** direct neutral definition → comparison of role and use → reading the declaration on packaging → why DNAture separates these product families → exceptions and when to consult a vet → source and review record → relevant verified categories.
- **Brand anchor:** p. 33 difference between Complete and Trucha/Cocidas.
- **Research source:** FEDIAF 2025 nutritional guidelines; confirm whether newer guidance supersedes it before publication.
- **Avoid:** recommending an incomplete formulation as sole long-term diet; broad medical claims; equating all raw products with one category.
- **CTA:** `Explorar las familias de productos`.

### Brief B — Highest-intent category: “Recetas Complete”

- **Audience:** guardians comparing daily/main recipes.
- **Intent:** see legitimate complete offerings, size, protein content, availability and usage.
- **Outline:** straightforward definition → who the actual listed products are designed for → real SKU list with product role/price → ingredients and label explanations → storage and fulfillment → relevant guide.
- **Brand anchor:** p. 33.
- **Avoid:** inventing life-stage claims or cat suitability; blanket FEDIAF claims without per-formula evidence.
- **CTA:** `Ver recetas disponibles`.

### Brief C — Science hub: “Cómo trabajamos con la evidencia”

- **Audience:** veterinary professionals, educated guardians and skeptical newcomers.
- **Intent:** evaluate sources, professional responsibility and transparency.
- **Outline:** explicit philosophy → named qualified team when verified → how claims are reviewed → criteria for using FEDIAF/other references → what data can be provided per SKU → corrections policy → contact for technical inquiries.
- **Brand anchor:** pp. 11–17, 55–63.
- **Avoid:** branding every product as “scientifically proven” solely because scientific sources appear on the page.
- **CTA:** `Consultar información técnica` (only if this service exists).

### Brief D — Returning-buyer entry

- **Audience:** customer looking for an exact item or reorder.
- **Intent:** instant access to a previously purchased product.
- **Public SEO:** exact canonical PDP remains searchable; brand/category links are stable.
- **Private UX:** `Repetir mi compra`, quantity choice, clear latest price/stock and cart review; don't index order detail or pet profiles.
- **Success metric:** time-to-reorder / completed reorder (compare against baseline), not editorial scroll depth.

---

## 17. Known unknowns and decisions required before publishing

| Question | Why it matters | Recommended next action |
|---|---|---|
| What is the canonical domain and current site/platform? | Redirects, schema, indexing, Merchant sync | Document domain and stack; perform technical crawl if a site exists |
| Which exact SKUs are live, complete and suitable for which species/life stages? | Product accuracy and content safety | Approve a SKU/PIM evidence spreadsheet |
| Which FEDIAF edition, formulation test and certification claims can be substantiated per SKU? | Scientific and regulatory validity | Regulatory/clinical signoff; no generic certification statement |
| Where are products sold/delivered, and what are storage conditions? | Local pages and reliable fulfillment copy | Operations matrix by region and product |
| Is there an eligible public physical location or verified retail partner list? | Local Business/Business Profile strategy | Verify before creating listings or city pages |
| Who will be the public scientific author/reviewer? | Accountability for educational content | Name and verify credentials and a review workflow |
| Can approved real product photography, technical sheets and ingredient tables be published? | Product Search, GEO citations, confidence | Asset and permission audit |
| What is the real baseline for organic traffic, keyword positions, conversion and reorders? | Target setting | GSC/GA4 historical export or new-site baseline period |
| What legal constraints govern pet-food claims and handling in Costa Rica? | Medical/regulatory safety | Obtain local legal/regulatory review; don't infer approval from the brand book |

---

## 18. Reference library — primary, current guidance

**Research checked:** 5 November 2026. These sources support the external SEO/GEO guidance and are **separate from** the DNAture brand book.

### Google Search Central

1. [Optimizing your website for generative AI features in Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) — 2026 guidance: original content, technical fundamentals, myth-busting of GEO “hacks”, and measurement.
2. [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) — crawlability, eligibility and no special AI markup requirement.
3. [Google Search ecommerce guidance](https://developers.google.com/search/docs/specialty/ecommerce) — site structure, feeds, product markup, URL patterns and pagination.
4. [Help Google understand your ecommerce site structure](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure) — normal internal links and product discovery.
5. [Product and Offer merchant listing structured data](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing) — validated purchasable product data, eligibility constraints.
6. [Product variants — ProductGroup](https://developers.google.com/search/docs/appearance/structured-data/product-variants) — variants, IDs, URLs and canonical strategy.
7. [Organization / OnlineStore structured data](https://developers.google.com/search/docs/appearance/structured-data/organization) — identity fields and merchant subtype.
8. [Breadcrumb markup](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) — hierarchy and validation.
9. [Merchant return policy data](https://developers.google.com/search/docs/appearance/structured-data/return-policy) — true returns metadata and precedence.
10. [Image SEO best practices](https://developers.google.com/search/docs/appearance/google-images) — image HTML, descriptive alt, image indexing.
11. [Core Web Vitals and Search](https://developers.google.com/search/docs/appearance/core-web-vitals) — LCP/INP/CLS thresholds.
12. [Localized versions / hreflang](https://developers.google.com/search/docs/specialty/international/localized-versions) — if multilingual or multiregional later.
13. [Search Central documentation update log](https://developers.google.com/search/updates) — FAQ rich result removed May 2026; `llms.txt` guidance.
14. [Google Search's generative AI performance reports](https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports) — announcement 3 June 2026, update says globally rolled out by 31 August 2026.

### OpenAI and Microsoft

15. [OpenAI crawlers — OAI-SearchBot, GPTBot, ChatGPT-User](https://developers.openai.com/api/docs/bots) — distinct search and training crawlers, choice of access policy.
16. [Bing Webmaster Tools / IndexNow](https://www2.bing.com/indexnow/getstarted) — rapid URL-change notification; does not guarantee indexing.

### Costa Rica, merchant surfaces and scientific references

17. [Google Business Profile supported countries](https://support.google.com/business/answer/6270107) — Costa Rica included; profile eligibility still depends on business type.
18. [Google & YouTube app product sync country list (Merchant Center)](https://support.google.com/merchants/answer/13693394) — Costa Rica (`CR`) included; channel eligibility varies.
19. [Merchant Center regional availability and pricing](https://support.google.com/merchants/answer/16558727) — includes Costa Rica in documented feature coverage.
20. [Local inventory ads vs free local listings geographic coverage](https://support.google.com/merchants/answer/14615117) — demonstrates surface-by-surface differences.
21. [FEDIAF Nutritional Guidelines](https://europeanpetfood.org/self-regulation/nutritional-guidelines/) — 2025 edition for complete/complementary pet foods; reference, **not** proof of product certification.

**Brand source:** DNAture's own `BRANDBOOK 2.pdf`, particularly pp. 3–6 (purpose/mission), 10–17 (tone/guardians/science), 14 (authorized/disallowed wording), 19–21 (identity/tagline), 31–35 (palette and product families), 36–37 (photography), 42–54 (packaging), and 55–63 (social content pillars). No source in this list substantiates any **particular live DNAture formula**, price, shipping area, physical location, product registration or clinical efficacy claim.

---

## Final creative directive

**Be the brand that answers the important question correctly, then makes the right next step easy.**

For **Descubrir**, make DNAture findable through understandable nutrition education and precise product categories. For **Mi DNAture**, make exact products and reorders effortless without generating duplicate or private search pages. For **Ciencia**, provide verified details that a discerning guardian or professional can examine, challenge and cite. One coherent public content system powers all three experiences — and establishes the conditions for both classic SEO and generative discovery.
