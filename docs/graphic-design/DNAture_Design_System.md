# DNAture — Digital Design System

**Version:** 0.3 — Flat editorial website with active brand orange

**Updated:** 2026-11-09

**Scope:** Public website, catalog, product detail, customer account, educational content, cart and checkout

**Customer-facing language:** Spanish, Costa Rica

**Brand reference:** [DNAture_Brand_Reference.json](DNAture_Brand_Reference.json)

**Project requirements:** [AGENTS.md](../../AGENTS.md)

This revision replaces version 0.1's visual system. The website uses an open editorial layout: **no card-based composition, no elevation, and no rounded UI borders or corners**. Hierarchy comes from typography, alignment, imagery, spacing, and dividing rules. These constraints apply across the whole website, including mobile layouts, forms, account views, and temporary interface states.

## 1. Authority and scope

| Label | Meaning |
|---|---|
| **[BRAND]** | Specified or supported by the brandbook; page references use 1-based PDF positions. |
| **[REQUIRED]** | Current website direction requested by the user or required by AGENTS.md. Apply when designing or modifying the interface. |
| **[PROPOSED]** | An implementation recommendation or optional feature; it must satisfy all required rules. |
| **[VERIFY]** | An asset, product fact, claim, or operational detail that needs current evidence before use. |

Apply current task instructions and AGENTS.md first, then this document's website requirements, then compatible brandbook guidance. The JSON reference preserves the original brandbook, its contradictions, and the current project adaptations. This document governs the website's updated visual treatment. Brand orange has the explicit exception defined below. Rounded panels, other warm accents, or elevated compositions in older mockups do not establish further exceptions.

The brandbook is a source for identity and communication. Its product examples, nutritional statements, seals, and packaging mockups are not a live catalog or proof of current efficacy, certification, or availability. Feature names and page templates below describe a design direction; they do not imply those features already exist.

## 2. Brand intention translated into the website

**Official tagline [BRAND]:** “Nutrición con esencia en el ADN” (pp. 20–21). Preserve this wording. Campaign headlines support it without becoming alternative official taglines.

DNAture combines the **Sabio** and **Cuidador** archetypes: reliable knowledge, clear explanation, empathy, and ongoing care (pp. 10–17). The website should feel like a thoughtful nutritional publication with a clear path to purchase. Scientific authority comes from understandable information and traceable evidence. Human connection comes from language, real animals, and their relationships with their guardians.

| Brand intention [BRAND] | Website expression [PROPOSED] |
|---|---|
| Scientific rigor | Precise headings, aligned information, readable composition tables, explicit sources. |
| Education | One useful question per section, short explanations, links to deeper material. |
| Empathetic care | Reassuring copy, authentic animal photography, understandable next steps. |
| Individual biology | Clear product roles and verified suitability; optional context gathering where useful. |
| Transparency | Visible ingredients, limitations, availability, prices, and evidence scope. |
| Community and accompaniment | Accessible support, meaningful stories, and continued learning. |

**Composition principles [REQUIRED]**

- Build continuous pages with open sections, shared alignment, and clear reading order.
- Use typography and proximity to group content. Add a dividing rule when a relationship needs clarification.
- Give photographs and engravings room to communicate the brand; balance them with readable text.
- Keep buying, learning, and requesting support easy to discover through descriptive links.
- Distinguish complete, complementary, and specialist-use products using verified data and explicit text.
- Preserve the same visual grammar as content density increases in the catalog, account, and checkout.

## 3. Non-negotiable visual rules [REQUIRED]

### 3.1 No card-based layout

A card is a self-contained content island created by an enclosing surface, border, padding, or elevation. **Square cards are also prohibited.** Removing a radius or shadow from an existing card does not satisfy this direction.

Do not use product cards, category tiles, feature boxes, dashboard widgets, testimonial cards, profile cards, boxed statistics, or nested content panels. Do not create the same effect with separate tinted rectangles behind repeated items.

Use these patterns instead:

| Content | Required presentation |
|---|---|
| Products | Open, aligned product entries on one continuous section surface; image, name, role, price, and action remain visibly associated. |
| Product families | An index of named rows with a short explanation and browse link. |
| Brand benefits | A typographic list or editorial columns separated by spacing or rules. |
| Articles and evidence | An editorial index with headings, summaries, metadata, and descriptive links. |
| Pets, orders, saved items | Labeled records in divided lists; tables where the information is genuinely tabular. |
| Testimonials | Attributed quotations in the page flow, paired with authentic imagery when available. |
| Metrics | Aligned figures and labels, without individual boxes. |
| Forms | Open field groups with legends/headings and consistent vertical rhythm. |

Grids remain useful for alignment. A product grid may contain several columns, but entries share the page background and have no enclosing item border, shadow, decorative frame, or per-item surface. At narrow widths, entries reflow into one readable stream; they do not become a horizontal card carousel.

### 3.2 Flat surfaces and zero elevation

