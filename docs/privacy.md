# Engineering data and privacy inventory

This is an engineering data-handling policy, not a substitute for a customer
privacy notice or legal advice. The DNAture project owner owns the customer
notice and legal review.

## Data stored in the browser

| Key | Contents | Retention | Customer control |
| --- | --- | --- | --- |
| `client` | Name, email, phone, and delivery address entered in checkout | 30 days | Uncheck “Recordar mis datos” to remove it immediately; expired or legacy data is removed on read. |
| `carts` | Up to five saved order snapshots, including checkout details needed to reopen an order | 30 days from save | Use “Eliminar historial guardado” in the cart. Expired, malformed, and unknown-version records are ignored. |
| `dnature-analytics-consent` | Consent-manager decision only | Defined by the approved consent manager | The consent manager must provide withdrawal and deletion controls. |

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

The guest checkout flow does not submit customer details to a DNAture order API.
It generates an order image on the customer’s device. Signed-in customers may
explicitly save account information and cart snapshots through Supabase. Do not
add server-side order submission, CRM, payment, or marketing integrations
without updating this policy, the public privacy notice, monitoring redaction
rules, and the CSP.

## Monitoring redaction

Production error events are limited to error name, redacted message, source,
route, and timestamp. Email addresses and phone-like numbers are replaced before
an event is sent. Do not attach form values, cart contents, addresses, headers,
or Contentful credentials to a monitoring event.

## Review cadence

The project owner reviews this inventory quarterly and before adding a new
browser key, third-party script, form field, or persistence mechanism.
