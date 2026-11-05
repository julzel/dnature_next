# DNAture — Digital Design System

**Version:** 0.1 — Creative direction / proposed implementation specification  
**Language:** Spanish (Costa Rica) for customer-facing examples  
**Primary surfaces:** Responsive e-commerce website, customer account, educational content, potential professional hub  
**Source of truth:** `BRANDBOOK 2.pdf` (79 pages)  
**Related exploration:** `DNAture_Interactive_Concept.html`

> **Status key**
> - **[BRAND]** = specified or clearly supported by the uploaded DNAture brand book.
> - **[PROPOSED]** = recommendation for the new digital product; not an approved brand rule.
> - **[VALIDATE]** = requires product, legal, clinical, engineering, or commercial sign-off.
>
> This is a *digital design-system proposal* built on top of the existing brand identity, not a replacement for its official guidelines. Screen layouts, names of new features, and UX specifications below are proposals. Product facts and nutritional claims must come from verified product records, not from example UI copy.

---

## 1. North star

**[PROPOSED]** Build **one cohesive DNAture website that adapts to the relationship with the customer**. A newcomer should feel welcomed and informed; an established customer should reorder effortlessly; a scientifically engaged guardian or professional should be able to inspect deeper evidence.

**Brand promise [BRAND]:** *“Nutrición con esencia en el ADN.”* (Brand book pp. 20–21.)  
**Digital creative platform [PROPOSED]:** *“Nutrición tan única como su ADN.”* This is an experience concept, **not** a replacement for the official brand tagline.

### Experience principles [PROPOSED]

1. **Animal first, product second.** Organize discovery around species, nutritional role, and the pet's context, with a direct route to the catalog.
2. **Clarity before persuasion.** Clearly distinguish complete formulas, supplements, treats, and products intended for specific uses.
3. **Progressive disclosure.** Explain simply at first; expose composition and evidence as the customer requests more detail.
4. **Earn trust with proof.** Use traceable claims, accessible explanations, and real supporting documents when available.
5. **Make care continuous.** Saved pets and purchasing history should make future visits easier, never more complicated.
6. **One identity, different densities.** Discovery can be expressive; reordering is compact; scientific content is editorial and structured.
7. **Accessible by default.** A visual identity is only successful when everyone can use it.

**Brand values [BRAND]:** scientific rigor, empathetic care, education, respect for animal biology, transparency, and community (pp. 4–6, 10–17).

---

## 2. Experience architecture

### 2.1 Three experiences, one platform [PROPOSED]

| Experience | Primary visitor | User intent | Homepage priority | Primary action |
|---|---|---|---|---|
| **01 — Descubrir DNAture** | New / unidentified customer | Understand, choose, trust | Pet-led introduction, product roles, evidence, guided pathways | **Empezar por mi mascota** |
| **02 — Mi DNAture** | Recognized returning customer | Reorder, manage, continue | Recent items, pet profiles, order history, optional reminders | **Repetir mi compra** |
| **03 — DNAture Science** | Curious guardian, veterinarian, educator, specialist | Evaluate evidence and composition | Science articles, source documents, product technical information | **Explorar la ciencia** |

**Architecture rule:** These are **experience modes** over shared catalog, product pages, checkout, account and content infrastructure—not three isolated stores.

### 2.2 Entry and switching rules [PROPOSED]

- **Unrecognized visitor:** default to **Descubrir DNAture**; provide clear **Ver productos** access immediately.
- **Recognized customer with order history:** may default to **Mi DNAture**, with a persistent **Explorar tienda** route.
- **Professional / science-seeking visitor:** can enter **Science** explicitly from navigation; no professional credentials are required to read public educational content.
- **User choice wins:** never override a manually chosen mode simply because the user has prior orders.
- **Pet profiles are optional:** a customer can browse, compare, buy and check out without creating a pet profile or completing a questionnaire.
- **Do not infer medical needs** from browsing history or claim genetic/clinical personalization without actual validated methods.
- For sensitive profile fields or cross-device persistence, obtain appropriate consent and provide edit/delete controls.