- Use no decorative `box-shadow`, `text-shadow`, drop-shadow filter, inset shadow, bevel, glow, glass effect, or simulated depth.
- Hover, selected, active, loading, and focus states must remain flat. No lift, tilt, scale-up, or expanding shadow on hover.
- Use full-width section bands or broad continuous page regions when a surface change supports the story. Avoid alternating backgrounds mechanically around every small content group.
- Use horizontal or vertical rules to separate content. Full enclosing borders belong to functional controls and overlays where needed, not to content groups.
- Dialogs, menus, drawers, and sticky controls may occupy a functional stacking layer. Their visual treatment stays square and shadow-free. A plain dimmed backdrop may distinguish a modal; do not add backdrop blur.
- Focus uses a visible outline or other clear non-shadow indicator. Flattening the visual design must never remove focus feedback.

### 3.3 Square geometry

All authored interface containers, buttons, text fields, selects, menus, dialogs, drawers, media frames, thumbnails, and skeletons use **`border-radius: 0`**. There are no pill buttons, pill filters, rounded badges, circular avatar crops, or rounded hero panels. Status labels are text with an optional icon, not capsules.

Preserve the intrinsic geometry of supplied logo artwork, illustrations, real product packaging, and photographs. Do not distort a logo or retouch a package to make its printed artwork square. Do not recreate the brandbook's curved hanging tab as a UI container or clip-path. The website's recurring section signature is the shared `SectionEyebrow`.

Native selection indicators and functional icon shapes retain their recognizable meaning. A native radio indicator is not a decorative rounded container; keep its semantics and keyboard behavior. Do not place controls or icons inside circular background treatments. Authored control frames and hit-area backgrounds remain square.

### 3.4 Cool foundations with active brand orange

Use cool white, blue-gray, institutional turquoise, dark blue, and neutral text as the foundations. **DNAture brand orange `#FF6A00` is an explicit brand-color exception, excluded from the website's warm-color prohibition.** It is a recurring part of the site's identity and interaction hierarchy, not an accent reserved for `SectionEyebrow`.

Give orange a visible role in primary calls to action, active navigation and selection accents, editorial highlights, meaningful counters, and occasional continuous section bands. Use it to draw attention to a next step or important idea. Maintain clear priority within each action group rather than making every action equally prominent.

The exception applies to the exact brand orange. Warm whites, cream, beige, yellow, unrelated oranges, and other warm UI tones remain prohibited. Do not create peach or cream surfaces by tinting orange. Cool/neutral surfaces remain the main reading areas. Orange elements follow the same square geometry, open layout, and zero-elevation rules as the rest of the site.

Product photography and approved artwork should accurately show the real product. Their intrinsic colors do not authorize additional warm interface colors beyond the explicit brand-orange exception.

## 4. Visual foundations

### 4.1 Color roles

The brandbook defines institutional turquoise `#00A9B5`, orange `#FF6A00`, gray `#B2B2B2`, and charcoal `#3C3C3B` (p. 31). It also defines nine category colors (p. 32). The complete source palette is preserved in the JSON reference under `visual_identity.color`.

**[REQUIRED]** Do not import the entire category palette as website UI colors. Category names carry meaning in text. The institutional orange `#FF6A00` exception does not authorize the distinct Treats orange `#CA6C2A`, yellow, or other warm category colors as UI accents. Category color is never evidence of nutritional role or suitability.

| Website role | Value [PROPOSED] | Use |
|---|---|---|
| Institutional turquoise | `#00A9B5` [BRAND] | Recognizable graphic accents and occasional continuous section surfaces. |
| Brand orange | `#FF6A00` [BRAND; explicit UI exception] | Primary calls to action, editorial emphasis, navigation accents, counters, and occasional continuous section bands. |
| Dark blue | `#124563` [BRAND category color] | Headings, supporting actions, dark editorial sections, and an alternative action on orange surfaces; this UI role is a digital adaptation. |
| Base | `#FFFFFF` | Main reading and commerce surface. |
| Cool surface | `#F6FAFF` | Broad editorial regions. |
| Muted surface | `#F1F5F9` | Broad secondary regions or restrained interaction feedback. |
| Primary text | `#203237` | Body copy and dark text on turquoise or orange. |
| Secondary text | `#596F73` | Supporting copy on light surfaces. |
| Dividing rule | `#D9E4ED` | Nonessential separators on light surfaces. |
| Control boundary | `#667F8B` | Visible input/control boundaries on light surfaces. |
| Inverse text | `#FFFFFF` | Text and focus outlines on dark blue. |

Use dark blue or primary text for normal-size text on white. Use white text on dark blue, and primary dark text on turquoise or orange. `#203237` on `#FF6A00` has approximately **4.65:1** contrast. White on orange is only **2.87:1**, and dark blue `#124563` on orange is **3.56:1**; neither is the default for normal-size button text. White text on institutional turquoise is also insufficient for normal-size text. Check every actual pairing and interaction state.

Orange text or an orange-only functional indicator on white is insufficient for its respective text/non-text contrast target. Keep navigation labels and functional icons dark; pair an orange accent with an independently clear active state such as a dark underline or meaningful label. Focus outlines remain dark on light/orange surfaces and light on dark surfaces. Preserve the exact orange during hover and pressed states; use a dark border, underline, or icon change instead of lowering opacity or adding unapproved warm shades.

**Orange participation [REQUIRED direction; specific placements PROPOSED]**

