# DNAture design system and implementation guide

## Current Next.js frontend

The Next.js frontend intentionally uses browser-default HTML rendering. It has no application stylesheets, custom font loading, Material UI, Emotion, or third-party icon libraries. Shared controls use native HTML; `components/Icon` supplies decorative text symbols while buttons and links retain their accessible labels. Preserve this unstyled behavior unless the user explicitly requests a new design. The prototype guidance below records a separate visual reference and does not authorize restoring its styles to this frontend.

This guide helps AI code agents build components and views that belong to DNAture. It describes the digital expression implemented in prot-v4 and gives defaults for extending it. Read the quick rules first, then the relevant component and layout sections before writing UI.

The brand starts with the individual companion: **conocer, nutrir, acompañar**. Express that through calm editorial layouts, honest ingredient information, warm materials, and a visible connection to the visitor’s actual companion.

**Authority:** the source references below establish implemented values and behavior. Recommendations marked **new work default** guide extensions; they are not claims that every legacy component already follows them. This guide documents the prototype’s digital expression. The current typeset wordmark and CSS packaging are conceptual assets, as recorded in [ASSETS.md](ASSETS.md).

## Quick rules for code agents

1. Reuse the existing components and CSS variables before inventing equivalents.
2. Start with a warm paper surface, dark olive ink, generous spacing, and left-aligned content.
3. Use large, regular-weight sans-serif headings with tight tracking. Use monospace for short metadata, identifiers, and section labels.
4. Give orange to the main action or a small editorial accent. Give turquoise to companion identity and information.
5. Build hierarchy with typography, alignment, and thin rules. Keep panels mostly square; use pills for filters and circles for small controls or motifs.
6. Compose the smallest screen first. Use real content at 320 px; add columns when the content has room.
7. Keep essential copy readable. Tiny lettering on an illustrated package is artwork, not a model for form labels or product information.
8. Write customer-facing copy in Spanish. Invite exploration with concrete language and a clear next action.
9. Use the visitor’s real profile when available. Unknown measurements stay “Por conocer”; browsing works without a profile.
10. Implement hover, focus, selected, disabled, empty, and applicable loading/error states. A color change alone must not carry their meaning.
11. Keep motion quiet and optional. Preserve native scrolling and reduced-motion behavior.
12. Keep product information truthful. Use actual provided prices, formulations, photography, and claims; maintain explicit pending states where data is unavailable.

## Brand character

| Quality | How it appears in the interface |
| --- | --- |
| Individual | A companion’s name and known details recur where they help the task. Identity panels feel like a personal record. |
| Observant | Small section numbers, formulation codes, thin rules, and precise labels organize the information. |
| Natural | Paper, olive, muted ingredient colors, soft shadows, and tangible photography suggest material rather than synthetic polish. |
| Thoughtful | Short headlines have breathing room. The page explains its ingredients and offers exploration at the visitor’s pace. |
| Confident | Large typography and restrained actions carry the page. Information is specific; unsupported promises do not fill gaps. |
| Warm | Spanish copy speaks directly to the visitor and treats the animal as a companion with a history. |

A new view should still feel like DNAture when decorative photography is removed: its typography, spacing, color roles, copy, and structure should carry the identity.

## Color system

### Shared variables

These values are implemented in [styles.css](src/styles.css) and [profile-system.css](src/profile-system.css). Reference the variables in application CSS; the literal values below are for lookup and portability.

| Variable | Value | Role |
| --- | --- | --- |
| `--paper` | `#f6f5f0` | Main warm background and light text on dark sections. |
| `--ink` | `#262923` | Primary text and dark actions. |
| `--muted` | `#6b6d64` | Supporting copy and quiet metadata. |
| `--line` | `#d6d7ce` | Subtle rules and light control borders. |
| `--orange` | `#ff6a00` | Primary actions, selected species underline, small editorial punctuation. |
| `--turquoise` | `#00a9b5` | Companion identity accent. |
| `--information` | `#00a9b5` | Same turquoise in the profile system. |
| `--information-ink` | `#006b73` | Darker turquoise for information text on light surfaces. |
| `--information-on-dark` | `#83d4d7` | Information text and accents on dark surfaces. |
| `--information-surface` | `#e0ece7` | Quiet information background. |
| `--information-line` | `#8ba9a1` | Information dividers. |