### 2.3 Shared information architecture [PROPOSED]

```text
DNAture
├─ Inicio / Descubrir
├─ Productos
│  ├─ Perros / Gatos (only where real catalog supports each)
│  ├─ Recetas Complete
│  ├─ Recetas de Trucha
│  ├─ Recetas Cocidas
│  ├─ Recetas Wild
│  ├─ Complementos Nutricionales
│  ├─ Complementos de Masticación
│  ├─ Masticables / Treats
│  └─ Suplementos
├─ Ficha de producto
├─ Buscar / Resultados
├─ Mi DNAture
│  ├─ Mis mascotas (optional)
│  ├─ Mis pedidos
│  ├─ Volver a comprar
│  ├─ Mis productos guardados (optional)
│  └─ Datos y preferencias
├─ Ciencia y aprendizaje
│  ├─ Nutrición fisiológica
│  ├─ Biblioteca de evidencia
│  ├─ Guías y preguntas frecuentes
│  └─ Recursos profesionales (future / as approved)
├─ Acerca de DNAture
├─ Ayuda y contacto
├─ Carrito
├─ Checkout
├─ Confirmación de pedido
└─ Políticas / Privacidad / Términos / Devoluciones / Entregas
```

**[VALIDATE]** Navigation labels must reflect the actual products sold and verified species eligibility. The brand book's taxonomy should not be treated as a live inventory feed.

---

## 3. Visual foundations

### 3.1 Approved primary palette [BRAND]

Source: brand book p. 31.

| Token | HEX | Use |
|---|---|---|
| `brand.teal` | `#00A9B5` | Brand recognition, highlights, graphic motifs, selected surfaces |
| `brand.orange` | `#FF6A00` | Energy, branded accent, feature emphasis, promotional moments |
| `brand.gray` | `#B2B2B2` | Secondary neutral accents (not default body copy) |
| `brand.charcoal` | `#3C3C3B` | Neutral dark, editorial text and strong contrast surfaces |

### 3.2 Approved category palette [BRAND]

Source: brand book p. 32. **Category colors signal product families, not nutritional approval or safety.**

| Product family | HEX | Token |
|---|---|---|
| Masticables | `#426D36` | `category.masticables` |
| Recetas Complete | `#84A341` | `category.complete` |
| Recetas de Trucha | `#742019` | `category.trucha` |
| Complementos de Masticación | `#8E3485` | `category.masticacion` |
| Suplementos | `#531845` | `category.suplementos` |
| Recetas Wild | `#124563` | `category.wild` |
| Recetas Cocidas | `#4E8997` | `category.cocidas` |
| Treats | `#CA6C2A` | `category.treats` |
| Complementos Nutricionales | `#D8A73C` | `category.complementosNutricionales` |

**Color usage rules [PROPOSED]**

- Keep the institutional turquoise recognizable across all modes; category colors should **not** replace the global brand identity.
- Use category colors on labels, small bands, selectors and product-family identifiers; avoid making every product card an intensely colored billboard.
- Information must never depend on color alone. Always include the category name and appropriate functional labeling.
- Use `#124563` as a dark editorial/systems surface when needed; it is an **approved category color** repurposed as a proposed UI surface, not a new brand-primary color.
- **Accessibility caveat:** white small text on `#00A9B5` or `#FF6A00` yields only approximately **2.9:1** contrast. Prefer very dark text on those bright colors, or put white text on a darker approved surface such as `#124563`. Check each pairing at implementation time.

### 3.3 Semantic UI tokens [PROPOSED]

The brand book does not define a complete digital semantic palette. The following is a suggested mapping, not approved official color standards.