| Context | Orange role | Supporting treatment |
|---|---|---|
| Homepage hero | Primary discovery or catalog action | Orange square button with primary dark text; supporting links remain quieter. |
| Product detail and checkout | Main purchase or progression action | Clear dark label, stable pending state, and visible focus. |
| Navigation and filters | Accent beside an active item or selected state | Dark labels and an additional clear state cue; no pill track or enclosed filter tiles. |
| Editorial content | Short highlight behind dark text, graphic rule, or section marker | Preserve heading semantics and reading contrast. |
| Cart or result count | Compact square orange fill with a dark numeral when emphasis is useful | Accessible count in context; no circular badge or standalone orange text on white. |
| Closing or campaign section | Occasional broad orange band | Dark readable copy and a dark-blue action with white text; no inset panel or repeated orange item boxes. |

Orange should be evident beyond eyebrow markers in major journeys. Use it with turquoise as part of the recognizable brand palette, while keeping long-form reading surfaces calm. These roles do not change the primary monochromatic logo rule.

Use text, icons, and semantics to communicate success, errors, warnings, and stock. A restrained dark status color may be shared when wording and icons clearly distinguish states. Brand orange communicates brand emphasis; do not reserve it for warnings or assign automatic success/error meaning to it. Other warm alert fills remain prohibited.

### 4.2 Token contract

**[REQUIRED]** Geometry and spacing below define the website direction. **[PROPOSED]** Semantic color assignments and container sizes are implementation values. Reuse and reconcile existing tokens during implementation; do not create competing aliases for the same role. This documentation change does not itself migrate application CSS.

```css
:root {
  --dn-space-1: 4px;
  --dn-space-2: 8px;
  --dn-space-3: 12px;
  --dn-space-4: 16px;
  --dn-space-6: 24px;
  --dn-space-8: 32px;
  --dn-space-12: 48px;
  --dn-space-16: 64px;
  --dn-space-20: 80px;

  --dn-radius: 0;
  --dn-shadow: none;
  --dn-page-gutter: var(--dn-space-4);
  --dn-content-max: 1280px;
  --dn-reading-max: 760px;

  --dn-brand-teal: #00A9B5;
  --dn-brand-orange: #FF6A00;
  --dn-brand-charcoal: #3C3C3B;
  --dn-surface-base: #FFFFFF;
  --dn-surface-cool: #F6FAFF;
  --dn-surface-muted: #F1F5F9;
  --dn-surface-dark: #124563;
  --dn-surface-emphasis: var(--dn-brand-orange);
  --dn-text-primary: #203237;
  --dn-text-secondary: #596F73;
  --dn-text-inverse: #FFFFFF;
  --dn-border-default: #D9E4ED;
  --dn-border-control: #667F8B;
  --dn-action-primary-bg: var(--dn-brand-orange);
  --dn-action-primary-text: var(--dn-text-primary);
  --dn-action-alternative-bg: #124563;
  --dn-action-alternative-text: #FFFFFF;
  --dn-focus-ring: #124563;
  --dn-focus-ring-inverse: #FFFFFF;
  --dn-overlay: rgb(17 45 53 / 56%);

}

@media (min-width: 640px) {
  :root { --dn-page-gutter: var(--dn-space-6); }
}

@media (min-width: 1024px) {
  :root { --dn-page-gutter: var(--dn-space-8); }
}
```

Use the shared brand-orange token for its action and surface roles; avoid parallel hardcoded orange values. Remove prohibited warm-surface aliases. Apply zero radius and no shadow to component styles and all their states; declaring tokens alone is insufficient. Do not use a universal reset to erase native affordances, focus indicators, or the geometry inside supplied artwork.

### 4.3 Spacing and layout rhythm

**[REQUIRED]** All spacing uses the shared `4, 8, 12, 16, 24, 32, 48, 64, 80px` scale. Zero is allowed for resets and flush alignment. Font sizes, stroke widths, media aspect ratios, and container widths have their own roles and are not spacing tokens.

| Relationship | Default [PROPOSED] |
|---|---|
| Page gutter | 16px narrow, 24px intermediate, 32px wide; use shared tokens. |
| Content width | Up to 1280px, centered within fluid gutters. |
| Long-form reading width | Up to 760px; constrain paragraphs further when needed for a comfortable line length. |
| Section padding | 48px narrow, 64px intermediate, 80px wide. |
| Compact utility section | 32px narrow, 48px wide. |
| Eyebrow to heading | 16px. |
| Heading to introductory text | 16px. |
| Introduction to section content | 24px narrow, 32px wide. |
| Related item gap | 24px; 32px when imagery needs more room. |
| Major editorial column gap | 32px narrow, 48px wide. |
| Divided row padding | 16px or 24px vertically, consistent within the list. |

Use shared alignment lines for headings, imagery, lists, and actions. Vary the proportion of an image and text column to fit the story. Avoid making every section a repeated three-column composition. Vertical dividers on wide layouts become horizontal separators when content stacks.

Breakpoints at 640px and 1024px are reference points, not fixed device targets. Adjust layout when content no longer fits; preserve DOM reading order. At narrow widths, prefer one product column when two would compromise names, prices, roles, or controls. Keep utility actions reachable without horizontal page scrolling.

### 4.4 Typography

**[BRAND]** Primary: **Avenir Next LT Pro** (p. 39). Secondary: **Gotham Ultra** (p. 40). Alternate: **Arial Bold** (p. 41).

**[VERIFY]** Use licensed font files and weights that actually exist. The suggested body fallback stack is `"Avenir Next", Avenir, "Segoe UI", Arial, sans-serif` [PROPOSED]. Do not substitute body Arial with Arial Bold merely because the brandbook names the latter as an alternate.

