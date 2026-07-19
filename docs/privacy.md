# Browser storage and privacy policy for the application

This is an engineering data-handling policy, not a substitute for a customer
privacy notice or legal advice. The DNAture project owner owns the customer
notice and legal review.

## Data stored in the browser

| Key | Contents | Retention | Customer control |
| --- | --- | --- | --- |
| `client` | Name, email, phone, and delivery address entered in checkout | 30 days | Uncheck “Recordar mis datos” to remove it immediately; expired or legacy data is removed on read. |
| `carts` | Up to five saved order snapshots, including checkout details needed to reopen an order | 30 days from save | Use “Eliminar historial guardado” in the cart. Expired, malformed, and unknown-version records are ignored. |
| `dnature-analytics-consent` | Consent-manager decision only | Defined by the approved consent manager | The consent manager must provide withdrawal and deletion controls. |

The checkout flow does not submit customer details to a DNAture application API.
It generates an order image on the customer’s device. Do not add server-side
order submission, CRM, payment, or marketing integrations without updating this
policy, the public privacy notice, monitoring redaction rules, and the CSP.

## Monitoring redaction

Production error events are limited to error name, redacted message, source,
route, and timestamp. Email addresses and phone-like numbers are replaced before
an event is sent. Do not attach form values, cart contents, addresses, headers,
or Contentful credentials to a monitoring event.

## Review cadence

The project owner reviews this inventory quarterly and before adding a new
browser key, third-party script, form field, or persistence mechanism.