```css
:root {
  /* Brand book colors */
  --dn-brand-teal: #00A9B5;
  --dn-brand-orange: #FF6A00;
  --dn-brand-gray: #B2B2B2;
  --dn-brand-charcoal: #3C3C3B;

  /* Category colors */
  --dn-category-masticables: #426D36;
  --dn-category-complete: #84A341;
  --dn-category-trucha: #742019;
  --dn-category-masticacion: #8E3485;
  --dn-category-supplements: #531845;
  --dn-category-wild: #124563;
  --dn-category-cocidas: #4E8997;
  --dn-category-treats: #CA6C2A;
  --dn-category-nutritional-complements: #D8A73C;

  /* Proposed interface tokens */
  --dn-text-primary: #203237;
  --dn-text-secondary: #596F73;
  --dn-surface-base: #FFFFFF;
  --dn-surface-warm: #FFFDF8;
  --dn-surface-muted: #F5F7F4;
  --dn-border-default: #D8E4E1;
  --dn-action-primary-bg: #124563;
  --dn-action-primary-text: #FFFFFF;
  --dn-action-accent-bg: #FF6A00;
  --dn-action-accent-text: #203237;
  --dn-focus-ring: #124563;
  --dn-overlay: rgba(17, 45, 53, .56);
}
```

**[VALIDATE]** Error, success, warning and disabled semantic colors should be accessibility-tested and approved separately. A category's green or red must not double as success/error meaning by accident.

### 3.4 Typography [BRAND + PROPOSED]

Brand book pp. 39–41:

- **Primary:** **Avenir Next LT Pro** [BRAND].
- **Secondary / display:** **Gotham Ultra** [BRAND].
- **Alternative shown:** **Arial Bold** [BRAND].
- **Web implementation:** license and host/use approved fonts correctly; do not assume system devices have the named families [VALIDATE]. Suggested fallback: `"Avenir Next", Avenir, "Segoe UI", Arial, sans-serif` [PROPOSED].

| Role | Proposed desktop | Proposed mobile | Guidance |
|---|---|---|---|
| Display / hero | 56–72px, 1.05 line-height | 36–44px | Avenir Next heavy; short message |
| H1 | 44–56px, 1.1 | 32–36px | One per view; no long technical copy |
| H2 | 32–40px, 1.15 | 26–30px | Strong section landmarks |
| H3 | 22–26px, 1.25 | 20–22px | Product/feature sections |
| Body | 16–18px, 1.55–1.65 | 16px, 1.55 | Primary reading style |
| Supporting copy | 14px, 1.5 | 14px | Short labels and helper copy |
| Overline / eyebrow | 11–12px | 11–12px | Sparse uppercase, controlled letter spacing |
| Price | 22–28px | 20–24px | Tabular numerals where available |

**Rules [PROPOSED]:** Use Gotham Ultra for short headlines or expressive campaign moments, not for long passages. Avoid tiny copy in nutrition tables. Never encode the whole design as uppercase text.

### 3.5 Layout, spacing and elevation [PROPOSED]

| Foundation | Proposed token / rule |
|---|---|
| Spacing scale | `4, 8, 12, 16, 24, 32, 48, 64, 80px` |
| Content max-width | `1280px` for commerce; `760px` for editorial reading |
| Desktop container gutter | `32px` (can scale to `48px`) |
| Mobile container gutter | `16–20px` |
| Desktop grid | 12 columns |
| Tablet grid | 8 columns |
| Mobile grid | 4 columns |
| Card gap | `16–24px` |
| Button/input min-height | `44–48px` |
| Card radius | `16px` |
| Primary button radius | `12px` |
| Hero / editorial panel radius | `24px` |
| Borders | `1px` low-contrast neutral |
| Shadow | Soft and restrained; not a substitute for separation or contrast |

**Responsive reference breakpoints [PROPOSED]:** mobile `<640px`; tablet `640–1023px`; desktop `≥1024px`. Adapt by available space and content, not device brand.

### 3.6 Logo, imagery and illustration [BRAND]