Use dark ink on orange actions, as `.button-orange` does. Use `--information-ink` for readable turquoise text on paper and `--information-on-dark` on olive. Check the actual text/background pair, including opacity and image overlays, whenever extending the system.

### Supporting surfaces

These are existing component colors, not additional global variables. Reuse the relevant component class, or scope a matching value locally when a new component needs the same surface role.

| Existing color | Reference | Role |
| --- | --- | --- |
| `#faf9f5` | `.catalog-collection` | Collection surface, slightly lighter than paper. |
| `#293127` | `.catalog-philosophy`, `.passport` | Dark olive storytelling and identity. |
| `#292e27` | `.ingredient-section` | Dark ingredient section. |
| `#e9e8e1` | `.catalog-object`, `.product-stage` | Neutral product display stage. |
| `#e6e8df`, `#e4e9e5` | Alternating catalog objects | Subtle variety between products. |
| `#e9ede3` | `.catalog-profile`, cart notice | Light olive contextual information. |
| `#e5e8df` | `.intro-preview` | Profile preview surface. |
| `#7b846e` | Catalog headline emphasis | Quiet olive emphasis within a large heading. |

**New work default:** let neutral surfaces cover most of the page. Use a dark olive band when the content changes to philosophy, ingredient explanation, or identity. Keep orange and turquoise attached to their roles rather than spreading them across every panel.

### Recipe identity colors

Read these from `recipe.color` in [data.ts](src/data.ts), and pass them as `--recipe-color`. They identify packaging and recipe artwork; they are not general action or status colors.

| Recipe | Color |
| --- | --- |
| Pollo + Res | `#ae5033` |
| Pollo + Cordero | `#7b805a` |
| Trucha + Res | `#60827c` |
| Pollo + Caballo | `#8a7061` |
| Wild Ancestor | `#57594b` |
| Wild Spirit | `#a37e49` |

## Typography

### Font roles

The body and display stack is `"Helvetica Neue", Helvetica, Arial, sans-serif`. The metadata stack is `"SFMono-Regular", Consolas, "Liberation Mono", monospace`, exposed as `--metadata-font` by the profile stylesheet. The current system loads no external fonts.

Display typography uses weight `400`, tight negative letter spacing, and short lines. Body copy uses regular weight with a comfortable line height. Weight `500` is used sparingly for action labels; the heavier DNA portion of the wordmark is a specific identity treatment.

### Implemented reference treatments

| Treatment | Size | Line height | Letter spacing | Reference |
| --- | --- | --- | --- | --- |
| Catalog page title | `clamp(56px, 8.2vw, 126px)` | `.98` | `-.065em` | `.catalog-intro h1` |
| Product page title | `clamp(55px, 5.5vw, 86px)` | `1.02` | `-.06em` | `.product-information h1` |
| Editorial section title | `clamp(38px, 4.8vw, 76px)` | `1.05` | `-.055em` | `.catalog-philosophy h2` |
| Related collection title | `clamp(32px, 3.5vw, 52px)` | `1.12` | `-.045em` | `.product-related-heading h2` |
| Product card title | `21px` mobile, `28px` from 600 px | `1.15` | `-.9px` | `.catalog-card h2` |
| Catalog introduction copy | `15px` mobile, `17px` desktop | `1.7` | Default | `.catalog-intro-grid p` |
| Standard action | `13px`, weight `500` | Inherited | Default | `.button` |
| Standard metadata | `10px`, monospace | `1.5` | `1.1px` | `.micro`, `.eyebrow` |

