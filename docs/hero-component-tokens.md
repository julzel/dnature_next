# Hero component-token specification

## Purpose and scope

This document describes how to decompose the proposed homepage hero into small,
meaningful UI units before implementation. A component token is a reusable or
independently understandable part of the interface with its own content,
layout, interaction, or accessibility responsibility.

The global announcement bar, logo row, search, cart, and primary navigation
shown at the top of the reference image are not part of the Hero component.
They remain responsibilities of the site Header. The Hero begins immediately
below the primary navigation and includes the warm visual canvas, content,
product imagery, benefit strip, and lower brand statement.

The target composition should feel natural and premium without becoming
ornamental or luxurious. The product story and purchase path must remain more
important than the decorative leaves, curves, and color fields.

## Component-token inventory

### 1. HeroSection

The root component and composition boundary. It provides the semantic hero
section, establishes the warm neutral background, constrains the maximum content
width, and coordinates the content, media, proof, and footer layers.

HeroSection should not contain detailed typography or button logic. Its role is
to define the overall stacking order, responsive composition, overflow rules,
and relationship between the foreground content and decorative background.

### 2. HeroScene

The visual background layer. It owns the cream canvas, pale organic shapes,
bottom teal wave, small orange accent, and decorative leaf placements. These
elements create the brand atmosphere but do not communicate essential content.

HeroScene should remain entirely decorative and hidden from assistive
technology. Decorations should be lightweight SVG or CSS shapes where
practical. The scene should simplify on small screens rather than forcing the
desktop artwork into a compressed mobile layout.

HeroScene is one token rather than a separate React component for every curve or
leaf. Individual decorative assets may be styled elements within this token.

### 3. HeroLayout

The structural grid inside HeroSection. On desktop it creates the two main
regions: a left content column and a right media column. The reference suggests
an approximately 46/54 split, allowing the animal and food photography to carry
slightly more visual weight.

HeroLayout also reserves space for the benefit strip near the bottom of the
content column without coupling it to the text content. On mobile it changes to
a single reading flow rather than maintaining two narrow columns.

### 4. HeroCopy

The content group containing the eyebrow, headline, divider, supporting copy,
and calls to action. It controls readable line length and vertical rhythm but
delegates the rendering of each content unit to its corresponding token.

HeroCopy should be the first meaningful content encountered in the hero. Its
desktop alignment is left; mobile alignment should also remain left because the
headline contains multiple typographic treatments and is easier to scan from a
consistent edge.

### 5. HeroEyebrow

The compact pill reading “Recetas naturales · Ingredientes reales.” It combines
a small leaf icon with a short positioning statement.

This token should accept concise text and an optional icon. It is supporting
context, not a heading. Its styling uses a soft white surface, subtle border or
shadow, fully rounded corners, and restrained teal text. The icon may be
decorative when the adjacent text communicates the same meaning.

### 6. HeroHeadline

The primary page heading. It renders the phrase “La forma natural de alimentar
a tu mascota” as one semantic heading while allowing selected text fragments to
receive distinct visual treatments.

The reference uses three treatments within one sentence:

- dark teal, heavy sans-serif for the main statement;
- orange expressive script for “natural”;
- brighter teal sans-serif for “a tu mascota.”

These variations are presentation only. They must not split the accessible name
or create multiple headings. Line breaks should be controlled responsively so
the phrase reads naturally rather than being fixed to the desktop artwork.

### 7. HeroAccentRule

The short teal line between the headline and paragraph. It provides pacing and
visual continuity with the brand palette.

This is a presentational token with no accessible content. If it is only used in
this hero, it may be implemented as an element owned by HeroCopy rather than a
standalone reusable component.

### 8. HeroDescription

The supporting paragraph explaining the offering: complete recipes, snacks,
and supplements made from natural and balanced ingredients.

The paragraph should have a comfortable reading width and line height. Small
emphasis fragments such as “naturales” and “saludable y feliz” may use a heavier
weight, but the copy remains a single paragraph. It should describe the value
proposition rather than repeat the headline.

### 9. HeroActions

The horizontal or stacked action group. It composes existing design-system
Button components instead of introducing hero-specific button behavior.

The proposed actions are:

- “Comprar ahora” as the primary action leading to the product catalogue;
- “Conocer recetas” as the secondary action leading to the recipes category or
  an appropriate educational destination.

On desktop the actions sit side by side. On small screens they may remain side
by side when both labels fit with accessible targets; otherwise they stack at
full width. The primary action may include a directional icon, but the icon
must not replace the text label.

