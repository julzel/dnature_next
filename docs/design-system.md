# DNAture design system

This document is the source of truth for reusable visual and interaction
patterns. It starts with calls to action and will grow to cover tokens,
typography, layout, forms, and feature-specific patterns.

The live visual reference is available at `/design-demo` in local development.

## Calls to action

Use `components/Button` for actions that navigate, advance a flow, submit,
confirm, cancel, or make a destructive change. It renders a native `button` by
default and a Next.js `Link` when `href` is supplied, so the semantic element
always matches the outcome.

| Intent | `variant` | Examples | Rule |
| --- | --- | --- | --- |
| Primary | `primary` | Comprar, Continuar, Confirmar, Siguiente | One decisive action per action group. |
| Secondary | `secondary` | Cancelar, Anterior | A reversible or supporting alternative to the primary action. |
| Tertiary | `tertiary` | Regresar, Volver al inicio | Low-emphasis navigation or a non-critical alternative. |
| Accent | `accent` | Empezar calculadora, campaign entry points | A standalone promotional or guided-flow entry point; do not compete with a primary purchase action. |
| Destructive | `danger` | Vaciar carrito, Eliminar historial | Must be paired with a confirmation step when the change cannot be easily undone. |

### Button API

```jsx
<Button variant="primary" size="large" onClick={save}>
  Guardar cambios
</Button>

<Button href="/productos" variant="primary">
  Comprar
</Button>

<Button variant="secondary" fullWidth onClick={onCancel}>
  Cancelar
</Button>
```

Available props: `variant`, `size` (`small`, `medium`, `large`), `fullWidth`,
`loading`, `disabled`, `iconStart`, `iconEnd`, and `iconOnly`. An icon-only
button must always receive an accessible name through `aria-label`.

### What is not a CTA

Keep these controls local to their feature rather than forcing them into the CTA
component:

- quantity steppers and remove-item controls;
- calculator option buttons and filter/category choices;
- slider tabs, modal-close buttons, and overflow-menu triggers.

They represent selection, navigation within a widget, or a compact utility
control—not a call to action. They still need visible focus, a 44px target where
practical, and an accessible name when their icon has no text.

## Ecommerce header

The header uses a restrained commerce hierarchy rather than giving every link
the same visual weight:

1. The 30px announcement bar carries one delivery message, one trust signal,
   and a support link.
2. The main row prioritizes brand, product entry, search, account, and cart—in
   that order. Search owns the flexible space; account and cart use compact,
   icon-only controls with accessible names. Favorites remain reserved for a
   future phase.
3. On desktop, low-frequency navigation moves into a quiet 46px row. On mobile,
   it moves into a drawer while search gets its own full-width row.

The fixed header is 158px tall on mobile/tablet and 142px on desktop, uses 44px
minimum targets, keeps visible focus states, and avoids promotional imagery.
Account is available on mobile and desktop; no visible “Mi cuenta” label is
added to the main row. Favorites remain hidden until that feature exists.

### Site search

Header search currently returns products and uses a typed result contract so
FAQ and article providers can be added later. Search behavior follows these
rules:

- wait for at least two characters and debounce requests;
- show at most six concise results with one lightweight thumbnail each;
- support pointer use plus Arrow Up, Arrow Down, Enter, and Escape;
- expose loading, empty, and recoverable error states without shifting layout;
- clear stale requests when the query changes;
- navigate directly to a result instead of adding an unnecessary results page.

The search icon communicates the field purpose. The trailing control appears
only when text is present and clears the query; filtering controls should not be
shown until real filter behavior exists.

## Product catalogue

The `/productos` page is for category discovery and comparison. Header search
handles direct product lookup, so the catalogue does not repeat a search field.

- The page has a concise title and immediately reports the current result count.
- Categories are URL-backed single-select chips. The rail scrolls horizontally
  on narrow screens and stays below the fixed header while the catalogue scrolls.
- The product grid uses one column on very narrow screens, two columns from
  400px, three from 768px, and four from 1024px. It is capped at 1280px with
  16px mobile and 24px desktop gaps.