**New work default:** use 14–16 px for essential paragraphs and 12–14 px for functional labels, with line height 1.5–1.8. Short metadata can use 10–11 px. Some existing captions and packaging details are smaller; do not copy that scale into new essential UI. Allow containers to grow instead of shrinking important copy to fit.

Use an olive phrase or an orange terminal dot to shape a major editorial headline when appropriate. The dot is optional. Do not apply colored punctuation to every title or turn whole paragraphs into accent text.

Use intentional line breaks for stable, short editorial phrases, such as “Cada receta, / un porqué.” Avoid hard breaks in user names, translated copy, descriptions, and other content whose length varies. Keep paragraph measures roughly 35–60 characters where the layout allows; this is a new-work guideline, not a global width token.

## Spacing and composition

### Shared page gutter

Use `var(--gutter)` to align headers, titles, grids, and footer content.

| Width | Implemented gutter |
| --- | --- |
| Up to 390 px | `20px` |
| 391–600 px | `22px` |
| 601–1699 px | `clamp(24px, 4.45vw, 80px)` |
| From 1700 px | `max(80px, calc((100vw - 1530px) / 2))` |

The V4 store header uses a local 20 px gutter below 600 px to fit its controls. That is a scoped exception, not a replacement for the page gutter.

`.section-shell` combines the page gutter with editorial vertical spacing: 112 px by default, 82 px below 900 px, and 64 px at 600 px and below. `.store-shell` supplies horizontal padding only; catalog and detail sections define their own vertical rhythm.

**New work default:** use a small family of spacing values—8, 12, 16, 24, 32, 48, 64, and 96 px—as practical choices, not newly implemented tokens. Existing grid gaps such as 14, 28, and 45 px remain valid when matching those components. Use 64 px for a new mobile editorial section and about 96 px on desktop unless a neighboring reference establishes a different rhythm.

### Layout rules

- Align major content to shared gutters and a clear column system. Make asymmetry purposeful: a narrow information rail beside a wide statement, or copy beside a product stage.
- Separate major regions with whitespace, a thin rule, or a surface change. Keep ordinary text and controls flat.
- Use `minmax(0, 1fr)` for flexible grid tracks and `min-width: 0` on children that contain images, inputs, or variable text.
- Use `overflow-wrap: anywhere` for names and other unbounded identifiers. Truncate compact header labels only when the full accessible name remains available.
- Reserve `overflow: hidden` for intentional artwork cropping. Fix layout overflow at its source; clipping the entire page can hide broken content or focus rings.
- Keep content order meaningful without desktop placement: introduction, controls, results; or product gallery, information, selection, action, supporting details.

## Responsive behavior

New components should use mobile base styles and enhance them with `min-width` queries. The older homepage and profile styles contain additional breakpoints; preserve them when editing those features.

| V4 width | Catalog | Product detail |
| --- | --- | --- |
| 320–359 px | One product column. Controls wrap. | Stacked gallery and information; compact controls. |
| 360–599 px | Two product columns with a 14 px gap. | Stacked layout and fixed bottom product action. |
| 600–899 px | Two columns; search and sort share a row. | Stacked layout with a larger product stage; bottom action remains. |
| From 900 px | Three columns with a 28 px gap. Intro copy and imagery share a row. | Gallery and information share two columns; gallery sticks below the header. Bottom action is removed. |

Desktop navigation appears at 900 px. Smaller screens use the menu. The current header is 91 px on desktop and 72 px after scrolling, 78/66 px at tablet widths, and 68 px on small phones. Store content reserves 78 px initially and 91 px from 900 px; native anchor scrolling uses a 100 px top offset.

The profile introduction stacks its preview at 650 px and below. Do not replace all existing breakpoint behavior just to make it match the store table.

A fixed mobile action must include `env(safe-area-inset-bottom)` and enough end-of-page padding to keep footer content reachable. Sticky desktop panels must become ordinary stacked content on phones. Use `svh` for viewport-height features, and inspect short screen heights as well as widths.

## Component patterns

### Navigation