| Role | Narrow / wide sizes [PROPOSED] | Treatment |
|---|---|---|
| Display / hero | 36–44px / 56–72px | Short headline, strong weight; line-height 1.1–1.15. |
| Page H1 | 32–36px / 44–56px | One descriptive page heading; line-height 1.15. |
| Section H2 | 26–30px / 32–40px | Clear section landmark; line-height 1.2. |
| H3 / entry heading | 20–22px / 22–26px | Distinguish entries without enclosing them; line-height 1.3. |
| Body | 16px / 16–18px | Avenir regular; line-height 1.6. |
| Supporting text | 14px | Brief helper copy and metadata; line-height 1.5. |
| Section eyebrow | Shared component style | Short descriptive label; uppercase treatment belongs to the component. |
| Price / key figure | 20–24px / 22–28px | Clear units and currency; tabular numerals where available. |

Use Gotham Ultra for occasional short emphasis. Sentence case supports longer reading. Avoid long all-caps paragraphs, justified body text, excessively tight tracking, and truncated product names. Fluid sizing must preserve legibility at enlarged text sizes. Never select a heading level merely to obtain its visual size.

### 4.5 Section signature

**[REQUIRED]** Every new landing-page content section includes [`SectionEyebrow`](../../components/section-eyebrow.tsx). Use a descriptive label such as “Nuestra nutrición”, “Ingredientes”, or “Ciencia y aprendizaje”, with no sequence numbers. It introduces the section's real heading; it is not a substitute for semantic heading structure.

Use the default dark tone on light surfaces and `tone="light"` on dark surfaces. Use `color` and `lineColor` when a colored background requires a different contrast pairing. On an orange surface, use primary dark text and a dark marker so the signature stays visible. The default orange marker participates in the broader orange system. Reuse the component; do not add duplicate eyebrow markup, circular orange dots, or custom numbered labels.

### 4.6 Logo, photography, illustration, and icons

**[BRAND]** Use supplied monochromatic logo artwork, with the horizontal mark as primary and the stacked mark where appropriate (pp. 19–30). Preserve proportions and clear space. The book specifies minimum widths of 250px with the horizontal tagline, 155px for the horizontal mark without it, and 35px for the compact stacked mark; inspect the appropriate asset and its actual legibility. Do not redraw the wordmark with text or guess the numeric clear-space ratio.

**[BRAND]** Photography is authentic, natural, and emotionally connected: realistic dogs and cats in everyday settings, with genuine expressions and human relationships (pp. 36–37). Use clean color, balanced contrast, and useful space for text. Avoid dressed-up animals, forced poses, comic accessories, and oversaturation.

**[BRAND]** Engravings use detailed line work and recognizable animals or ingredients, with a scientific and timeless character (pp. 43–54). They can anchor a section or explain a specific ingredient.

**Website treatment [REQUIRED]**

- Place imagery directly in the composition with square edges or a natural transparent cutout. Use no rounded masks, circular crops, decorative mats, borders around each product image, or added drop shadows.
- Place image captions in the document flow. If text overlays a photograph, provide a readable continuous treatment without a floating caption box.
- Keep product representations accurate. A photographic shadow already in an authentic product image is not permission to add CSS elevation.
- Reuse suitable approved assets. Do not mix engraving, cartoons, and unrelated illustration systems within one narrative.
- Use individual `lucide-react` icons for interface actions; brand engravings serve content and identity roles. Hide decorative icons from assistive technology when the accompanying control already has an accessible name.

## 5. Layout patterns [REQUIRED]

### 5.1 Editorial section

An editorial section has one clear purpose: shared eyebrow, heading, short explanation, supporting imagery or evidence, and a relevant link. Its content sits directly on the page surface. On wide screens, an introduction may occupy one column beside a larger photograph or divided list. On mobile, the same material follows a single meaningful reading order.

A broad dark-blue, turquoise, or brand-orange band can mark a substantial narrative transition. It extends across a continuous region and has square edges. Use the corresponding readable text/action pairings. Do not turn the band into an inset rounded panel or repeat it behind every item.

### 5.2 Product collection

Use a semantic list of open entries aligned to a shared grid. Align image areas, names, prices, and actions consistently while allowing natural text height. Each entry groups its own information through proximity and spacing. It has no separate background, outline, or shell padding that makes it read as a tile.

Product imagery sits directly on the common surface. Link the image/name clearly to product details and keep purchase controls distinct. Do not make a container-level click handler compete with nested links or buttons. A shared row separator may organize longer collections.

### 5.3 Index and record lists

Use divided rows for product families, articles, evidence, orders, profiles, and saved products. A row may have a thumbnail or engraving, a title and description, metadata, and an action. Columns stack naturally on mobile; the title and its action remain associated. The divider belongs to the list structure, not an enclosing box around each record.

### 5.4 Technical information

Use definition lists for labeled facts and real tables for comparisons or guaranteed analysis. Keep units, sources, and headings explicit. Optional detailed explanations may use native disclosure patterns. Essential product restrictions, price, and suitability information remain visible before purchase.

### 5.5 Forms and transactional layouts