### 10. HeroMedia

The image-led product story on the right side. It owns the main animal and food
photograph, its responsive crop, and the organic mask that blends it into the
background.

The primary image is meaningful content and should describe the visible subject
in its alternative text, for example a dog eating fresh natural food from a
DNAture bowl. It should not be treated as a CSS background. HeroMedia is also
responsible for maintaining a stable aspect ratio so loading the image does not
shift the page.

### 11. HeroImageFrame

The organic shape that crops or reveals the main image. It provides rounded,
asymmetric geometry without changing the image’s meaning.

This token belongs inside HeroMedia. It should use CSS clipping, masking, or a
prepared transparent asset rather than JavaScript-driven layout. Mobile may use
a simpler rounded rectangle or oval crop when the desktop silhouette would
remove important parts of the dog or bowl.

### 12. HeroTrustSeal

The circular “Nutrición real · Para su bienestar” seal over the media region.
It acts as a compact trust or positioning statement.

If the seal text conveys unique information, it should remain readable by
assistive technology. If the same statement appears elsewhere and the seal is
purely graphic, it should be decorative. The seal must not cover the animal’s
face, the food, or the product branding at any breakpoint.

### 13. HeroBenefits

The rounded proof strip below the main content. It presents a short list of
concrete product attributes rather than broad promotional claims.

The proposed items are:

- Ingredientes — 100% naturales;
- Sin granos — ni rellenos;
- Sin colorantes — ni conservantes;
- Hecho con amor — para tu mascota.

HeroBenefits provides the shared white surface, border radius, separators,
responsive layout, and list semantics. On desktop it displays one row. On
mobile it should become a two-column grid or a horizontally scrollable strip,
depending on the final text widths; it should never shrink four items into an
unreadable row.

### 14. HeroBenefitItem

The repeated unit inside HeroBenefits. Each item contains an icon, a short
title, and one supporting line.

The title carries the main attribute and the supporting line clarifies it. The
icon should reinforce the text rather than introduce a separate claim. All
icons need a consistent visual box, stroke weight, and perceived size. Icons
are decorative when their adjacent text is complete.

### 15. HeroBrandStatement

The closing statement positioned inside the teal lower field:
“Alimentación natural real para una vida extraordinaria.” It concludes the hero
and visually transitions into the next homepage section.

This should be styled as a short brand statement, not another heading and not a
call to action. The heart mark is decorative. On mobile the statement should
remain concise and centered with sufficient contrast against the teal surface.

## Composition hierarchy

The complete Hero should compose in this order:

1. HeroSection establishes the semantic and visual boundary.
2. HeroScene sits at the back and provides all non-semantic decorative shapes.
3. HeroLayout creates the content and media regions.
4. HeroCopy composes HeroEyebrow, HeroHeadline, HeroAccentRule,
   HeroDescription, and HeroActions.
5. HeroMedia composes HeroImageFrame and HeroTrustSeal.
6. HeroBenefits sits below the principal copy/media relationship and composes
   up to four HeroBenefitItem instances.
7. HeroBrandStatement closes the section within the lower teal field.

The semantic reading order must follow the same sequence even when desktop CSS
places HeroMedia beside HeroCopy. Decorative artwork must never alter document
order.

## Responsive composition

### Small screens

Use a single-column composition. The recommended order is eyebrow, headline,
description, actions, media, benefits, and brand statement. The main CTA should
appear before the large image so the user does not need to scroll past media to
understand the offer or act on it.

The image should use a purposefully chosen mobile crop. Decorative leaves should
be reduced to one or two accents, and the bottom wave should be shallower to
avoid excessive hero height. The trust seal should shrink and remain attached
to a safe corner of the image. Benefits should use two columns or horizontal
overflow with clear partial-item affordance.

### Medium screens

Retain the single-column reading order until both the headline and media have
enough width to form balanced columns. A premature two-column layout would make
the expressive headline wrap poorly and reduce the food imagery’s usefulness.

### Large screens

Use the two-column HeroLayout with copy on the left and media on the right. Keep
the headline, description, and primary action visible within the initial
viewport beneath the fixed site header. The benefit strip may overlap the
visual scene slightly, but it should remain in normal layout flow to avoid
fragile positioning.

## Content contract

Hero content should be supplied as structured content rather than embedded
throughout individual components. The content model needs:

- eyebrow label and optional icon;
- headline fragments with presentation roles;
- one supporting paragraph with optional emphasis fragments;
- one primary and one optional secondary action;
- main image source, dimensions, focal point, and alternative text;
- optional trust-seal label;
- a maximum of four benefits, each with icon, title, and supporting text;
- optional closing brand statement.