Reuse [Header.tsx](src/components/Header.tsx) and [Footer.tsx](src/components/Footer.tsx). Keep the wordmark left, navigation calm, and utility actions compact. The store header uses translucent paper with a subtle blur; blur supports the surface rather than becoming a glass-card theme.

Use [StoreLink.tsx](src/components/StoreLink.tsx) for internal store navigation and the existing `navigate` function. It preserves normal link behavior for modifier clicks while supporting application history. Use anchors for navigation and buttons for local actions. Retain the skip link and named navigation regions.

### Section headings

Reuse `Eyebrow` for the short uppercase context label and optional two-digit number. Place the large heading below it with a generous gap, then a short paragraph or action. Numbers identify a page’s sequence; formulation identifiers describe recipes. Keep those meanings separate.

Dark sections use `<Eyebrow light />`, paper text, and muted olive supporting text. Avoid placing essential paragraphs in the tiny monospace label style.

### Buttons and links

| Pattern | Existing implementation | Appropriate use |
| --- | --- | --- |
| Primary action | `.button.button-orange` | The main next step in a region. Dark text, 2 px corners, trailing icon. |
| Secondary filled action | `.button.button-dark` | Recovery or secondary progression on a light surface. |
| Editorial link | `.text-link` | Underlined exploration action with an arrow. |
| Utility control | `.icon-button` | Named search, close, menu, or compact adjustment action. |
| Filter chip | `.catalog-proteins button` | Rounded category selection with a dark olive selected state. |

Standard buttons have a 54 px minimum height and 17 × 22 px padding. The arrow moves about 4 px on hover; press feedback scales the action to `.985`. Keep one visually dominant action per decision area.

**New work default:** give new interactive targets at least 44 × 44 px of usable area. Some legacy compact controls are narrower; enlarge the target when adding or substantially revising a functional control. Make focus visible, preserve disabled behavior, and give icon-only buttons an explicit accessible name.

### Filters and selection

Catalog species selection is a text-and-icon row with a 2 px orange underline. Protein chips use dark olive fill with light text when selected. Profile fields use information-colored borders, pale surfaces, and a checkmark or radio indicator.

The homepage recipe chips retain an older orange selected treatment. Match the surface being extended: new catalog filters should follow `.catalog-proteins`, and profile controls should follow the profile information language. Expose toggle selection with `aria-pressed`; use native radio inputs for exclusive form choices where appropriate.

### Product cards and packaging

Reuse `ProductCard` from [ProductCatalog.tsx](src/components/ProductCatalog.tsx) and [ProductPouch.tsx](src/components/ProductPouch.tsx). The card has a flat, lightly tinted stage; a centered tangible product; a small formulation index and weight; then metadata, title, ingredients, and a ruled exploration link. Its text is outside the illustrated pack.

The pouch is warm cream with a muted recipe color band, the wordmark, generous product typography, and a fingerprint motif. A small alternating rotation and soft ground shadow create physicality. Hover gently lifts and straightens it. Preserve `--recipe-color` and the recipe seed rather than inventing a second packaging renderer.

The artwork stage may clip its decorative contents. Its adjacent product information and action must remain visible and accessible. When final product photography becomes available, preserve the stage, hierarchy, and meaningful alt text.

### Companion information

Reuse `ProfileContext`, `ProfileIdentity`, `ProfileAttributes`, and `ObservationCard` from [ProfileLanguage.tsx](src/components/ProfileLanguage.tsx), or the larger [CompanionPassport.tsx](src/components/CompanionPassport.tsx).

Turquoise dots, information text, slim borders, and a quiet identity code connect these surfaces. Use the actual profile and formatting helpers from [profile.ts](src/profile.ts). A profile is optional; missing values have explicit neutral labels. A name or decorative signature does not establish nutritional suitability.

### Forms and supporting details

Use visible labels and native controls. Large identity inputs can use the existing underline treatment; search and structured selections use thin rectangular borders. Placeholder text supplements a label rather than replacing it. Keep validation messages beside the field and preserve entered data during edits.