- Use the **approved monochromatic logo**, not the older two-color version as the primary mark (pp. 19–25).
- Use supplied horizontal or vertical logo variants as context permits, keeping clear space and legibility (pp. 22–30); **do not redraw the logo with ordinary text**.
- Do not stretch, rotate, recolor arbitrarily, apply decorative effects, or place the logo on insufficient-contrast backgrounds (pp. 26–30).
- Photography should be authentic, emotionally connected, natural and everyday, featuring **realistic dogs and cats rather than anthropomorphic portrayals** (pp. 36–37).
- Favor natural gestures, owners with pets, documentary/editorial framing, clean color treatment, and breathing space for typography (pp. 36–37).
- Engraved/linear illustrations of animals and ingredients belong to the packaging language and can inform restrained interface accents (pp. 42–54).
- **[PROPOSED]** Treat the hanging brand tab as an occasional signature motif, not a decoration attached to every card or component.

### 3.7 Motion and interaction [PROPOSED]

- Micro-interactions: `120–200ms`; panel transitions `200–300ms`.
- Prefer opacity and small transforms over excessive parallax.
- Provide `prefers-reduced-motion` support.
- Never animate a critical error, availability condition, or payment confirmation in a way that hides important information.
- Keep scroll position stable when filters, product variants, or experience modes change.

---

## 4. Voice and content system

### 4.1 Voice attributes [BRAND]

From pp. 11–14: **científica y experta; cálida y empática; responsable y protectora; educativa y transparente; apasionada por los animales.** The brand book recommends speaking with scientific authority without rigidity, educating without imposing, and avoiding empty or exaggerated marketing language.

### 4.2 Copy rules [BRAND]

- Explain **why** something matters rather than relying on generic quality claims.
- Say **“nutrición fisiológica”** or another supported, precise phrase when that meaning is intended; avoid vague “natural food” positioning.
- Use the portfolio vocabulary: **Recetas Complete**, **Recetas de Trucha**, **Recetas Cocidas**, **Recetas Wild**, **Complementos Nutricionales**, **Complementos de Masticación**, **Masticables**, **Treats**, **Suplementos**.
- Per p. 14, avoid positioning words such as **BARF**, **huesos carnosos**, **presas completas**, generic **snacks** for functional items, and unqualified marketing claims.
- Keep language human, clear, non-alarmist and respectful of guardians.

### 4.3 Component copy examples [PROPOSED]

| Context | Suggested Spanish copy |
|---|---|
| Newcomer hero | **Su nutrición empieza por conocerlo.** |
| Newcomer main CTA | **Empezar por mi mascota** |
| Catalog escape hatch | **Ver todos los productos** |
| Returning hero | **Menos pasos. Más tiempo juntos.** |
| Reorder CTA | **Repetir mi compra** |
| Science hero | **La confianza necesita evidencia.** |
| Expand technical content | **Ver composición y detalles** |
| Explain a claim | **¿Por qué es importante?** |
| Empty cart | **Tu carrito está vacío. Explora los productos cuando quieras.** |
| Order success | **Recibimos tu pedido. Estos son los próximos pasos.** |

**[VALIDATE]** Any product-specific benefit statement, testimonial, evidence citation, feeding instruction, or veterinary claim requires substantiation before publishing.

---

## 5. Component library

The following are reusable interface components. Names use PascalCase for handoff; actual frameworks and naming conventions can change.

### 5.1 Foundation components [PROPOSED]

| Component | Variants | States / behavior |
|---|---|---|
| `Button` | primary, accent, secondary, ghost, destructive | default, hover, focus, loading, disabled |
| `IconButton` | compact, standard | accessible label, pressed where relevant |
| `TextField` | text, email, phone, password, numeric | empty, valid, error, disabled |
| `Select` / `RadioGroup` / `Checkbox` | default, card-selection | selected, focus, disabled, error |
| `Tabs` / `SegmentedControl` | 2–4 options | keyboard accessible; active state announced |
| `Badge` | family, informational, stock, status | always readable without relying on color |
| `Accordion` | single/multiple open | named button, expanded semantics |
| `Dialog` / `Drawer` | informational, confirmation, cart | focus trap, escape close, focus return |
| `Toast` / `InlineAlert` | success, error, neutral | non-blocking; important messages persistent |
| `Skeleton` / `Spinner` | card, page, action | meaningful loading feedback |
| `EmptyState` | cart, results, orders, profiles | next-best action |
| `Pagination` / `LoadMore` | pages, button | preserves filtering and orientation |
| `Breadcrumbs` | product, category, article | semantic links and last-item label |

