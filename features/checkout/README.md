# WhatsApp checkout

`/carrito` combines the persistent cart with guest checkout. Product detail already
validates the selected presentation, quantity, current price, and stock before
adding it. The header exposes the cart on every page.

## Current business rules

- Product prices are treated as **before IVA**, per the checkout requirement.
- Subtotal is rounded to whole colones; IVA is 13% of that subtotal, rounded once.
- Pickup adds no delivery fee and does not request/send an address.
- GAM delivery adds ₡3,500 **after** product IVA. This is the final delivery fee;
  no additional IVA is applied to delivery in this implementation.
- Outside-GAM delivery requires an address but has a pending shipping fee. UI and
  message explicitly label the displayed amount “Total sin envío”. The team quotes
  delivery and confirms the final amount through WhatsApp.
- The customer chooses the delivery zone; the team confirms address coverage.
- Orders require a contact name/phone; delivery additionally needs province,
  canton, district, exact address, and delivery zone. Notes are optional.

## Order lifecycle

`prepareOrderAction` validates input and performs **one fresh, fully paginated inventory
snapshot** shared by all parent SKUs. Avify currently ignores its SKU filter, so products are selected locally after all
inventory pages have loaded. Each line reuses the cart's price/availability rules.
Client-supplied identity, images, totals, taxes, and fees are not trusted. A changed
price or insufficient stock blocks the draft and asks the customer to review the
affected products. Integration failure preserves the cart and customer input.

The returned order is an **unsent, unpaid draft**, with a reference used to identify
the message. It is not persisted as an accepted order, does not reserve inventory,
and is not a tax invoice or proof of payment. The customer reviews it, then opens
a configured WhatsApp link and sends it themselves. The app never sends a message
automatically or claims receipt/confirmation. Reopening the message reuses the
same draft; no duplicate backend order is created.

Customer details/drafts stay in page memory. Only cart lines persist in browser
storage. Changing the cart invalidates the visible order summary, including
cross-tab changes during validation. Unapplied quantity edits block checkout.
Copy and text download are available; particularly long messages use a plain
WhatsApp link so the customer can paste or attach the order instead of relying on
an oversized URL. The cart is retained after opening WhatsApp.

## Future payments

Order types distinguish draft and payment state, and calculation/validation live
on the server boundary separately from WhatsApp formatting. Card payments still
require durable server-side orders, idempotency, a payment provider, verified
webhooks, and stock reservation/fulfillment rules. Never treat a client redirect
or an opened WhatsApp link as payment confirmation.

Tests cover tax/delivery arithmetic, address validation, tampered requests,
duplicate lines, changed inventory/prices, pickup privacy, quote wording, browser
errors, draft invalidation, and the real add-to-cart → WhatsApp review journey.