Reuse native `details` for product information or the existing [Disclosure.tsx](src/components/Disclosure.tsx) when extending its animated pattern. Summaries are full-width, ruled rows with text and a small plus icon. Open state rotates or replaces the icon and reveals readable supporting content.

The current search, menu, and cart use native modal `dialog` elements in `Header.tsx`. Keep Escape dismissal, focus containment, trigger focus restoration, scroll locking, and backdrop behavior. Prefer the native top layer to arbitrary modal z-index escalation.

### Empty and pending states

Use a quiet pale olive region, a short human headline, a specific explanation, and a recovery action. For example: “No encontramos esa combinación.” followed by “Ver todas las recetas.” Preserve the visitor’s context and allow filters to be cleared.

Where loading or errors are introduced, use the same typography and surfaces. Reserve space, state what is happening, and offer a concrete retry when appropriate. These are extension defaults; no shared loading component currently exists.

## Photography and graphic motifs

Photography is editorial: natural light, believable texture, calm posture, close attention to an individual animal, and space for the accompanying layout. Existing story portraits retain their own context. Photography supplies a subject, not a stock decoration layer on every panel.

| Asset | Intended role |
| --- | --- |
| `public/images/lola-portrait.jpg` | Fictional editorial hero portrait; not the visitor’s companion. |
| `public/images/ingredients-bowl.png` | Collection-level ingredient illustration; not a claim about every recipe’s exact contents. |
| `public/images/story-*.jpg` | Existing illustrative companion stories, with provenance in `ASSETS.md`. |

Keep ears, eyes, and the subject’s expression intact in portrait crops. Use `object-fit: cover` for photographic frames and `contain` or natural sizing for isolated bowls and product artwork. Load secondary imagery lazily when appropriate; preserve image dimensions or aspect ratios to prevent layout shifts.

Reuse `Fingerprint` from [UI.tsx](src/components/UI.tsx) for the variable vertical-bar motif. It suggests individual identity and recipe character; it is decorative, not a genetic analysis. Orbit rings, fine coordinates, and small index labels can support an ingredient or identity illustration. Use them where they explain the composition rather than repeating them everywhere.

Icons use the existing `Icon` component: 24 × 24 viewBox, no fill, round caps and joins, and a 1.4 stroke. Typical rendered sizes are 18–22 px. Reuse or extend this vocabulary consistently. Keep decorative SVGs hidden from assistive technology and put the accessible name on the control.

## Motion and layers

| Motion | Implemented reference |
| --- | --- |
| Button color and press response | About 250 ms. |
| Arrow hover | Small 3–5 px translation. |
| Pack lift and straighten | About 550 ms with `cubic-bezier(.2,.7,.3,1)`. |
| Existing recipe rearrangement | 360 ms with `cubic-bezier(.22,.7,.25,1)`. |
| New recipe reveal in that hook | 280 ms, opacity plus a 6 px rise. |
| Dialog entrance | 250 ms, opacity plus a 12 px rise. |
| Header surface and size change | About 350 ms. |

Motion should reinforce physicality, state, or continuity. Keep ordinary pages usable immediately. The homepage has a specific scroll-driven narrative; do not add scroll hijacking, smooth-scroll libraries, large parallax effects, or reveal-dependent content to ordinary views.

The existing reduced-motion rules shorten transitions, remove animated transforms, and simplify the hero. New JavaScript animation must also respect `prefers-reduced-motion`; CSS alone cannot stop Web Animations API calls. Scroll hooks use passive listeners, a scheduled animation frame, and cleanup rather than triggering a React render on every scroll event.

Existing layer values are: transfer artwork `15`, mobile purchase bar `20`, header `30`, status notice `50`, and focused skip link `100`. Modal dialogs use the native top layer. Respect these relationships and the corresponding safe-area and focus behavior.

## Writing and personalization

Customer-facing UI is Spanish with clear accents and direct address to the visitor. Use “tu compañero,” “su historia,” “conocer,” “explorar,” and “acompañar” when they fit the task. Labels remain practical: “Cantidad,” “Presentación,” “Ingredientes,” “Limpiar filtros.”