Use open field groups with visible labels and legends. Separate form sections with spacing and, when useful, a heading or rule. A desktop order summary may sit beside the form as an aligned column with a dividing rule; it is not an enclosed summary card. On mobile, it enters the normal reading order.

## 6. Components and interactions

Component names below describe the target design vocabulary [PROPOSED]. Existing implementations must be reviewed by their rendered structure; renaming a component alone does not remove a card layout.

### 6.1 Foundation components

| Component | Required visual and behavioral contract |
|---|---|
| `SectionEyebrow` | Reuse the shared component and contrast rules in section 4.5. |
| `Button` | Square brand-orange primary action with dark text; dark-blue alternative with white text, outlined secondary action, or text action. No radius, shadow, or hover movement. |
| `IconButton` | Square target, clear accessible name, optional flat hover fill; no circular backplate. |
| `TextField` / `Select` | Square visible boundary, persistent label, help/error association, clear focus. |
| `RadioGroup` / `Checkbox` | Native control semantics with label-led rows; no selectable cards. |
| `Tabs` | Text labels with a clear underline/indicator and appropriate keyboard behavior; no pill track. |
| `StatusLabel` | Plain text with an optional meaningful icon; no pill or decorative badge enclosure. A compact square numeric counter may use orange with dark text. |
| `Disclosure` | Divided rows with native `details`/`summary` where suitable, or an accessible disclosure button. |
| `Dialog` / `Drawer` | Square, shadow-free functional overlay; accessible name, managed focus, dismiss action, and focus return. |
| `InlineStatus` / `InlineAlert` | Message near the affected action, with an icon or rule where useful; preserve important errors until resolved. |
| `LoadingPlaceholder` | Square image area and text-line placeholders within the existing layout; no card skeleton. |
| `EmptyState` | Heading, brief explanation, and useful action directly in the content flow. |
| `Pagination` / `LoadMore` | Plain links or square controls; preserve filters and page orientation. |
| `Breadcrumbs` | Semantic descriptive links with a clear current location. |

### 6.2 Commerce and content components

| Component | Required content and composition |
|---|---|
| `SiteHeader` | Logo, visible catalog/science/help access, search and cart; flat navigation with a dividing rule where needed. |
| `FamilyIndexRow` | Canonical family name, concise role description, optional engraving, descriptive browse link. |
| `ProductEntry` | Real image, family, verified name, quantity, current price, role, stock state, and action in an open entry. |
| `ProductCollection` | Responsive open grid or list, predictable ordering, loading, empty and failure states. |
| `CatalogFilters` | Labeled native controls or plain text selection rows; active filters have explicit labels and removal actions. |
| `ProductGallery` | Square image areas and thumbnails, useful alternatives, keyboard-accessible enlargement where provided. |
| `VariantSelector` | Actual variants using labeled controls; unavailable choices explained. |
| `QuantityStepper` | Square buttons and quantity field with limits, labels, and keyboard operation. |
| `NutritionRole` | Explicit, evidence-backed role as text, not a color-coded certification badge. |
| `CartLineItem` | Divided row with product, variant, quantity, unit/line price, and remove action. |
| `CartSummary` | Open aligned totals with currency, delivery, tax, discounts, and final payable total. |
| `EvidenceReference` | Source title, date, scope, and link in a citation/list format. |
| `ArticleIndexRow` | Heading, summary, topic and date where useful, optional image, descriptive article link. |

### 6.3 Relationship and optional guidance components

| Component [PROPOSED] | Contract |
|---|---|
| `ExperienceNavigation` | Plain links between discovery, account, and science routes. Use tabs only for actual in-page tabbed content. |
| `SpeciesPicker` | Labeled choices for supported species with a browse-all route; no image tiles. |
| `PetProfileRow` | Name, species, optional saved context, and edit/remove actions in a divided record list. |
| `GuidedDiscovery` | Optional short question flow with normal form groups; no diagnosis or implied genetic testing. |
| `NutritionRoleSection` | Open explanation of verified product roles, with descriptive product-family links. |
| `EvidenceExplanation` | Simple explanation, composition/details, and source material at increasing depth. |
| `ReorderRow` | Previous product and variant, current price/availability, quantity, and add-to-cart action. |
| `RoutineReminder` | User-controlled reminder with visible state and edit/remove controls, if implemented. |
| `ProductFactsSummary` | Shareable verified product data, if implemented; no unsupported treatment recommendations. |

**Product and reorder behavior [REQUIRED]**

- Keep product names, quantities, prices, and nutritional roles visible without opening a detail page.
- Distinguish unavailable, pending, and failed operations with text. Low-stock messages require actual inventory data.
- Require a variant when needed and explain invalid selections inline.
- Reorder adds the chosen current product to the cart for review. It does not place or charge for an order immediately.
- Show current prices and availability; do not silently substitute an unavailable formula.
- Publish ratings or testimonials only when authentic records exist.

### 6.4 Form rhythm and feedback

**[REQUIRED]** Apply the same patterns to contact, account, pet profiles, catalog controls, and checkout.

| Relationship | Shared value |
|---|---|
| Label to control | 8px |
| Control to helper/error text | 8px |
| Field group to next field group | 24px |
| Form section to next section | 32px |
| Final field group to action row | 24px |
| Actions within a row | 16px, wrapping when needed |
| Text control internal padding | 12px vertical, 16px horizontal |
| Standard action/control minimum height | 48px |