- Cards use a 4:3 product image, a 16px rounded outline, no default shadow, and
  a hover-only image zoom on pointer devices.
- Card order is category, name, price, presentation, then action. Image and
  name link to the detail page; the purchase action remains separate.
- A simple product exposes `Agregar`; one with presentation-based pricing uses
  `Ver opciones` so the customer chooses a size before adding it.

### Home product discovery

The home page presents available product categories as complete linked cards,
not buttons layered over imagery. Each card contains a 4:3 image, category name,
and the quiet action `Explorar`; a separate `Ver todo el catálogo` action serves
customers who do not want to choose a category first. Use one column at 320 px,
two from the small breakpoint, and four only on desktop.

## Welcome and product principles

The welcome section introduces DNAture through three concise principles:
natural ingredients, purposeful formulation, and responsibly incorporated raw
food. Icons are decorative; the heading and supporting text carry the meaning.
The `wild-plate.jpg` ingredient photograph sits between the introduction and
the principles as visual evidence of the product approach; it is content, not a
decorative background, and therefore keeps a descriptive alternative text.
Principle cards use one column on mobile, a balanced two-plus-one layout on
tablet, and three equal columns on desktop. Avoid entrance animations that make
basic product information depend on scrolling or motion.

Copy must describe product characteristics without declaring DNAture the
healthiest option, guaranteeing nutritional absorption, or implying that every
recipe meets every animal's needs. More specific nutritional claims require the
approved product formulation and clinical wording.

## Home hero

The Hero presents one proposition, one clear next step, and four compact trust
signals. The primary action opens product discovery; portion calculation remains
available through site navigation rather than competing in the Hero. The
dog-and-bowl photograph remains content-bearing and must retain useful
alternative text rather than becoming a CSS background.

On mobile the composition is copy, actions, image, then a readable two-by-two
benefit card. From tablet it becomes two columns and the benefit card becomes a
single row. The benefit surface overlaps the beginning of Welcome to create a
clear visual transition after the promotional Banner was removed. Avoid
negative overlaps between the CTA and photograph, forced full-viewport heights,
or four tiny benefit columns at 320 px.

## Assisted checkout

The checkout is a request-building flow, not an online transaction. Its content
must preserve these status distinctions:

1. **Carrito:** editable selection; nothing is reserved.
2. **Datos:** contact and conditional delivery fields; no account is required.
3. **Revisión:** a local summary that has not been sent.
4. **Resumen preparado:** PNG downloaded when the browser permits it; still not
   sent or confirmed.
5. **WhatsApp:** the customer sends the prepared product summary and manually
   attaches the PNG when available.
6. **Confirmed order:** only DNAture staff can establish this state outside the
   current application.

Use truthful action labels such as `Revisar solicitud`, `Continuar con mis
datos`, `Revisar solicitud`, `Preparar para WhatsApp`, and `Continuar por
WhatsApp`. Do not use `Pagar`, `Pedido enviado`, `Compra completada`, `Compra
segura`, or another label that implies inventory, transmission, payment, or
acceptance the application cannot prove.

Pickup/delivery and payment preference are radio-card groups with a visible
legend, native inputs, keyboard focus, and one selected value per group. Address
fields appear only for delivery. Guest checkout remains the default complete
path; sign-in is an optional convenience for prefill and saved selections.
When public registration is enabled, the data step may offer a compact account
invitation with concrete benefits and separate create/sign-in links. It must
label the account as optional and keep the guest form and primary checkout
action immediately available. During invitation-only pilots, do not advertise
public account creation.

Checkout dialogs use one visual surface, a constrained desktop width, and a
full-height mobile layout. Their content scrolls independently, the page behind
them is inert, focus remains trapped and returns to the triggering control, and
Escape remains available. Dialogs containing entered customer data do not close
from an accidental backdrop click; they always expose a labelled close button.

Catalogue prices are net. Checkout adds 13% IVA and an estimated ₡3,500
delivery fee when applicable. Totals still use `estimado` because inventory,
delivery coverage, and merchant acceptance require manual confirmation. A
Contentful reconciliation may remove unavailable catalogue entries or update
published prices, but it must never be presented as an inventory check. If
values change, show the explanation and return control to the customer for
another review.