| Intent | Aligned example | Pattern to avoid |
| --- | --- | --- |
| Introduce the collection | “Cada receta, un porqué.” | Generic enthusiasm without information. |
| Explain ingredients | “Ingredientes que reconoces.” | Unsupported performance or health guarantees. |
| Invite a profile | “Cuéntanos quién es.” | Making personal data a condition of browsing. |
| Explore with a profile | “Explora las recetas con Moka.” when Moka is the actual saved name | Treating a sample persona as the visitor’s animal. |
| Recover an empty result | “Prueba con otra proteína.” | Blame, dead ends, or pressure to buy. |
| Represent an unknown value | “Por conocer” or “Precio por confirmar” | Invented measurements, prices, or availability. |

Editorial headlines can be poetic, but explanations and actions should be concrete. Keep assertions proportional to verified data. Current recipes, story copy, and pack designs are conceptual; preserve their honest presentation until confirmed content replaces them.

## View composition recipes

### An editorial or learning view

Start with a short eyebrow and one clear page title. Follow with an introductory paragraph and purposeful imagery or an information rail. Arrange supporting material as ruled rows or a restrained grid. Use a dark olive region for a deeper ingredient or philosophy story when useful, then one next action. Keep long educational text in readable paragraphs rather than metadata typography.

### A collection view

Use a breadcrumb, editorial title, short explanation, species/category selection, search and sort, filter chips, result count, and product grid. Show a reversible empty state when nothing matches. Keep filter state in the URL when it changes the shareable result, and preserve it on browser back. V4’s full catalog is the implementation reference.

### A product or focused detail view

Use a breadcrumb and a gallery alongside information on desktop. On mobile, stack them in a meaningful order. Present identity, short description, applicable selections, price/pending state, quantity, and action before expandable supporting details. Add related content after the main task, and keep the fixed mobile action consistent with the main selection.

### A companion or data-entry view

Ask only for information needed for the task. Use profile information colors and an optional live preview. Keep the form before the preview on small screens. Validate clearly, preserve drafts, support cancellation, and distinguish remembering on this device from an account or synchronization.

## Starter component for a new editorial section

This is a **new work default**, not an existing component. It demonstrates how to extend the system without duplicating its primitives. The imports assume the component lives in `src/components`; adapt the paths when moving it.

```tsx
import { useId } from 'react'
import { Eyebrow, Icon } from './UI'

type Props = {
  eyebrow: string
  title: string
  description: string
  number?: string
  actionLabel: string
  onAction: () => void
}

export default function BrandSection({
  eyebrow, title, description, number, actionLabel, onAction,
}: Props) {
  const headingId = useId()

  return (
    <section className="brand-section" aria-labelledby={headingId}>
      <Eyebrow number={number}>{eyebrow}</Eyebrow>
      <div className="brand-section-layout">
        <h2 id={headingId}>{title}</h2>
        <div className="brand-section-copy">
          <p>{description}</p>
          <button className="button button-orange" onClick={onAction}>
            <span>{actionLabel}</span>
            <Icon name="arrow" />
          </button>
        </div>
      </div>
    </section>
  )
}
```

```css
.brand-section {
  padding: 64px var(--gutter);
  background: var(--paper);
  color: var(--ink);
}

.brand-section-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 24px;
  margin-top: 28px;
}

.brand-section h2 {
  font-size: clamp(38px, 4.8vw, 76px);
  font-weight: 400;
  line-height: 1.05;
  letter-spacing: -.055em;
  overflow-wrap: anywhere;
}

.brand-section-copy { min-width: 0; }
.brand-section-copy p {
  max-width: 42ch;
  font-size: 15px;
  line-height: 1.7;
  color: var(--muted);
}
.brand-section-copy .button {
  margin-top: 24px;
  max-width: 100%;
  text-align: left;
}
.brand-section-copy .button > span { overflow-wrap: anywhere; }

@media (min-width: 900px) {
  .brand-section { padding-block: 96px; }
  .brand-section-layout {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    align-items: end;
    gap: 64px;
  }
}
```

