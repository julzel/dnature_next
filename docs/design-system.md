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

## Next additions

- color and typography tokens;
- form-field and validation states;
- cards, surfaces, and spacing;
- navigation, product, cart, and modal patterns.