Presentation roles should be limited to known variants such as default,
expressive, and accent. Content must not provide arbitrary CSS class names or
HTML.

## Accessibility requirements

- Render exactly one page-level heading within the hero.
- Preserve a logical reading order independent of desktop positioning.
- Use semantic links for navigation actions and buttons only for true actions.
- Maintain visible keyboard focus and at least 44px interactive targets.
- Give the main photograph useful alternative text.
- Hide decorative leaves, waves, dividers, and redundant icons from assistive
  technology.
- Represent the benefits as a list and keep every claim available as text.
- Maintain WCAG AA contrast across cream, white, teal, and orange combinations.
- Do not animate essential content. Any decorative motion must respect reduced
  motion preferences.

## Performance requirements

- Treat the main photograph as the hero’s likely Largest Contentful Paint asset:
  preload it, provide accurate responsive sizes, and avoid lazy loading it.
- Export the photograph at deliberate desktop and mobile dimensions using a
  modern compressed format while preserving a source with enough resolution for
  high-density displays.
- Reserve the media dimensions before the image loads to prevent layout shift.
- Prefer SVG or CSS for leaves, seal artwork, and waves; remove editor metadata
  and unused vector paths.
- Avoid JavaScript animation and layout measurement for the scene.
- Keep benefit icons in one consistent lightweight icon system.

## Prepared asset contract

Hero-specific assets live together in `public/home/hero/`, following the
existing feature-oriented public folders such as `public/home-welcome/` and
`public/calculator/`. Shared brand artwork remains in its existing location and
must not be duplicated.

| Asset | Purpose | Intrinsic size | Treatment |
| --- | --- | --- | --- |
| `/home/hero/hero-dog-primary.webp` | Primary desktop/tablet photograph | 1200 × 900 | Meaningful image; provide descriptive alternative text and load eagerly as the likely LCP asset. |
| `/home/hero/hero-dog-mobile.webp` | Purposeful portrait crop of the same photograph | 744 × 930 | Use below the final responsive media breakpoint rather than relying on browser cropping. |
| `/home/hero/nutrition-seal.svg` | “Nutrición real · Para su bienestar” trust seal | 200 × 200 view box | Meaningful only when the same message is not present as nearby text. |
| `/home/hero/leaf-sprig.svg` | Small floating leaf accent | 128 × 92 view box | Decorative; use empty alternative text or CSS presentation. |
| `/home/hero/edge-leaves.svg` | Larger right-edge leaf cluster | 260 × 360 view box | Decorative and optional on small screens. |
| `/home/hero/background-leaves.svg` | Pale line-art texture behind the copy | 520 × 520 view box | Decorative; keep its opacity restrained. |
| `/home/hero/bottom-wave.svg` | Teal transition and orange accent at the hero base | 1600 × 250 view box | Decorative; preserve its aspect ratio through layout rather than embedding it in the photograph. |

The bowl in both photographs deliberately has a clean front surface. If the
brand mark is required on the bowl, overlay the existing
`/images/dnature-logo.svg` in the media composition. Keeping the real logo as a
separate vector prevents generated letterforms, preserves brand accuracy, and
avoids another duplicate logo asset.

The two responsive photographs should be supplied with a `<picture>` source or
equivalent framework-supported art direction. Their aspect ratios differ, so
width and height must be declared for each source rather than reusing one set of
dimensions.

## Boundaries and intentional non-components

The following should not become independent React components unless reused
elsewhere: individual leaf shapes, the short divider line, each background
curve, isolated text emphasis spans, and the orange corner accent. They are
visual details owned by HeroScene, HeroCopy, or HeroImageFrame.

The header controls shown in the reference remain outside HeroSection. The hero
may visually meet the header, but it must not own header spacing, sticky
behavior, search, navigation, or cart state.

## Suggested implementation sequence

1. Prepare and validate the primary image, mobile crop, seal, and decorative
   vector assets.
2. Build HeroSection, HeroLayout, HeroCopy, and HeroMedia with no decorative
   scene beyond the neutral background.
3. Compose the eyebrow, headline, description, and existing Button variants.
4. Add HeroBenefits and validate its mobile overflow or grid behavior.
5. Add HeroScene and HeroBrandStatement after the semantic layout is stable.
6. Verify image loading, responsive crops, keyboard navigation, contrast,
   reduced motion, and layout shift before visual polish.
