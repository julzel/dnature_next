# DNAture design system and implementation guide

## Scope and authority

This guide describes the **current Next.js site**. The earlier unstyled frontend has been replaced at the user's request with a native, dependency-free design system adapted from the DNAture V4 prototype direction. The prototype's `src/*.tsx` components and stylesheets are not present in this repository; use the implementation references below.

The brand starts with the individual companion: **conocer, nutrir, acompañar**. Express that through calm editorial layouts, honest ingredient information, warm materials, and a connection to the visitor's actual companion. Browsing and checkout remain available without a profile.

The system uses plain CSS, native HTML controls and dialogs, local SVG icons, and system fonts. Do not introduce Material UI, Emotion, Tailwind, icon packages, or remote fonts to reproduce these patterns. Product images, names, formulations, availability and prices come from the site's existing source data. The typeset wordmark is a digital expression, not a replacement packaging asset.

The live visual reference is `/design-demo`. It is excluded from indexing and clearly identifies its illustrative content.

## Quick rules

1. Reuse the shared components and variables before inventing equivalents.
2. Start with paper, olive ink, generous spacing and left-aligned content.
3. Use large regular-weight sans-serif headings; monospace is for short metadata.
4. Orange marks the main action. Turquoise identifies companion information.
5. Build hierarchy with typography, alignment and thin rules. Keep panels square, filters pill-shaped and small utility controls circular.
6. Start at 320 px, then add columns when the content has room.
7. Essential copy stays readable; never shrink labels to fit artwork.
8. Write practical customer-facing copy in Spanish with clear accents.
9. Unknown measurements stay “Por conocer.” Never substitute a sample profile for the visitor's animal.
10. Preserve hover, focus, selected, disabled, loading, empty, validation and error states. Use labels and native state indicators alongside color.
11. Keep native scrolling and optional, quiet motion. Honor reduced motion.
12. Preserve the actual commerce, authentication and portion-calculation behavior.

## Foundations

All variables are defined in [app/design-system.css](app/design-system.css). The stylesheet loads once from [app/layout.js](app/layout.js). Its cascade layers are `tokens`, `base`, `components`, then `views`: shared resets and controls precede layouts scoped to the owning view.

### Color roles

| Token | Value | Role |
| --- | --- | --- |
| `--paper` | `#f6f5f0` | Main background; light text on olive. |
| `--ink` | `#262923` | Primary text, dark actions. |
| `--muted` | `#6b6d64` | Supporting copy on paper. |
| `--line` | `#d6d7ce` | Rules and light borders. |
| `--orange` | `#ff6a00` | Primary action and selected navigation underline. |
| `--turquoise`, `--information` | `#00a9b5` | Companion accent; decorative use. |
| `--information-ink` | `#006b73` | Readable information text and control focus on light surfaces. |
| `--information-on-dark` | `#83d4d7` | Information labels and focus on olive. |
| `--information-surface` | `#e0ece7` | Companion panels and information notices. |
| `--information-line` | `#8ba9a1` | Information borders. |
| `--information-muted` | `#54594e` | Supporting copy on information surfaces. |
| `--olive` | `#293127` | Editorial bands and footer. |
| `--surface` | `#faf9f5` | Secondary light surface. |
| `--stage` | `#e9e8e1` | Product display and neutral pending surface. |
| `--danger` | `#923c29` | Error text and destructive action outlines. |
| `--danger-surface` | `#f4e5dc` | Error background. |

Use ink on orange, paper on olive, and information ink on the pale information surface. Supporting text on turquoise surfaces uses `--information-muted` because the ordinary muted token does not meet the small-text contrast requirement there. Dark editorial supporting text uses `#c2c8b9`. Do not use bright turquoise as small text on paper or white text on orange.

Most of a page should remain neutral. A dark band marks a change to philosophy or ingredient explanation. Do not assign fictional recipe colors or rebuild packaging from a prototype; use the actual source imagery.