Associate errors and help with their fields. During an asynchronous action, show a pending label, prevent duplicate submissions, and keep the layout stable. Announce completion with `role="status"` or a suitable live region; use `role="alert"` for urgent errors. Restore controls when the operation settles and preserve input after failure. Never announce success before the operation succeeds.

### 6.5 Interaction states and motion

**[REQUIRED]** Use text, underline, border, icon, or flat color changes for interaction feedback. Selection must remain recognizable without relying on color alone. Keep borders the same width across states or reserve their space to avoid layout shifts.

For buttons inline alongside other elements, show the icon without visible text on mobile and icon plus text on desktop. Retain a clear accessible name and a usable target. This rule does not remove the label from standalone primary form or purchase actions.

**[PROPOSED]** Use 120–200ms transitions for color, opacity, or a necessary disclosure change. Respect `prefers-reduced-motion`; remove nonessential animation. Avoid parallax, decorative scroll reveals, hover lifting, and image zoom effects. A menu's functional appearance must not obscure focus or delay access. Keep scroll position stable after filtering or changing a variant.

## 7. Page composition

### 7.1 Shared navigation and information architecture

**[REQUIRED]** Important public pages are discoverable through main navigation, the footer, and contextual links. Links are crawlable and descriptive. Use real navigation links for page destinations; do not rely on client-only experience switching to expose content.

**Proposed primary navigation:** Productos · Ciencia y aprendizaje · Nosotros · Ayuda, with search, account, and cart utilities. Use the current route structure and verified catalog when implementing.

Preserve the nine canonical family names: **Recetas Complete**, **Recetas de Trucha**, **Recetas Cocidas**, **Recetas Wild**, **Complementos Nutricionales**, **Complementos de Masticación**, **Masticables**, **Treats**, and **Suplementos**. Masticables and Treats remain distinct families. Species navigation reflects verified product eligibility.

### 7.2 Discovery homepage [PROPOSED]

**Narrative:** understand → explore → trust → purchase.

1. **Hero:** open text and photographic composition, concise message, direct product link, optional discovery action. Give the primary action visible brand-orange emphasis. Square image edge or natural cutout; no enclosing hero panel.
2. **Nutrition introduction:** eyebrow, explanatory heading, and short readable copy with one supporting engraving or image.
3. **Product-family index:** divided named rows explaining nutritional roles; optional species control remains simple and skippable.
4. **Featured products:** open collection with accurate names, roles, prices, and availability.
5. **Why DNAture:** editorial text beside authentic imagery or a divided evidence list. Each claim links to relevant support where available.
6. **Science and learning:** one substantial article introduction followed by related article rows.
7. **Help and closing action:** open FAQ disclosures, clear support route, and a continuous closing section. An orange band with dark text and a dark-blue action is an available brand expression.

Every landing-page content section includes `SectionEyebrow`. Vary image scale and text density deliberately while maintaining shared gutters and a clear heading hierarchy.

### 7.3 Returning-customer account [PROPOSED]

**Narrative:** welcome → resume → reorder → manage.

Use a compact welcome, a divided reorder list, pet records if saved, and recent orders with clear status. Account navigation is a text list or simple route navigation. Avoid widget dashboards and statistic tiles. When order history is empty, provide a helpful explanation and a catalog link. Pet profiles are optional; removing a profile must not block account access or order history.

Discovery, account, and science are audience contexts over one catalog and checkout. An explicit choice of route takes precedence over inferred preferences. Do not redirect a visitor away from public content merely because an account exists.

### 7.4 Science and learning [PROPOSED]

**Narrative:** question → explanation → evidence → relevant product details.

Use an editorial introduction, a text-based topic index, readable articles, and source lists. Put author/reviewer identity and publication or review dates where real records exist. Explain technical terms. Related articles appear as divided rows, not cards. Keep public material readable without professional credentials; any future restricted service requires its own justified scope.

### 7.5 Catalog [PROPOSED]

Use a descriptive H1, concise family introduction, labeled filters, sort, result count, an open product collection, and crawlable pagination where appropriate. Filters may occupy an aligned desktop side column; mobile filters use an inline disclosure or square functional drawer. Active filters are text with removal controls, not pills. Preserve the query, filter state, and clear recovery when there are no results.

### 7.6 Product detail [PROPOSED]

On wide screens, place the gallery beside open purchase information on the page surface. On narrow screens, use a clear content order with essential details near the purchase action. Include:

1. Verified name, imagery, price, quantity/variant, and availability.
2. Explicit nutritional role, species eligibility, and material use restrictions before purchase.
3. Ingredients, composition, guaranteed analysis, storage, and feeding directions from current records.
4. Plain-language explanation and traceable evidence where available.
5. Accessible add-to-cart feedback and relevant related-product entries.

Use headings, definition lists, tables, and disclosures for deeper details. A sticky purchase bar, if justified, is square, flush to the viewport edge, and separated by a rule. It must not obscure content, keyboard focus, warnings, consent, or browser safe areas.

### 7.7 Cart, checkout, and confirmation [PROPOSED]

Use divided line items, an open totals area, and short labeled form sections. Keep guest checkout visible. Display currency, delivery cost, taxes, discounts, and the final payable total before payment authorization. The final charge action must be explicit. Prevent duplicate orders/payments, preserve recoverable input on failure, and show confirmation only after verification. Confirmation lists the actual order identifier, contents, status, and next steps.