### 5.2 Commerce components [PROPOSED]

| Component | Required information / capability |
|---|---|
| `SiteHeader` | official logo, catalog, science/help route, search, cart count, mobile navigation |
| `SearchBox` | search suggestions where useful, clear action, keyboard support |
| `CategoryTile` | family name, approved category accent, description, browse action |
| `ProductCard` | real image, name, price, volume/weight where relevant, functional type, stock state, product link |
| `ProductGrid` | responsive columns, predictable ordering, loading and empty states |
| `Filters` | species, category, role, price, actual supported attributes |
| `ProductGallery` | photos, zoom, accessible alt text, thumbnails |
| `VariantSelector` | pack size, ingredient/recipe or other real variant types |
| `QuantityStepper` | min/max, out-of-stock limits, keyboard control |
| `NutritionTypeLabel` | complete / complementary / specialist-role wording backed by product data |
| `CartLineItem` | product, chosen variant, quantity, unit/line price, remove action |
| `CartSummary` | subtotal, delivery estimate where available, discounts, tax, final total at checkout |
| `CheckoutForm` | guest checkout, customer contact, delivery method, payment integration |
| `OrderConfirmation` | order identifier, contents, payment result, next steps |

### 5.3 Signature DNAture components [PROPOSED]

| Component | Purpose | Notes |
|---|---|---|
| `ExperienceSwitcher` | Move among Discover, My DNAture and Science | Never trap the visitor in a mode |
| `SpeciesPicker` | Start discovery with dog or cat | Only show eligible products; browse-all alternative |
| `PetPassportCard` | Display and optionally edit pet profile | Name, species, optional attributes; consent controls |
| `GuidedDiscovery` | Short optional preference flow | Not a medical diagnosis or genetic test |
| `WhyLayer` | Explain each meaningful claim in layers | Simple → Details → Evidence |
| `NutritionRoleCard` | Clarify what a product is **for** | Based on approved composition and labeling |
| `EvidenceReference` | Show source, date and relevance | No fabricated citations or authority badges |
| `ReorderCard` | Repeat recent purchase with correct variant | Show current price, stock and fresh totals |
| `RoutineReminder` | Optional replenishment reminder | User-controlled; never claim predicted clinical need |
| `VetShareSummary` | Share a product's verified data | Export/share, not a treatment recommendation |

---

## 6. Critical component specifications

### 6.1 `ExperienceSwitcher`

- **Purpose:** Switch between three distinct presentation priorities without fragmenting navigation.
- **Desktop:** compact segmented control or clearly labeled top-level navigation area.
- **Mobile:** accessible tab/dropdown; don't consume the whole viewport above the hero.
- **State:** `mode = discover | mine | science`.
- **Rule:** choosing a mode does not remove the regular catalog, search, cart, or checkout.
- **Acceptance:** each mode has a unique headline and priority action; shared checkout and basket are consistent.

### 6.2 `ProductCard`

Required UI anatomy: image → product family label → verified product name → net quantity → verified price → intended role/status → action. Optional: review score **only if authentic reviews are available**.

States: available, low availability (only with real inventory), unavailable, selected variant, loading, error. For unavailable items, explain the state and provide a browse alternative.

**Non-negotiable:** Avoid making a complementary or specialist-use product appear interchangeable with a complete diet.

### 6.3 `ProductDetail`

Minimum sections:

1. Name, verified images, price, size/variant, availability.
2. Explicit product role (complete, complementary, functional/specialist as applicable).
3. Species and use information, based on verified product data.
4. Ingredients, composition, relevant analysis, storage and feeding directions where provided.
5. How to use and what to consider; veterinary disclaimer where truly relevant.
6. `WhyLayer`: accessible explanations and documented source links.
7. Add-to-cart and cart confirmation feedback.

For specialist formulas, never hide a material usage restriction inside an accordion.

### 6.4 `WhyLayer` — progressive evidence