### Typography

| Role | Implementation |
| --- | --- |
| Body and display | `--body-font`: Helvetica Neue, Helvetica, Arial, sans-serif. |
| Metadata | `--metadata-font`: SFMono-Regular, Consolas, Liberation Mono, monospace. |
| Main title | Regular weight, `clamp(44px, 6.5vw, 96px)`, 1.02 line height, −.06em tracking. |
| Catalog title | `clamp(54px, 8.2vw, 126px)`. |
| Product title | `clamp(44px, 5.5vw, 86px)`. |
| Editorial section | `clamp(34px, 4.6vw, 68px)`, 1.07 line height, −.05em tracking. |
| Card title | 21 px on compact grids, 28 px from 600 px. |
| Body copy | 16 px base with 1.65 line height; view-specific essential copy 14–16 px. |
| Functional labels | 14 px; controls at least 44 px tall. Inputs stay 16 px on phones. |
| Short metadata | 10–12 px monospace with restrained uppercase tracking. |

Headings wrap and balance; variable identifiers use `overflow-wrap: anywhere`. Paragraphs usually measure 35–60 characters. Use large type for hierarchy, not heavy weights. The wordmark's bold DNA segment is a specific identity treatment.

### Spacing and layout

`--space-1` through `--space-8` represent 8, 12, 16, 24, 32, 48, 64 and 96 px. `--radius` is 2 px for ordinary controls and panels.

| Width | `--gutter` | Editorial section spacing |
| --- | --- | --- |
| 320–390 px | 20 px | 64 px |
| 391–600 px | 22 px | 64 px |
| 601–899 px | `clamp(24px, 4.45vw, 80px)` | 82 px |
| 900–1699 px | Same fluid gutter | 112 px |
| From 1700 px | `max(80px, calc((100vw - 1530px) / 2))` | 112 px |

Use `.section-shell` for horizontal gutters and editorial spacing; `.store-shell` provides horizontal gutters only. Flexible grid tracks use `minmax(0, 1fr)` and content regions have `min-width: 0`. Fix overflow at its source; never clip the document to conceal it.

## Shared components

### Brand primitives

[components/DesignSystem/index.js](components/DesignSystem/index.js) supplies:

- `Wordmark`: a typeset mark; its containing link carries the accessible name.
- `Eyebrow`: a short context label with an optional decorative sequence number.
- `SectionHeading`: eyebrow, `h2`, and optional supporting paragraph. Pass an `id` when the enclosing section uses `aria-labelledby`.
- `Fingerprint`: decorative vertical-bar motif; use sparingly for identity.
- `Notice`: an information surface with an optional title and error tone. Pass `role` only when announcements are appropriate.

The homepage reuses the section headings and shared gutters; account and tool views use the same typography and information language.

### Buttons and links

Use [components/Button/index.js](components/Button/index.js) for actions with a clear visual hierarchy. It preserves native disabled buttons and renders disabled navigation as an inert, labeled link placeholder.

| Variant | Appearance and purpose |
| --- | --- |
| `primary` | Orange with ink text: the main next step. |
| `secondary` | Ink with paper text: secondary progression or recovery. |
| `tertiary` | Quiet outlined action: back, cancel or supporting task. |
| `accent` | Pale information surface: companion-context action. |
| `danger` | Dark error outline/text: destructive action. |

Supported props include `size` (`small`, `medium`, `large`), `fullWidth`, `loading`, `iconStart`, `iconEnd`, and `iconOnly`. Loading retains the action label, disables the control, and shows a local spinner with `aria-busy`. Icon-only actions require an accessible name.

Ordinary shared buttons are 54 px high; small and utility controls have a 44 px minimum target. Use real links for navigation and buttons for local state changes. The existing Next.js links preserve modifier clicks and browser history. One action per decision area should dominate.

### Icons