For a page’s main title, use an `h1` and an appropriate display treatment instead of this section’s `h2`. For navigation, replace the action button with `StoreLink` and a real destination. Reuse the existing focus and reduced-motion styles; add component-specific behavior only where necessary.

## Implementation references

| File | Read it for |
| --- | --- |
| [styles.css](src/styles.css) | Base tokens, reset, shared typography, actions, original editorial patterns. |
| [profile-system.css](src/profile-system.css) | Information colors, companion identity grammar, readable overrides, motion reductions. |
| [companion-v3.css](src/companion-v3.css) | Introduction, profile preview, companion header, long-name behavior. |
| [catalog-v4.css](src/catalog-v4.css) | Mobile-first collection and detail styles, store-specific overrides. |
| [main.tsx](src/main.tsx) | Stylesheet import order, which affects the final result. |
| [UI.tsx](src/components/UI.tsx) | Wordmark, icons, eyebrow, fingerprint primitives. |
| [ProductCatalog.tsx](src/components/ProductCatalog.tsx) | Catalog controls, empty state, reusable product card. |
| [ProductDetail.tsx](src/components/ProductDetail.tsx) | Gallery, information hierarchy, quantity and mobile action. |
| [ProfileLanguage.tsx](src/components/ProfileLanguage.tsx) | Actual profile identity, attributes, contextual panels. |
| [useStoreRoute.ts](src/hooks/useStoreRoute.ts) | History, anchor behavior, focus and scroll restoration, page titles. |
| [catalog.ts](src/catalog.ts) | Product routes, filters, validated cart changes. |
| [data.ts](src/data.ts) | Existing recipe names, colors, ingredients, and sample content. |
| [ASSETS.md](ASSETS.md) | Provenance and conceptual asset limits. |
| [QA.md](QA.md) | Verified behavior and the limits of prior reviews. |

Styles load in this order: `styles.css`, `profile-system.css`, `companion-v3.css`, then `catalog-v4.css`. A base declaration is not always the final computed style. Read later overrides before copying a value or changing a shared selector. Scope additions to their component; do not introduce broad `h2`, `button`, or `a` overrides to solve a local need.

## Agent workflow and acceptance

Before implementing, identify the closest existing view and reusable primitives. State the new component’s role, primary action, content states, and mobile order. Build with the existing stack and source data. A new library or external asset should solve a concrete requirement; the current design does not depend on a UI framework, remote fonts, or icon package.

Review the rendered result at 320 px, around 390 px, 768 px, and desktop. Verify content fits without document overflow, important controls are reachable, headings and actual names wrap, keyboard focus is visible, and mobile fixed elements leave content accessible. Exercise the relevant empty, selected, disabled, validation, and loading/error states. Verify navigation and browser back where the view changes routes.

Use `npm run build` for TypeScript and production validation and `git diff --check` for patch cleanliness. Run relevant behavioral tests when changing logic; documentation or a reversible visual adjustment does not need a test that merely duplicates its implementation. A passing build does not establish visual alignment—inspect the page.

The result is aligned when its color roles, typography, spacing, imagery, Spanish copy, and companion context follow this guide while the intended task remains clear. Update this document when an intentional shared pattern changes, distinguishing that change from a one-off layout exception.

## Portable instruction for another code agent

> Implement the requested DNAture view using this design guide and the repository’s existing components. Start with mobile content order and the paper/olive palette. Reuse `Eyebrow`, `Icon`, `Wordmark`, `Fingerprint`, profile primitives, and product components when applicable. Use regular-weight, tightly tracked editorial headings, thin rules, restrained corners, orange primary actions, and turquoise companion information. Keep Spanish UI copy concrete and profile data truthful. Preserve visible focus, reduced motion, responsive reflow, and meaningful empty states. Inspect the rendered result at phone, tablet, and desktop sizes. Explain any intentional departure from the shared system.