```text
[Simple]    ¿Qué es y para qué sirve?
[Detalles]  ¿Qué contiene y cómo se utiliza?
[Evidencia] ¿Qué datos o referencias respaldan esta información?
```

- These levels describe **depth of explanation**, not differing truth standards.
- Evidence tabs show only vetted material. If none exists publicly, say so rather than fabricating a citation.
- Provide plain-language definitions of technical terms.
- Content changes without losing the customer's place in the product page.

### 6.5 `PetPassportCard`

Proposed default fields: pet name, species, optional life stage, current saved products. Expand only when a clearly justified use case exists.

- Editable, optional, privacy-conscious.
- No assumption that a dog's breed, weight, or a pet's name can determine a clinically appropriate diet on its own.
- Deleting a pet profile should not block account access or prior orders.
- Provide explicit confirmation and a clear privacy explanation before saving sensitive animal-health-related context.

### 6.6 `ReorderCard`

Display the actual previously ordered product, variant, last order reference/date where appropriate, **current** availability and price, quantity control, and a clear confirmation. Reorder action must **add to the cart for review**, not place or charge for an order immediately.

If unavailable, offer the full catalog or customer support; do not silently substitute a formula.

### 6.7 `Checkout`

- Guest checkout visible and usable.
- Progressive but short form with clear input labels and inline validation.
- Currency, delivery cost, taxes, discounts and payable total apparent before placement.
- Explicit payment authorization action; no ambiguous “continue” as the final charge action.
- Do not duplicate charges on double-submit; show reliable error recovery.
- Confirmation only after the platform has verified the order result.

---

## 7. Page templates

### 7.1 First-time homepage — `DiscoverHome` [PROPOSED]

**Narrative:** understand → explore → trust → purchase.

1. **Header:** logo, Productos, Ciencia, Nosotros, Ayuda, search, cart.
2. **Hero:** authentic pet photograph, short promise, **Empezar por mi mascota**, secondary **Ver productos**.
3. **Species choice:** Perro / Gato as optional discovery shortcut.
4. **Shop by nutritional role:** clear cards explaining the distinct product families.
5. **Featured real products:** minimal card grid with correct price and role labels.
6. **“Por qué DNAture” block:** science, care, transparency, educational support.
7. **Science teaser:** one useful article/evidence explanation, never a wall of jargon.
8. **Support / FAQ / footer:** policies and easy human contact.

### 7.2 Returning homepage — `MyDNAtureHome` [PROPOSED]

**Narrative:** welcome → resume → reorder → manage.

1. **Compact welcome:** “Qué gusto verte de nuevo.” and pet context only if user saved it.
2. **Primary purchase panel:** `ReorderCard` or most recent order, with current stock and price.
3. **Your pets:** `PetPassportCard` with clear edit controls.
4. **Recent orders and status:** truthful delivery and order updates.
5. **Relevant education:** only contextually useful content, not a forced upsell.
6. **Explore full catalog:** always available.

**No order history:** show a helpful first-purchase state, not an empty dashboard.

### 7.3 Science homepage — `ScienceHub` [PROPOSED]

**Narrative:** question → explanation → evidence → related product details.

1. Editorial hero with focused claim and science-oriented visual treatment.
2. Structured topic navigation and readable articles.
3. “Cómo interpretamos la nutrición” explainer.
4. Source-backed articles and technical documentation **where available**.
5. Evidence summaries tied to specific products and document versions.
6. Contact / expert pathway with transparent credentials and scope.

### 7.4 Catalog page — `ProductListing` [PROPOSED]

Page heading, description of product family, filters, sort, product count, card grid, pagination/load more, clear filters, no-results recovery. A user must be able to compare product role and quantity without opening every item.

### 7.5 Product detail — `ProductDetail` [PROPOSED]

Image gallery and purchase panel first; relevant nutritional role and usage caveats visible before purchase; deeper details and evidence below. On mobile, a sticky add-to-cart bar is optional and must never obscure price, consent, or warnings.

### 7.6 Cart / checkout / confirmation [PROPOSED]

Keep these consistent across **all three modes**. Switching experience should not change what is in the basket or alter product prices.