[components/Icon/index.js](components/Icon/index.js) owns the local SVG path vocabulary. The viewBox is 24 × 24, with round caps and joins, no fill by default, and a 1.4 default stroke. Typical sizes are 18–24 px. Icons are decorative by default; name the containing control. The filled heart supplements `aria-pressed` for favorites. Existing `TextIcon` imports map compatibility symbols to the local vocabulary; brand letters do not load third-party artwork.

### Forms and selection

Use native inputs, selects, textareas, radio buttons and checkboxes with visible labels. Place hints and validation beside the field and connect them with `aria-describedby`. Errors include text and `aria-invalid`; preserve drafts during edits. Placeholder text supplements the label.

Inputs have a light background, 50 px minimum height and thin border. Focus uses information ink. Checkbox and radio choices preserve their native indicators; selected option panels add information-colored borders and backgrounds. `aria-pressed` represents toggles. Exclusive choices use radio inputs.

Filter pills use olive fill and paper text when selected. Navigation exposes `aria-current`, and tablists retain their existing roving focus and arrow-key behavior. Never show a hidden panel by overriding `[hidden]` accidentally. The account sidebar uses a responsive `.account-navigation` class: it stays collapsed on mobile until opened, and is persistent from 900 px. It does not override the native `hidden` attribute.

### Dialogs and notices

[components/Modal/Modal.js](components/Modal/Modal.js) keeps native `dialog` behavior, Escape dismissal, focus containment, restoration to the trigger, background inertness and backdrop dismissal where enabled. Modal styles constrain the content to the viewport and allow internal scrolling. The body stops scrolling while a dialog is open.

The cart uses `.cart-dialog`, a right-aligned full-height panel. Checkout uses the ordinary centered dialog. On narrow and short screens, the close control remains sticky and all content stays reachable. Use the native top layer instead of arbitrary modal z-index values.

Errors use readable text on the error surface. Empty states explain the situation and offer a concrete recovery action. Pending authentication and data states retain their actual explanations; do not display internal implementation details to shoppers.

## Page composition

| View | Applied pattern |
| --- | --- |
| Home | Editorial title/photo pairing, ruled trust signals, ingredients, category collection, dark olive nutrition section, community stories, information-colored contact section. |
| Catalog | Large introduction, source category filters, result count, flat product stages, readable names/prices/availability, add or quantity controls. |
| Product | Source gallery and information columns, native presentation selection, explicit availability, cart action, keyboard-operable supporting tabs. |
| FAQ | Editorial introduction, labeled search, mobile category pills, desktop information rail, ruled answer disclosures. |
| Calculator | Intro and source photo, inline native question sequence, radio panels, progress, explicit weight validation, information-colored result and guidance. |
| Plan DNAture | Optional locally saved companion flow, readable steps, turquoise companion records, edit/delete actions. |
| Checkout | Request introduction/progress, item detail, delivery/payment radio panels, summary, contact/review dialogs, readable export. |
| Account | Optional access entry, personal information sidebar, common form/panel patterns, real empty and pending states. |
| Error/loading/not found | Shared typography, clear explanation and recovery action. |
| Design reference | Tokens, shared brand primitives, action hierarchy, states, forms, commerce and identity examples. |
| Development diagnostics | Readable data tables, contained table scrolling, shared controls. |

No prices, nutrition claims, authentication behavior or inventory semantics are changed by this system. The receipt image uses the same calm typography and table hierarchy; the hidden export node stays hidden until the capture clone is prepared.

## Responsive behavior

| Width | Catalog | Focused detail and editorial layouts |
| --- | --- | --- |
| 320–359 px | One column. | Stacked content, wrapping controls. |
| 360–599 px | Two columns, 14 px gap. | Stacked content. |
| 600–899 px | Two columns with roomier stages. | Supporting grids gain columns; navigation stays compact. |
| From 900 px | Three columns, 28 px gap. | Product/editorial layouts gain two columns; navigation and account rail appear. |