The final review and WhatsApp confirmation are separate surfaces. The latter
must state that:

- the image was downloaded rather than sent, or that its download failed;
- the customer must attach it manually when available;
- payment must wait for DNAture's response; and
- closing preserves the cart while starting another request empties it.

All customer copy uses Costa Rican voseo and remains usable at 320 px without
horizontal overflow. Validation explains how to correct a field; it does not
only say that the field is invalid.

## Contact and location

The home contact section closes the commercial journey with one clear heading,
three distinct communication channels, current service expectations, and a
store-location card. Channel cards are full-width touch targets on mobile and
must expose the destination in visible text rather than relying on an icon.

WhatsApp is the featured channel, while Instagram and email retain equal
semantic link behavior with lower visual emphasis. The embedded map is an
enhancement: the store name and locality remain visible while it loads or when
the API is unavailable, and an independent Google Maps link must always work.
Use the shared values in `constants/contact.js` and `constants/store.js` rather
than duplicating phone, schedule, response target, or coordinates.

## Frequently asked questions

The FAQ is an information-retrieval surface, not a long static document. Keep
questions in `features/Faq/FaqList/data.js`, grouped by a stable category and
question ID so search, filters, structured data, and accordion relationships
all share one source.

- Mobile uses a horizontally scrollable topic rail; desktop adds a sticky topic
  index. Both controls expose their selected state to assistive technology.
- Search ignores capitalization and Spanish accent marks and searches both the
  question and answer. Always report the number of matches through a polite live
  region and offer a reset plus WhatsApp fallback when none match.
- Accordion triggers are native buttons with `aria-expanded` and
  `aria-controls`; answer regions are named by their corresponding question.
- General education, product claims, and clinical guidance must remain visibly
  distinct. A highlighted note is reserved for safety, escalation, or another
  condition the customer should not miss.
- Medical conditions, therapeutic diets, and supplements require veterinary
  framing. FAQ copy must not diagnose, prescribe, promise a health outcome, or
  imply that “natural” automatically means nutritionally complete.
- Operational answers state current capabilities without inventing fixed
  delivery days, availability, promotions, advisory prices, or clinical
  customization. Link to the catalogue, calculator, plan, or WhatsApp when that
  is the honest next step.

## Customer stories

Testimonials use an editorial card with one real customer photograph, the full
quote, attribution, and an optional verified social profile. The section is
introduced by a clear heading so the carousel is not encountered without
context. Photographs lead on mobile and sit beside the quote on larger screens.

Testimonials do not advance automatically: customers must be able to finish a
long quote without the interface moving beneath them. Carousel tabs retain
keyboard navigation and visible focus, while decorative quotation marks remain
hidden from assistive technology. Never shorten, rewrite, or make new health
claims inside an attributed customer quote.

## DNAture system

The home-page system section explains the product approach before presenting
potential wellbeing outcomes. It pairs one ingredient photograph with a short
description, three concrete product characteristics, and direct paths to the
portion calculator and the full DNAture plan.

Potential benefits use cautious, non-guaranteed language. Do not present food as
a cure, promise clinical outcomes, or replace veterinary advice. Cards remain
one column on mobile, two on tablet, and may use a balanced five-card layout on
desktop. Avoid full-viewport promotional panels and fixed background images;
they reduce readability and perform poorly on mobile devices.

## Footer

The footer is a compact navigation and trust surface, not a duplicate of every
site route. It includes the brand promise, direct contact channels, current
support hours, store location, and links to the public catalogue, calculator,
plan, FAQ, and customer-account entry. Do not expose development, checkout, or
authenticated routes as discovery links.

Search-engine discovery is handled by `/sitemap.xml` and `robots.txt`; a visible
technical sitemap link is unnecessary. The short HTML navigation remains useful
for customers, keyboard users, and internal linking. On mobile it uses one
column, expands to two columns on tablet, and reaches three columns only when
the content has enough room.

## Next additions

- color and typography tokens;
- form-field and validation states;
- cards, surfaces, and spacing;
- navigation and product patterns.