---

## 8. Responsive and accessibility standards [PROPOSED]

- Target **WCAG 2.2 AA** for the public website and customer account.
- Ensure normal-size text color contrast ≥ **4.5:1** and large text ≥ **3:1**; check icon and control boundaries as applicable.
- Minimum touch target guideline: aim for **44×44px** in commerce interactions.
- Support keyboard access for navigation, pet selections, tabs, filters, modal dialogs, cart controls and checkout.
- Visible focus indication is required. Do not make hover the only means of accessing an action.
- Forms must have persistent labels, helpful errors, and semantic grouping.
- Images need meaningful alt text or decorative treatment as appropriate.
- Make product roles and stock availability understandable to screen-reader users.
- Avoid essential information embedded only inside imagery or color.
- Provide reduced-motion behavior and responsive readable text without horizontal scrolling.
- On mobile, show the highest-priority action early, while maintaining clear access to catalog and cart.

---

## 9. Content, product data and scientific trust

### 9.1 Suggested structured product model [PROPOSED]

```json
{
  "id": "verified-product-id",
  "name": "Verified product name",
  "category": "complete | trucha | cocidas | wild | ...",
  "species": ["dog"],
  "nutritionRole": "verified role on label",
  "isCompleteDiet": null,
  "ingredients": [],
  "analysis": [],
  "usageInstructions": "approved labeling text",
  "warnings": [],
  "packSize": "verified unit and quantity",
  "price": null,
  "currency": "CRC",
  "inventoryStatus": "live commerce status",
  "evidence": [{ "title": "", "url": "", "reviewedAt": "" }]
}
```

This is a **schema example**, not live catalog data or proof that all products are priced in CRC.

### 9.2 Nutrition integrity rules [BRAND + VALIDATE]

- The brand book distinguishes **Recetas Complete** from **Recetas de Trucha** and **Recetas Cocidas**; the latter are presented as different-use formulations in the portfolio overview (p. 33).
- **Do not infer** that every product is complete, appropriate for every pet, or recommended for daily use based on a similar-looking package.
- Specific health outcomes, feeding frequency, species suitability, scientific efficacy, contraindications and claims must be verified with relevant qualified experts and current packaging.
- Label `evidence` content with citation, publication/review date and scope; a generic science article is not proof of a particular product claim.
- Clarify where content is education and not individual veterinary medical advice.
- **“ADN” is a brand metaphor in this design concept**; do not claim that a pet profile performs genetic analysis or disease prediction.

### 9.3 Personalization/privacy [PROPOSED]

Ask for the minimum needed. Describe why each field helps. Separate marketing consent from basic commerce operations. Do not make unnecessary profile data a checkout requirement. Allow visitors to continue anonymously.

---

## 10. Patterns, states and failure recovery

| Situation | Required experience |
|---|---|
| New customer skips pet flow | Direct entry to catalog, no penalty |
| Returning customer not logged in | Conventional discovery; optional sign-in, no forced identity guess |
| Returning customer has no orders | Friendly empty state and “Explorar productos” |
| Search returns nothing | Show query, remove filters, browse alternatives |
| Product unavailable | Explain status, disable purchase, don't auto-substitute |
| Product requires variant | Block add-to-cart with inline instruction |
| User adds product | Cart count + accessible confirmation + view-cart option |
| Price changed since last purchase | Show **current** price on reorder before add-to-cart |
| Profile save fails | Keep draft inputs, show retry, do not claim success |
| Payment fails | Preserve safe cart data, explain retry path, prevent double payment |
| Order completed | Accurate order number and fulfillment next steps |
| Documentation missing | State availability honestly, do not invent studies |
| Internet connection unavailable | Clear message and recoverable retry, no fake success |

---

## 11. Component/page inventory by launch phase [PROPOSED]

### Phase 1 — Commerce foundation