Desktop navigation begins at 900 px. The shared header is sticky with a small olive service strip; anchor offsets are declared through `--header-offset`. A product gallery sticks below the header only on desktop. Unlike the prototype, this implementation keeps product purchase controls in the source content flow; it does not duplicate state into a fixed phone action bar.

Mobile order remains meaningful: introduction, controls, results; gallery, product information, selection, action, supporting details. Forms precede supporting previews. Use real Spanish copy at 320, 390, 768 and desktop widths. Keep long names readable and use `svh` for viewport-constrained dialogs.

## Imagery, writing and motion

Use this site's actual photos and Contentful images. Photographs use purposeful `object-fit: cover`; product stages use `contain`. Intrinsic dimensions and optimized sources are retained by [components/Image/index.js](components/Image/index.js). Secondary images remain lazy where configured. Do not invent new assets or substitute a prototype's illustrative ingredients for an actual formulation.

Spanish copy should be specific: “Cantidad,” “Presentación,” “Ingredientes,” “Explorar,” “Por conocer.” Invite rather than pressure. General portion guidance does not establish suitability for a medical condition. A display name or motif is not a genetic analysis.

Transitions are brief (200 ms for controls); product imagery has a subtle 550 ms lift. Motion is optional and content never waits for an animation to become usable. Reduced-motion rules remove animated transforms, shorten transitions and stop repeated animation. The existing carousel respects reduced motion and tab visibility. Preserve native scrolling and the calculator's reduced-motion-aware navigation.

Layer relationships: sticky header 30, focused skip link 100, option menus local 10. Dialogs use the native top layer. Focus remains visible on paper, turquoise surfaces and olive sections.

## Implementation references

| Source | Responsibility |
| --- | --- |
| [app/design-system.css](app/design-system.css) | Tokens, base semantics, shared controls, responsive view styles. |
| [app/layout.js](app/layout.js) | Single stylesheet entry point. |
| [components/DesignSystem/index.js](components/DesignSystem/index.js) | Brand and section primitives. |
| [components/Button/index.js](components/Button/index.js) | Action variants and states. |
| [components/Icon/index.js](components/Icon/index.js) | Local SVG vocabulary. |
| [components/Modal/Modal.js](components/Modal/Modal.js) | Native modal accessibility and behavior. |
| [components/Layout/index.js](components/Layout/index.js) | Site shell and skip link. |
| [components/Header/Header.js](components/Header/Header.js) | Shared navigation structure. |
| [components/Footer/index.js](components/Footer/index.js) | Contact and navigation footer. |
| [app/design-demo/page.js](app/design-demo/page.js) | Living visual reference. |
| [tests/e2e/design-system.spec.js](tests/e2e/design-system.spec.js) | Responsive reflow and keyboard navigation checks. |
| [tests/e2e/accessibility.spec.js](tests/e2e/accessibility.spec.js) | Contrast, native forms, dialogs, and keyboard accessibility. |

## Workflow and acceptance

Identify the closest existing view and shared primitives. State the primary action, content states and mobile order. Use existing source data and CSS tokens. Scope local layout changes to the view; shared element styles belong in the foundation layer, not ad hoc overrides on another page.

Inspect rendered results at 320, 390, 768 and desktop widths. Verify no document overflow, visible focus, reachable controls, long-name wrapping, meaningful source order and scrollable short-screen dialogs. Exercise empty, selected, disabled, validation and loading/error states. Check navigation, browser back, carousel/tab keyboard behavior and relevant checkout or account flows.

Run `npm run lint`, `npm test`, `npm run test:e2e`, and `E2E_USE_FIXTURES=1 npm run build` for local fixture validation. Fixture success does not validate live service availability or real authentication. Run `git diff --check` before handing off changes. Visual inspection complements tests; a successful build does not prove visual alignment.

Update this guide and `/design-demo` when intentionally changing a shared pattern.
