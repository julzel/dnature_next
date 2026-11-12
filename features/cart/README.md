# Shared cart

`/carrito` and the product purchase form share `features/cart/lib/cart-store.ts`.
The store uses `useSyncExternalStore`, persists under `dnature.cart.v1` in
localStorage and receives cross-tab storage events. It adds no root provider or
global navigation replacement. Storage failures and malformed saved data show
recoverable Spanish feedback; success is announced only after persistence succeeds.

`validateCartItemAction` accepts parent SKU, selected SKU, desired total quantity
and the displayed unit price. The server loads the published product through the
existing SKU join and reads all Avify inventory pages afresh before selecting the
requested SKU. The provider currently ignores its SKU filter; checking only its
first page incorrectly rejected products on later pages. It rejects hidden products,
inactive variants, missing prices, insufficient whole-unit stock, invalid inputs
and changed prices. Refreshed options let the visitor review changes and confirm
again. The client does not provide trusted product copy or prices for storage.

The PDP preserves selection and quantity during errors, locks controls while
validation runs, and prevents duplicate additions. Existing quantities count
toward inventory validation. A saved line remains a selection rather than a stock
reservation; it is not proof of availability at a later date.

The cart page supports quantity updates, removal, clearing, subtotals and a
WhatsApp inquiry containing the selected products. Payment, delivery costs and
fulfillment are coordinated with the team. No Avify order or payment mutation is
performed. A future checkout must revalidate every line and calculate its final
amount on the server; browser storage is user-controlled.

The route is noindex and reuses the existing header and footer. The product
reference contract documents the added `quantityAvailable`, introduction and
composition fields and the cart handoff.

Tests cover fresh price/stock validation, invalid inputs, source exclusions,
persistence, quantity changes, removal, pending/error/success behavior and browser
storage failures. Product tests cover keyboard use, 200% enlarged text at 320px,
and captures at 1440, 1024, 768, 390 and 320px.