- [ ] Official logo implementation and shared responsive navigation
- [ ] Core tokens: colors, typography, spacing, breakpoints, accessible focus
- [ ] Discover homepage, category tiles, search/catalog, product cards
- [ ] Product detail with accurate functional role and nutritional information
- [ ] Cart, guest checkout, payment recovery, order confirmation
- [ ] Contact/help, privacy, policies, loading/empty/error states
- [ ] Basic science explainer linked from relevant product pages
- [ ] Accessible mobile experience and performance budget

### Phase 2 — Relationship and repeat purchases

- [ ] Account and order history
- [ ] Optional pet profiles
- [ ] Reorder cards with current price and inventory
- [ ] Personalized returning homepage
- [ ] Optional saved items and replenishment preferences
- [ ] Transparent experience switching

### Phase 3 — Deeper evidence and professional resources

- [ ] Reviewed evidence library and documented source taxonomy
- [ ] Extended `WhyLayer` on validated products
- [ ] Shareable verified product factsheets
- [ ] Professional resource hub when demand and content are established
- [ ] Advanced contextual discovery after testing and expert approval

---

## 12. Quality and measurement [PROPOSED]

### Customer outcomes

- **Newcomers:** can users identify an appropriate *type of product* and explain the difference between complete vs complementary products?
- **Returning users:** how many interactions and how much time are needed to safely add a previously purchased item to cart?
- **Science users:** can users find the real supporting technical data, interpret its scope and return to a product without getting lost?
- **All users:** can they complete checkout on mobile with a keyboard or assistive technology and without avoidable errors?

### Suggested events (privacy-safe)

`experience_viewed`, `experience_switched`, `catalog_opened`, `species_filter_selected`, `product_viewed`, `why_layer_opened`, `reorder_add_to_cart`, `cart_reviewed`, `checkout_started`, `order_placed`, `payment_error`.

Track aggregate outcomes with appropriate consent and analytics governance. Avoid recording unnecessary pet-health details in events.

### Definition of done for a new component

- [ ] Variant and interaction states documented
- [ ] Mobile and desktop designs complete
- [ ] Keyboard, screen reader and focus behavior verified
- [ ] Correct brand/category token usage
- [ ] Color contrast validated for actual combinations
- [ ] Loading, empty and error states specified
- [ ] Spanish copy reviewed by content/design
- [ ] Product claims verified where relevant
- [ ] Component reusable across all applicable experiences

---

## 13. Decisions to confirm before production [VALIDATE]

1. **Catalog and pet applicability:** actual live SKUs, species, formulation status, labels, weights, inventory, delivery zones and pricing.
2. **Identity assets:** final approved logo files, webfont licensing and usable photography/illustration rights.
3. **Nutrition governance:** who approves product roles, descriptions, scientific citations, contraindications and document updates.
4. **Account / CRM:** authentication method, guest checkout rules, order history access, repeat-purchase functionality.
5. **Pet profile consent:** field scope, security, retention, user editing/deletion and privacy policy.
6. **Commercial model:** one-time sales, subscriptions if applicable, taxes, delivery costs, payment integrations, customer support.
7. **Professional audience:** whether the science area is public editorial content or needs a separate role-based portal.
8. **Platform constraints:** commerce stack, CMS, catalog integration, analytics and accessibility QA.

---

## 14. Source map

| Topic | Brand-book pages |
|---|---|
| Mission, vision, purpose | 3–6 |
| Brand personality and voice | 10–14 |
| Trust, customer fears, differentiation | 15–17 |
| Brand logo evolution / official tagline | 19–25 |
| Logo protections and incorrect use | 26–30 |
| Primary color palette | 31 |
| Category palette | 32 |
| Product families and roles | 33–35 |
| Photography | 36–37 |
| Typography | 39–41 |
| Packaging / illustration language | 42–54 |
| Digital/social expression | 55–64 |

**Design exploration reference:** `DNAture_Interactive_Concept.html` illustrates the three experience modes. It is a concept demo, not a functioning checkout, approved medical recommendation system, or finalized production design system.

---

**Creative direction summary:** *DNAture should use a single scientific, caring visual identity that teaches newcomers, helps returning customers act quickly, and makes deeper evidence accessible to those who need it.*
