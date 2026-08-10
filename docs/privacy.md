# Engineering data and privacy inventory

This is an engineering data-handling policy, not a substitute for a customer
privacy notice or legal advice. The DNAture project owner owns the customer
notice and legal review.

## Data stored in the browser

| Key | Contents | Retention | Customer control |
| --- | --- | --- | --- |
| `dnature-active-cart-v1` | Product identifiers, names, presentations, quantities, prices, and optional image/SKU references for the active cart; no customer or checkout-preference fields | 30 days from the latest stored cart state | Empty the cart or clear this site's browser data; expired or malformed records are ignored. |
| `client` | Name, email, phone, and delivery address entered in checkout | 30 days only when the customer selects “Recordar mis datos” | Clear that option in checkout or clear this site's browser data; expired or legacy data is removed on read. |
| `carts` | Up to five locally prepared request references with products, generated reference, date, fulfillment mode, and recalculated totals; no customer, address, payment, or notes fields | 30 days from preparation | Use “Eliminar referencias guardadas” in checkout or clear this site's browser data. Older records are rewritten without personal data; expired, malformed, and unknown-version records are ignored. |
| `dnature-analytics-consent` | Consent-manager decision only | Defined by the approved consent manager | The consent manager must provide withdrawal and deletion controls. |

The active-cart record intentionally excludes fulfillment, payment preference,
notes, and customer details. A browser reload may therefore preserve products
without restoring those checkout choices.

## Data stored for customer accounts

Authenticated account data is stored in Supabase Postgres and protected by
row-level security. Stage 1 includes identity records, customer profile and
address data, preferences, pet profiles, and saved-cart snapshots. Customers
must not be able to read or mutate another customer's rows; this boundary is
covered by the pgTAP isolation suite.

The publishable Supabase key is not a secret and does not replace RLS. Never use
a service-role or secret key in browser code or ordinary customer operations.
Retention, export, account deletion and the public privacy notice remain launch
decisions recorded in the Stage 1 requirements and decision register.

Signed-in customers may explicitly save account information and cart
selections through Supabase. A saved selection contains product snapshots, not
checkout contact data and not an order. Restoring it reconciles identity and
price against the published catalogue before checkout continues.

## Assisted checkout and generated files

The guest checkout flow does not submit customer details to a DNAture order
API. Before the personal-data form, a first-party server action receives the
cart items and fetches the published Contentful catalogue to reconcile product
identity and price. It does not send customer details to Contentful and does not
check inventory.

The final PNG is generated and downloaded in the customer's browser. It may
contain name, email, phone, address, fulfillment and payment preferences,
instructions, products, prices, and a client-generated reference. The
application does not upload the PNG. The customer controls the downloaded file
and must remove it from the device when it is no longer needed.

The generated `DN-…` value is not a server-side order identifier. Local
references are retained only to reconstruct a future cart and deliberately omit
the personal and checkout fields listed above.

## WhatsApp disclosure

The checkout link targets WhatsApp/Meta and contains a prefilled query with up
to twelve product-summary lines, the generated reference, estimated total,
fulfillment mode, and payment preference.
Opening that link discloses those query values plus ordinary request metadata
such as IP address and user agent to WhatsApp/Meta, even if the customer does
not send the message. Name, email, phone, address, and free-text notes must never
be included in this URL.

The PNG is not automatically attached or transmitted. The customer must attach
it and send the message in WhatsApp. From that point, the information is handled
through DNAture's WhatsApp operating process and applicable Meta services; this
repository does not store or govern the resulting conversation.

Do not add server-side order submission, CRM, payment, automated messaging, or
marketing integrations without updating this policy, the public privacy
notice, monitoring redaction rules, vendor review, and the CSP where relevant.

## Monitoring redaction

Production error events are limited to error name, redacted message, source,
route, and timestamp. Email addresses and phone-like numbers are replaced before
an event is sent. Do not attach form values, cart contents, addresses, headers,
or Contentful credentials to a monitoring event.

## Review cadence

The project owner reviews this inventory quarterly and before adding a new
browser key, third-party script, form field, or persistence mechanism.