## 8. Voice, content, and scientific trust

### 8.1 Voice [BRAND]

DNAture is **científica y experta, cálida y empática, responsable y protectora, educativa y transparente, apasionada por los animales** (pp. 11–14). Speak with authority without rigidity; educate without imposing. Explain complex ideas simply and precisely. Emotional warmth comes from care and understanding. The interface combines cool foundations with recognizable turquoise and active brand-orange emphasis.

Use “nutrición fisiológica” when it accurately describes the subject. Explain why an ingredient or product role matters using evidence. Avoid unexplained quality claims, exaggerated promises, and judgment toward guardians.

The vocabulary on p. 14 restricts **BARF**, **huesos carnosos**, **presas completas**, and generic **snacks** for functional products. Use **órganos** with anatomical precision instead of **vísceras**. Choose **Treats** or **masticables funcionales** only where accurate. Later comparative campaign examples do not turn BARF into an authorized DNAture category label.

### 8.2 Content structure [REQUIRED]

- Give each section a clear subject, a useful explanation, and an appropriate next step.
- Use one descriptive page H1 and a logical heading hierarchy. Eyebrows do not carry the heading structure.
- Keep substantive information as HTML text, including material shown graphically in an image.
- Use meaningful titles, metadata, internal links, and image alternatives for public pages.
- Keep educational material discoverable from relevant product pages and connect articles to appropriate verified product information.
- Structured data must match the visible content and actual product/article records. Do not fabricate ratings, authors, prices, availability, or evidence for SEO/GEO.
- Make factual explanations clear enough for both people and retrieval systems to identify the subject, scope, and source.

### 8.3 Example interface copy [PROPOSED]

| Context | Copy |
|---|---|
| Catalog link | “Explorar productos” |
| Science link | “Conocer la nutrición fisiológica” |
| Product detail | “Ver ingredientes y composición” |
| Evidence link | “Consultar las fuentes” |
| Reorder action | “Agregar de nuevo al carrito” |
| Empty cart | “Tu carrito está vacío. Explora los productos cuando quieras.” |
| Pending save | “Guardando cambios…” |
| Save failure | “No pudimos guardar los cambios. Tu información sigue aquí; intenta de nuevo.” |
| Verified order success | “Recibimos tu pedido. Estos son los próximos pasos.” |

These are interface examples, not new slogans. Preserve the established form of address within each channel; the brandbook does not specify a complete tú/vos/usted policy.

### 8.4 Product and claim integrity [VERIFY]

The brandbook distinguishes product families but contains contradictions about completeness, complement use, and some product names (pp. 33–35). Use current product records to establish species, life stage, complete/complementary status, ingredients, analysis, quantities, directions, storage, prices, and stock.

Verify health outcomes, feeding frequencies, therapeutic use, genetic personalization, FEDIAF alignment, sustainability, compostability, and safety statements before publishing them as facts. A pet questionnaire does not establish genetic analysis or clinical suitability. A branded paw seal is not independent certification. A general scientific article is not proof of a particular product claim.

Evidence references should identify the source, date, relevant scope, and actual supporting material. If a document is unavailable, state that accurately. Keep educational content distinguishable from individual veterinary guidance. Do not invent endorsements, reviews, citations, registrations, or scientific authority.

### 8.5 Optional data collection [PROPOSED]

Ask for the minimum useful information and explain its purpose. Keep pet profiles and questionnaires optional. Separate marketing consent from core commerce, allow browsing without identification, and provide edit/delete controls for saved profiles. Do not infer medical needs from browsing history or silently replace the visitor's chosen experience.

## 9. Responsive and accessible behavior [REQUIRED]

Use WCAG 2.2 AA as the project's accessibility target. Evaluate the actual implementation, not just token values.

- Normal-size text needs at least 4.5:1 contrast; qualifying large text needs 3:1. Essential control boundaries and meaningful graphical indicators need sufficient non-text contrast. Decorative dividing rules may remain subtle because semantics, spacing, and headings also establish structure.
- Aim for at least 44×44px interactive targets; the standard control height in this system is 48px. Icon-only mobile controls retain accessible names.
- Support keyboard operation, visible focus, and a logical reading/focus order. Sticky elements must not obscure focused controls.
- At 320 CSS pixels and with text enlarged to 200%, preserve readable content and working controls without horizontal page overflow. Allow a genuinely two-dimensional technical table to scroll within its own labeled region when necessary.
- Use landmarks, semantic lists, real buttons/links, persistent field labels, legends, and appropriate image alternatives. Mark purely decorative imagery accordingly.
- Keep dialogs named and dismissible, manage modal focus, and restore focus on close. Do not turn simple navigation into unnecessary dialogs.
- Preserve state, scroll orientation, and user input across recoverable failures. Announce relevant asynchronous changes without repeated or disruptive announcements.
- Respect reduced motion. Do not require hover, animation, color recognition, or a precise pointer to understand or operate the site.

## 10. State and failure patterns [REQUIRED]

