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

1. The 30px announcement bar carries one delivery promise, one trust signal,
   and a support link.
2. The main row prioritizes brand, product entry, search, and cart—in that
   order. Search owns the flexible space and the cart uses the strongest
   utility treatment. Account and favorites remain reserved for a future phase.
3. On desktop, low-frequency navigation moves into a quiet 46px row. On mobile,
   it moves into a drawer while search gets its own full-width row.

The fixed header is 158px tall on mobile/tablet and 142px on desktop, uses 44px
minimum targets, keeps visible focus states, and avoids promotional imagery.
Account and favorites are intentionally hidden until those features exist.

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

## Product detail

Product detail pages prioritize evaluation and a clear purchase decision:

- Breadcrumbs lead back to the catalogue without adding a separate back-control.
- The gallery uses a 4:3 neutral surface and takes 55% of the desktop layout;
  product information uses the remaining 45%.
- Product information follows category, name, price/presentation, quantity, and
  purchase action. Quantity is chosen locally and only affects the cart after
  the explicit add action.
- Mobile keeps the purchase action in a safe-area-aware sticky bottom bar while
  desktop keeps it beside the gallery.
- Description and ingredients remain expanded, vertically stacked sections.
  Benefit icons are capped at four and must represent real product attributes.
- Missing imagery gets a branded placeholder. A product with
  `availability: 'unavailable'` remains viewable and shows a clear unavailable
  state instead of an active purchase control.
- Loading uses a layout-matched skeleton rather than a full-page spinner.

## Next additions

- color and typography tokens;
- form-field and validation states;
- cards, surfaces, and spacing;
- navigation, product, cart, and modal patterns.
