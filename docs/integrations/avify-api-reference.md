# Avify API reference

Reviewed on 2026-07-23. This map treats the current `avify.com/docs` developer navigation as the primary documentation and calls out the still-public `cms.avify.com` material only where it conflicts with the current pages. The current navigation divides the site into **Introducción**, **Uso de Avify**, **Recursos**, and **Desarrolladores**; the developer section contains only **Introducción API**, **Autenticación**, **Webhooks**, and **Órdenes V1**. [Source](https://avify.com/docs/introduccion-api)

## 1. Categorized index

| Category | Relevant page(s) | Coverage and relevance | Source(s) |
| --- | --- | --- | --- |
| Installation | **No dedicated API installation page.** **Guía de Inicio Rápido** configures the Avify product/account (company data, inventory locations, shipping, payments, billing, initial inventory, and WhatsApp), not a client library. **Introducción API** uses direct HTTP examples in cURL, JavaScript, Python, and PHP without naming an SDK or package to install. | Treat account provisioning and token creation as prerequisites; there is no documented SDK installation step. | [Quick Start](https://avify.com/docs/guia-inicio-rapido), [API Introduction](https://avify.com/docs/introduccion-api) |
| Authentication | **Introducción API** and **Autenticación** | Both use the `api-key` request header. The current introduction explicitly says not to use Bearer authentication; the older authentication page adds token scope, expiration, storage, and a `200`/`401` test response. | [API Introduction](https://avify.com/docs/introduccion-api), [Authentication](https://avify.com/docs/autenticacion-api) |
| Core concepts | **Introducción API**, **Órdenes V1**, and **Webhooks** | The introduction explains products/variants, locations, inventory, carts, orders, payment methods, GraphQL operations, and one REST upload. Órdenes V1 defines the order-domain object. Webhooks describes order-event delivery. | [API Introduction](https://avify.com/docs/introduccion-api), [Orders V1](https://avify.com/docs/ordenes-v1-api), [Webhooks](https://avify.com/docs/webhooks-api) |
| API reference | **Introducción API** (primary) and **Órdenes V1** (schema supplement) | The primary page contains the executable GraphQL/REST examples and the full documented operation index. The V1 page is an object/schema reference, not a complete endpoint reference. | [API Introduction](https://avify.com/docs/introduccion-api), [Orders V1](https://avify.com/docs/ordenes-v1-api) |
| Error handling | **Autenticación** (partial only) and **Introducción API** (incidental only) | Authentication documents a single invalid-token `401` body with code `AT-145`. GraphQL examples read a top-level `errors` value but do not define its schema or handling policy. There is no dedicated error-handling page in the developer navigation. | [Authentication](https://avify.com/docs/autenticacion-api), [API Introduction](https://avify.com/docs/introduccion-api) |
| Limits and constraints | **Introducción API**, **Órdenes V1**, **Webhooks**, and **Autenticación** | These pages document a 5 MB image limit, a 100 KB order-metadata limit, webhook delay of up to one minute, full-account token privilege, token expiration options, and performance advice for bulk reindexing. They do not document general API rate limits. | [API Introduction](https://avify.com/docs/introduccion-api), [Orders V1](https://avify.com/docs/ordenes-v1-api), [Webhooks](https://avify.com/docs/webhooks-api), [Authentication](https://avify.com/docs/autenticacion-api) |
| Production recommendations | **No dedicated production guide.** **Soporte y Recursos Adicionales** is the nearest operational page, and **Guía de Integraciones** gives one third-party credential promotion sequence. | Support says that implementation best practices exist but does not state API deployment practices. The integration guide's test-to-production credential sequence concerns Correos de Costa Rica, not the Avify public API. | [Support](https://avify.com/docs/soporte-y-recursos-adicionales), [Integration Guide](https://avify.com/docs/guia-de-integraciones) |
| Legacy/conflicting material | **CMS Introducción API** and the **CMS documentation archive** | Still-public official pages describe a REST-only API, Bearer tokens, and no test environment, conflicting with the current GraphQL/REST, `api-key`, sandbox documentation. No deprecation banner identifies the CMS material as obsolete. | [Legacy API Introduction](https://cms.avify.com/blog/docs/introduccion-api/), [Legacy documentation index](https://cms.avify.com/blog/docs/) |

## 2. Page summaries

### Introducción API

This is the effective API reference despite its introductory title. It publishes `https://sandboxapi.avify.co/graphql` for GraphQL, `https://sandboxapi.avify.co/api/v1/...` for REST, requires `api-key: TU_TOKEN`, provides an `apiTest` connectivity query, and links to an Apollo Studio sandbox. [Source](https://avify.com/docs/introduccion-api)

Its documented reference surface is:

- **Products:** list products, get a product by SKU, create a product, query inventory, and bulk-update stock. The page distinguishes a generated `sku` from the merchant's `customSku`, models variants under `children`, and can return stock per location. [Source](https://avify.com/docs/introduccion-api)
- **Locations:** list inventory locations and create/update a location; `locationId` is consumed by inventory and order operations. [Source](https://avify.com/docs/introduccion-api)
- **Orders:** add/update cart products, calculate cart totals, create an order, and list orders. The cart workflow is stateful through `cartId` and `sessionCookie`; listing orders recommends `version: "2"`. [Source](https://avify.com/docs/introduccion-api)
- **Values:** retrieve configured payment-method codes for use as `paymentMethod` during order creation. [Source](https://avify.com/docs/introduccion-api)
- **REST:** upload a product image to Avify's CDN; accepted files are converted to WebP. [Source](https://avify.com/docs/introduccion-api)
- **How-to:** a seven-step order flow sequences product lookup, locations, payment methods, cart creation/update, totals, and order creation. [Source](https://avify.com/docs/introduccion-api)

### Autenticación

This page explains dashboard-generated API keys, says a token has all privileges over the account, may have a finite or infinite expiration, is shown only once, and must be stored securely. It tests `GET /api/v1/test`, documents `200 {"ok":"ok"}`, and gives one invalid-token `401` response with error code `AT-145`. [Source](https://avify.com/docs/autenticacion-api)

Its request examples use `https://api.avify.com/api/v1/test`, while the JavaScript Fetch example contains the invalid scheme `httpss://`. The page labels its token behavior as current “@12 de julio de 2022” even though the page reports a September 6, 2025 update. [Source](https://avify.com/docs/autenticacion-api)

### Órdenes V1

This page defines the `OrderV1` domain object: identity, lifecycle status, sales channel, timestamps, customer, shipping, billing, costs, payment, notes, POS flags, products, and metadata. It includes a TypeScript schema and a large example object, but it does not document HTTP or GraphQL operations. [Source](https://avify.com/docs/ordenes-v1-api)

The page states that orders drive inventory reduction and payment, allows integration-specific status values beyond the listed states, leaves `products`/`ProductV1` undocumented, and limits merchant-supplied `metadata` to 100 KB with primitive child values. [Source](https://avify.com/docs/ordenes-v1-api)

### Webhooks

This page says webhook delivery can take up to one minute and that webhook setup currently requires contacting in-product support. It documents two configurable events—`create_order` and `update_order`—and sketches a payload that adds `event` and `forwarded` fields to an `OrderV1` object. [Source](https://avify.com/docs/webhooks-api)

It does not define the delivery HTTP method, headers, signature/authentication, exact JSON schema, success response, retry policy, timeout, ordering, idempotency, replay, or failure handling. [Source](https://avify.com/docs/webhooks-api)

### Guía de Inicio Rápido

This is product onboarding rather than API installation. It configures company details, warehouses/branches, logistics, payment methods, electronic billing, initial inventory, and WhatsApp so that the account can operate. [Source](https://avify.com/docs/guia-inicio-rapido)

### Guía de Integraciones

This page surveys Avify's logistics, e-commerce/ERP, billing, marketing, and payment-provider integrations. Its only explicit production transition is a Correos de Costa Rica example that moves from test credentials and guide generation to production credentials; it is not a public-API environment guide. [Source](https://avify.com/docs/guia-de-integraciones)

### Soporte y Recursos Adicionales

This page routes urgent technical issues to in-product WhatsApp support and offers ticket or one-to-one support depending on plan. It claims that API documentation, implementation best practices, and case studies are available, but it does not itself provide API production guidance. [Source](https://avify.com/docs/soporte-y-recursos-adicionales)

### Legacy CMS Introducción API

This still-public page describes the API as REST-only, says it uses Bearer tokens, warns that there is no test environment, and says changes affect the main dashboard. Those statements conflict directly with the current API introduction. [Source](https://cms.avify.com/blog/docs/introduccion-api/)

## 3. Important terminology

| Term | Meaning in the documentation | Source |
| --- | --- | --- |
| `api-key` | Custom HTTP header carrying the Avify token on every current documented request; it is explicitly not a Bearer token in the current reference. | [API Introduction](https://avify.com/docs/introduccion-api) |
| API token / API key | Dashboard-generated credential under Configuración → Integraciones → API; the authentication page says it has full account privilege and can expire or remain indefinite. | [Authentication](https://avify.com/docs/autenticacion-api) |
| GraphQL endpoint | Single current sandbox endpoint, `https://sandboxapi.avify.co/graphql`, used for documented queries and mutations. | [API Introduction](https://avify.com/docs/introduccion-api) |
| REST endpoint | Current sandbox base `https://sandboxapi.avify.co/api/v1/...`; only product-image upload is concretely documented on the main reference page. | [API Introduction](https://avify.com/docs/introduccion-api) |
| `apiTest` | GraphQL connectivity/authentication check that returns the store name and `store_id` when the key works. | [API Introduction](https://avify.com/docs/introduccion-api) |
| Query / mutation | GraphQL read/write operations sent as JSON to the GraphQL endpoint; products, locations, orders, inventory, carts, and payment methods use this model. | [API Introduction](https://avify.com/docs/introduccion-api) |
| `sku` | Avify-generated unique product identifier used to retrieve products and inventory and to update stock. | [API Introduction](https://avify.com/docs/introduccion-api) |
| `customSku` | Merchant/internal product code; unlike `sku`, it is supplied by the integrator. | [API Introduction](https://avify.com/docs/introduccion-api) |
| Base product / `children` | A parent product and its variants; inventory responses separate `base` from variant `children`. | [API Introduction](https://avify.com/docs/introduccion-api) |
| `locationId` | Identifier for a warehouse/store location; required by location-specific inventory updates and order creation. | [API Introduction](https://avify.com/docs/introduccion-api) |
| `selectMode: "S"` | Simplified product-list response mode recommended for lighter responses. | [API Introduction](https://avify.com/docs/introduccion-api) |
| `cartId` / `sessionCookie` | State returned by the first cart mutation and required for later cart updates, totals, and order creation. | [API Introduction](https://avify.com/docs/introduccion-api) |
| `instantReindex` | Bulk-stock option controlling whether search reindexing happens immediately; `false` is advised for large updates for better performance. | [API Introduction](https://avify.com/docs/introduccion-api) |
| `paymentMethod` | Order input populated with a code returned by the payment-method query; `checkmo` denotes manual payment. | [API Introduction](https://avify.com/docs/introduccion-api) |
| `OrderV1` | Versioned order-domain object used to represent order state, customer, fulfillment, costs, payment, products, and metadata. | [Orders V1](https://avify.com/docs/ordenes-v1-api) |
| `version: "2"` | Parameter recommended by the list-orders query for its updated response format; its relationship to the separate `OrderV1` schema is not explained. | [API Introduction](https://avify.com/docs/introduccion-api), [Orders V1](https://avify.com/docs/ordenes-v1-api) |
| `create_order` / `update_order` | Configurable webhook event names whose payload is described as an `OrderV1` plus `event` and `forwarded`. | [Webhooks](https://avify.com/docs/webhooks-api) |
| Overflow order | An order beyond the account plan's allowed order count; `isOverFlowOrder` and `overflowFee` represent this state/cost. | [Orders V1](https://avify.com/docs/ordenes-v1-api) |

## 4. Dependencies between concepts

1. **Avify account → API integration settings → token → `api-key` on every request → `apiTest` before other operations.** Token creation occurs in the dashboard, and `apiTest` is the documented connectivity check. [Source](https://avify.com/docs/introduccion-api)
2. **Product listing → `sku`/`productId` → product lookup, inventory lookup, and bulk stock updates.** The bulk update explicitly depends on identifiers obtained from existing products. [Source](https://avify.com/docs/introduccion-api)
3. **Locations → `locationId` → per-location stock and order creation.** The locations query is therefore a prerequisite when those IDs are not already persisted locally. [Source](https://avify.com/docs/introduccion-api)
4. **Payment-method query → `paymentMethod` → order creation.** The configured method code must be supplied when creating an order. [Source](https://avify.com/docs/introduccion-api)
5. **Add cart product → preserve `cartId` and `sessionCookie` → optional cart update → cart totals → create order.** Sending quantity `0` removes a cart product, and totals are intended to run after cart changes and before order creation. [Source](https://avify.com/docs/introduccion-api)
6. **Product + location + payment method + cart state + valid channel → order.** The documented order guide names these as prerequisites for the final creation mutation. [Source](https://avify.com/docs/introduccion-api)
7. **Order creation/update → `OrderV1` domain object → `create_order`/`update_order` webhook payload.** The webhook page reuses the order schema and adds event metadata. [Source](https://avify.com/docs/webhooks-api), [Orders V1](https://avify.com/docs/ordenes-v1-api)
8. **Bulk stock volume → reindex strategy.** Immediate reindexing improves visibility, while deferred reindexing is the documented performance choice for many products. [Source](https://avify.com/docs/introduccion-api)

## 5. Documented limits and operational constraints

| Area | Documented constraint | What remains unspecified | Source |
| --- | --- | --- | --- |
| Authentication | Tokens have full account privileges, may have finite or infinite expiration, and are shown only once. | Scopes, rotation, revocation behavior, overlap during rotation, audit logs, and key-count limits. | [Authentication](https://avify.com/docs/autenticacion-api) |
| Webhooks | Delivery may take up to one minute; setup is manual through support. | Retry schedule, maximum attempts, ordering, duplicate delivery, signature verification, timeout, replay, and retention. | [Webhooks](https://avify.com/docs/webhooks-api) |
| Product image upload | Maximum 5 MB; PNG, JPG, JPEG, WebP, and GIF accepted; output converted to WebP. | Image dimensions, animation handling, storage quota, CDN retention, and whether the upload alone associates the result with a particular product. | [API Introduction](https://avify.com/docs/introduccion-api) |
| Order metadata | Maximum 100 KB; child values may only be `string`, `boolean`, `float`, or `int`. | Nesting depth, key count/length, encoding, rejection status/error, and whether `null` is allowed. | [Orders V1](https://avify.com/docs/ordenes-v1-api) |
| Pagination | Product and order queries expose `pageNum` and `pageSize`; examples use `10`. | Maximum/default `pageSize`, stable ordering, cursor alternatives, and consistency during concurrent writes. | [API Introduction](https://avify.com/docs/introduccion-api) |
| Bulk inventory | Multiple products/locations are allowed in one request; `instantReindex: false` is advised for many products. | Maximum products/locations per request, atomicity, partial-failure behavior, and reindex completion visibility. | [API Introduction](https://avify.com/docs/introduccion-api) |
| Plan order volume | The schema exposes `isOverFlowOrder` and `overflowFee` when the plan's order allowance is exceeded. | The numeric allowance, whether creation can be rejected, and how the fee is calculated. | [Orders V1](https://avify.com/docs/ordenes-v1-api) |
| General API traffic | No rate-limit, concurrency, request timeout, availability, or general payload-size policy appears in the four-page developer section. | All of those controls, plus any `429` format and retry headers. | [API Introduction](https://avify.com/docs/introduccion-api), [Authentication](https://avify.com/docs/autenticacion-api), [Webhooks](https://avify.com/docs/webhooks-api), [Orders V1](https://avify.com/docs/ordenes-v1-api) |

## 6. Unclear, missing, deprecated, or contradictory areas

### Missing

- **Installation/SDK guidance:** there is no SDK list, package installation, supported-runtime matrix, generated client, OpenAPI document, or GraphQL client setup; the examples use raw HTTP. [Source](https://avify.com/docs/introduccion-api)
- **Production environment:** the current reference publishes only `sandboxapi.avify.co` endpoints and does not label a production base URL, promotion procedure, data-isolation model, or test-data reset process. [Source](https://avify.com/docs/introduccion-api)
- **Production practices:** there is no API-specific guidance for secret management, token rotation, least privilege, retries/backoff, connection timeouts, idempotency, observability, alerting, reconciliation, or disaster recovery. The support page only says implementation best practices are available. [Source](https://avify.com/docs/soporte-y-recursos-adicionales), [API Introduction](https://avify.com/docs/introduccion-api)
- **Error contract:** only one authentication failure is documented. GraphQL error shape, REST error catalog, validation errors, partial GraphQL data, retryability, `429`, and `5xx` behavior are absent. [Source](https://avify.com/docs/autenticacion-api), [API Introduction](https://avify.com/docs/introduccion-api)
- **Webhook contract:** endpoint registration fields, transport/authentication, signature verification, retry and deduplication semantics, ordering, acknowledgement requirements, IP ranges, and a valid full payload example are absent. [Source](https://avify.com/docs/webhooks-api)
- **Schema completeness:** `ProductV1` inside `OrderV1` is explicitly left undocumented even though products are central to order payloads. [Source](https://avify.com/docs/ordenes-v1-api)
- **Versioning/deprecation policy:** there is no changelog, support window, migration guide, schema version policy, or deprecation marker for the still-public legacy CMS pages. [Source](https://avify.com/docs/introduccion-api), [Legacy API Introduction](https://cms.avify.com/blog/docs/introduccion-api/)

### Contradictory or likely stale

- **Protocol/auth/environment conflict:** the current page documents GraphQL plus REST, an `api-key` header, and a sandbox. The legacy official page says REST-only, Bearer authentication, and no test environment. [Source](https://avify.com/docs/introduccion-api), [Legacy API Introduction](https://cms.avify.com/blog/docs/introduccion-api/)
- **Base URL conflict:** the current page uses `sandboxapi.avify.co`, while the separate authentication page tests `api.avify.com`; neither page explains whether the latter is production or legacy. [Source](https://avify.com/docs/introduccion-api), [Authentication](https://avify.com/docs/autenticacion-api)
- **Broken authentication example:** the Fetch example uses `httpss://api.avify.com/api/v1/test`, which is not a valid HTTPS URL. [Source](https://avify.com/docs/autenticacion-api)
- **Version mismatch:** the current list-orders example says to use `version: "2"` for the updated format, but the only standalone order schema page is `Órdenes V1`; their compatibility or migration path is not described. [Source](https://avify.com/docs/introduccion-api), [Orders V1](https://avify.com/docs/ordenes-v1-api)
- **Stale token statement:** the authentication page describes token capabilities as current on July 12, 2022 while reporting a September 6, 2025 page update, so the full-account privilege and lifetime claims need vendor confirmation before production use. [Source](https://avify.com/docs/autenticacion-api)
- **Type contradiction:** `wasRefunded` is labeled `float`, described as a true/false condition, and shown as `false` in the example; it should be confirmed as a boolean or corrected consistently. [Source](https://avify.com/docs/ordenes-v1-api)
- **Image association ambiguity:** the REST section says an uploaded image is associated with a product, but the documented multipart request contains only `image` and no product identifier; the response returns a CDN URL/key without explaining the association step. [Source](https://avify.com/docs/introduccion-api)
- **Open-ended enums:** the V1 page lists order statuses and channels but warns that integrations can introduce other status values, so consumers cannot safely treat the lists as closed enums. [Source](https://avify.com/docs/ordenes-v1-api)

## Recommended clarification order before implementation

1. Confirm the production base URL, supported API surface (GraphQL, REST, or both), authentication scheme, and whether the CMS documentation is deprecated. These points currently conflict. [Source](https://avify.com/docs/introduccion-api), [Legacy API Introduction](https://cms.avify.com/blog/docs/introduccion-api/)
2. Obtain the current GraphQL schema or an introspection/export artifact plus the exact relationship between order response `version: "2"` and `OrderV1`. [Source](https://avify.com/docs/introduccion-api), [Orders V1](https://avify.com/docs/ordenes-v1-api)
3. Obtain rate limits, timeout/retry guidance, idempotency guarantees for writes/order creation, and complete error catalogs before designing production request handling. [Source](https://avify.com/docs/introduccion-api), [Authentication](https://avify.com/docs/autenticacion-api)
4. Obtain the webhook registration, signing, acknowledgement, retry, duplicate, and ordering contract before accepting production events. [Source](https://avify.com/docs/webhooks-api)
5. Confirm token rotation/revocation behavior and whether narrower scopes exist, because the documented token has full account privileges. [Source](https://avify.com/docs/autenticacion-api)