| Situation | Required response |
|---|---|
| Loading collection | Stable open-layout placeholders and an accessible loading status. |
| Visitor skips guidance | Immediate access to the catalog. |
| No order or profile history | Plain-language empty state with a relevant next action. |
| No search results | Show the query, explain the empty state, and offer filter removal or browse links. |
| Product unavailable | Explicit availability text, disabled purchase action where appropriate, and a catalog/support path. |
| Missing variant | Inline guidance next to the selector before purchase can proceed. |
| Added to cart | Updated count and accessible confirmation with a cart link. |
| Price changed on reorder | Current price shown before adding the item. |
| Save or submission failed | Preserve input, explain the failure, restore controls, and offer retry. |
| Payment failed | Recoverable cart state, clear next steps, and duplicate-payment protection. |
| Order confirmed | Verified order result and fulfillment information. |
| Supporting evidence missing | Honest availability statement without fabricated sources. |

All states inherit the same square geometry, continuous layout, cool foundations with the brand-orange exception, and absence of shadows. Error and loading designs do not introduce card containers as exceptions.

## 11. Implementation and migration guidance

**[REQUIRED]** Apply this document to new and modified UI. A documentation update does not authorize an unrelated repository-wide rewrite. When a page or component is scheduled for implementation, review its complete visual structure and interaction states.

| Previous pattern | Target pattern |
|---|---|
| `ProductCard` | `ProductEntry` on a shared collection surface. |
| `CategoryTile` | `FamilyIndexRow` with explanatory text and a browse link. |
| `PetPassportCard` / profile card | `PetProfileRow` within a divided record list. |
| `NutritionRoleCard` | `NutritionRoleSection` in the page flow. |
| `ReorderCard` | `ReorderRow` with current product data and controls. |
| Pill experience switcher | Plain route navigation or genuine underlined in-page tabs. |
| Rounded hero/science panel | Open editorial composition or continuous square section band. |
| Floating caption or statistic box | Figure caption or aligned text directly in the layout. |
| Boxed checkout summary | Open totals column separated with a rule. |

For each migration, remove the enclosing shell, per-item surface, excess shell padding, radius, shadow, and hover movement. Rebuild grouping with a semantic heading, proximity, alignment, and separators. Verify the result at narrow and wide widths and in loading, error, empty, focused, and selected states. A component rename or global `border-radius: 0` pass alone is incomplete.

Reconcile the proposed tokens with existing styles instead of maintaining parallel systems. Preserve shared `SectionEyebrow` and existing reusable controls where compatible. Follow the repository's feature ownership, one-component-per-file, and named event-handler conventions. Consult the installed Next.js bundled documentation before framework changes. Prefer Server Components and keep interactive client boundaries focused on the required behavior.

**Implementation sequence [PROPOSED]**

1. Shared color, spacing, square geometry, focus, forms, buttons, and navigation.
2. Homepage/editorial sections, family index, open product collections, and product detail.
3. Cart, checkout, contact, and all asynchronous states.
4. Account records, optional profiles, reorder, and deeper evidence features as needed.

## 12. Design acceptance checklist

- [ ] Content reads as a continuous page, open collection, divided list, or genuine table.
- [ ] No repeated content islands remain, including square or shadow-free cards.
- [ ] Authored UI frames and media crops have zero radius; no pills or circular backplates remain.
- [ ] No shadows, simulated elevation, glass effects, hover lifting, or decorative scaling remain.
- [ ] Product names, roles, prices, and actions remain clearly grouped without boxes.
- [ ] Every new landing-page content section uses the shared descriptive, unnumbered `SectionEyebrow`.
- [ ] Cool/neutral foundations include a meaningful recurring role for exact brand orange beyond eyebrow markers, with no unrelated warm colors.
- [ ] Orange actions, highlights, counters, and section bands use readable dark text; active and focus states meet contrast requirements.
- [ ] Shared spacing, gutters, widths, headings, and form rhythm are consistent.
- [ ] Typography, authentic imagery, and restrained engravings express science and empathetic care.
- [ ] Public pages have logical headings, descriptive crawlable links, appropriate alternatives, and accurate metadata.
- [ ] Product roles and claims use current evidence; the canonical tagline and vocabulary are correct.
- [ ] Mobile, enlarged text, keyboard, focus, touch, contrast, and reduced-motion behavior have been checked.
- [ ] Loading, empty, error, selected, pending, and success states satisfy the same visual and behavioral rules.
- [ ] Input survives recoverable failures; controls recover and completion is announced only after success.
- [ ] Any remaining asset, product-data, or source ambiguity is documented without inventing an approved rule.

## 13. Sources and boundaries

| Topic | Brandbook pages |
|---|---|
| Mission, vision, purpose | 2–9 |
| Archetypes, personality, voice, vocabulary | 10–14 |
| Guardian concerns and differentiation | 15–18 |
| Logo evolution and official tagline | 19–25 |
| Logo protection, sizes, and misuse | 26–30 |
| Original primary and category palettes | 31–32 |
| Product-family overview | 33–35 |
| Photography | 36–37 |
| Typography | 39–41 |
| Packaging and illustration | 42–54 |
| Social and website direction | 55–64 |

Consult [the structured brand reference](DNAture_Brand_Reference.json) for exact source colors, page references, restricted terms, and unresolved contradictions. Its `review_findings.conflicts` and `claim_controls` sections remain useful for content review. The original rounded brandbook layouts, earlier interface explorations, and version 0.1 proposals are historical references; they do not override this website's flat, open, square design requirements.
