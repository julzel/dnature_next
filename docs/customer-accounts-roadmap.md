# DNAture customer accounts implementation roadmap

- **Status:** Proposed
- **Source:** `docs/customer-accounts-prd.md`
- **Audience:** Product, design, engineering, content/nutrition, operations,
  support, and privacy/legal
- **Launch locale:** Spanish for Costa Rica (`es-CR`)

## 1. Executive recommendation

Build the feature as a guest-first account layer using Supabase Auth and
Supabase Postgres while continuing to deploy the Next.js application on
Netlify. Deliver it in vertical slices: passwordless email first, then core
account value, then Google and Facebook, and finally explainable
personalization.

The account should initially earn its place by helping customers do four things:

1. Save each pet and its Plan DNAture/PDR information.
2. Turn a PDR into a practical shopping plan for 7, 14, or 30 days.
3. Save and resume carts on another device without losing a guest cart.
4. Reuse delivery information and receive understandable product suggestions.

The cart **should be integrated with accounts**. It is one of the clearest
reasons to create an account, even before DNAture accepts payment online. The UI
must describe these records as active or saved carts, never as submitted,
fulfilled, or paid orders. Guest browsing, Plan DNAture, cart, and checkout must
remain available without an account.

This roadmap intentionally puts privacy, data isolation, deletion, and failure
behavior before broad promotion. A convenient login that risks exposing one
customer's pets, address, or cart to another customer is not a viable MVP.

## 2. Decisions resulting from the PRD and repository review

| Area | Decision | Reason |
| --- | --- | --- |
| Authentication/data | Use Supabase Auth plus Postgres/RLS behind a DNAture domain layer | It fits the PRD, supports the required providers, and keeps customer data relational and owner-scoped |
| Hosting | Keep the Next.js app on Netlify; Supabase remains the external auth/database service | Netlify supports App Router, Server Actions, Route Handlers, SSR, and Proxy/Middleware through OpenNext |
| Launch methods | Email OTP, Google, and Facebook; no consumer Instagram login | Email provides an independent recovery path; Instagram login does not match this consumer-account use case |
| Account requirement | Optional everywhere in the current experience | An outage or provider problem must not block catalogue, Plan DNAture, cart, or checkout |
| Cart | Integrate both an active cart and explicit saved cart snapshots | Cross-device continuity is high-value, but saved carts are not order history |
| Pet data | Reuse the existing Plan DNAture model and calculation | One source of truth prevents different PDR answers for guests and account holders |
| Recommendations | Start with deterministic, content-approved rules | Reasons can be audited and explained; the available data does not justify machine learning |
| Marketing | Separate and off by default | Account operation and on-site personalization do not imply consent to email/SMS marketing |
| Public rollout | Email flow first internally; provider buttons independently flagged | Google/Meta production approvals and failures should not block the whole account feature |
| Future orders | Do not create an “order history” yet | The current checkout generates a summary/image but does not submit an order to a backend |

### 2.1 Required amendments/clarifications to the PRD

These should be recorded in the PRD during Story 0.2 before implementation:

- Replace the absolute `HttpOnly` wording in `AUTH-03` with a tested,
  vendor-supported Supabase SSR cookie profile. Require PKCE, `Secure` in
  production, an approved `SameSite` value, strict cache isolation, server-side
  claim validation, CSP/XSS controls, and no application-managed auth tokens in
  `localStorage`. The exact cookie flags must follow the supported SDK flow and
  pass a security review.
- Use the current Supabase SSR approach with separate browser/server clients and
  the existing Next.js `proxy.js`. Customer routes and auth responses must be
  dynamic and `private, no-store`; a `Set-Cookie` response must never enter a
  shared Netlify cache.
- Create all customer tables through reviewed SQL migrations. Enable RLS
  explicitly, revoke automatic/default access, grant only required operations,
  and test every policy with two different users. Dashboard defaults are not a
  control that can replace source-controlled migrations.
- Add a first-class active cart to the logical data model. Prefer a unified
  `carts`/`cart_items` model with `kind = active | saved`, one active cart per
  user, no embedded address/phone/email, and a maximum of five saved snapshots.
- Treat saved name/price/presentation values as historical display data only.
  Reopening a cart must use stable catalogue/Avify identifiers and revalidate
  current price and availability.
- Select a production SMTP service and authenticate a DNAture-owned sender
  domain before public email OTP. Supabase's default sender is for testing, not
  production.

## 3. Customer value strategy

### 3.1 MVP value proposition

Use simple, specific Spanish copy rather than promising vague personalization:

> Creá tu cuenta para guardar la información de tus mascotas, calcular cuánto
> alimento necesitás, retomar tus carritos y recibir recomendaciones para cada
> mascota.

The highest-value account home modules should be:

1. **Mis mascotas:** selected pet, PDR, and a direct action to update the plan.
2. **Plan de compra:** estimated food needed for a chosen period and suggested
   package quantities.
3. **Carrito actual:** resume the current cart and see when it was last updated.
4. **Recomendado para [mascota]:** explainable products only after the catalogue
   taxonomy is approved; otherwise show popular products.
5. **Accesos rápidos:** saved addresses, saved carts, privacy, and sign-out.

### 3.2 Value backlog after the core is stable

| Priority | Feature | Customer value | Release condition |
| --- | --- | --- | --- |
| Next | Favorites (“Mis favoritos”) | Makes comparison and later purchase easier | Core account and catalogue identifiers are stable |
| Next | On-site PDR review reminder | Encourages recalculation when weight or life stage changes | Customer chooses the reminder; no marketing assumption |
| Next | Recently viewed products | Helps customers continue product research | Retention and analytics rules are approved |
| Later | Download/share pet plan | Useful reference for the household | Spanish document content and disclaimer are approved |
| Later | Availability or replenishment notifications | Timely reason to return | Reliable inventory feed plus separate communication consent |
| Later | Real order history/status | Reduces support questions | A server-side order submission and fulfillment source exists |

Do not implement health diagnosis, automated dietary restrictions inferred from
free text, off-site ad targeting, or “smart” replenishment claims in this
roadmap.

## 4. Cart integration contract

### 4.1 Three distinct concepts

| Concept | Signed out | Signed in | Customer-facing name |
| --- | --- | --- | --- |
| Active cart | Stored locally with a schema version; checkout remains guest-accessible | Stored in the account with an optimistic local working copy | “Carrito actual” |
| Saved snapshot | Optional local record until import/expiry | Up to five account records, explicitly saved by the customer | “Carritos guardados” |
| Order | Does not exist in the current backend | Does not exist in the current backend | Do not display as an account feature |

Account cart rows must contain product/presentation identifiers and quantities,
not checkout PII. Profile and saved addresses are separate resources. A checkout
may be prefilled from them, but edits for one checkout do not silently change a
saved profile or default address.

### 4.2 Sign-in reconciliation rules

| Device cart | Account cart | Result |
| --- | --- | --- |
| Empty | Empty | Start with an empty cart |
| Has items | Empty | Offer to save the device cart to the account; keep it usable if declined or sync fails |
| Empty | Has items | Load the account cart |
| Has items | Has items | Show a choice; never overwrite either cart silently |

Conflict copy:

> Encontramos productos en este dispositivo y en tu cuenta. ¿Cuál carrito
> querés usar?

Actions:

- “Combinar carritos”
- “Usar este carrito”
- “Usar el carrito de mi cuenta”

Combining deduplicates by stable product plus presentation ID, sums quantities
within an approved maximum, and revalidates each product. Changed prices and
unavailable presentations remain visible with an explanation and must not be
silently substituted. The original carts remain recoverable until the selected
operation commits successfully.

### 4.3 Cart language correction

Replace current phrases such as “Órdenes anteriores” with “Carritos guardados.”
Prefer “Continuar con el pedido” over “Ir al checkout.” Generating the current
summary/image may say “Resumen del pedido”; it must not claim “Pedido enviado,”
“Compra completada,” or a delivery status.

## 5. Delivery rules for every story

- All customer-facing text introduced or changed by this roadmap—including
  validation, email templates, errors, dates, currency, and accessibility
  labels—uses reviewed `es-CR` Spanish.
- Each story is a deployable, independently testable increment behind a feature
  flag when it is not ready for customers.
- Guest regression tests remain green after every cart/account change.
- Customer mutations validate bounded schemas, derive ownership from the
  verified session, and return stable error codes without logging PII.
- Customer-specific pages are `noindex, nofollow`, dynamic, and excluded from
  shared caches.
- Loading, empty, error, offline/dependency-failure, expired-session, and retry
  states are part of the story—not deferred polish.
- UI stories meet keyboard, focus, 320 px reflow, zoom, contrast, live-region,
  and reduced-motion requirements applicable to the component.
- A story is complete only when unit/integration tests and Spanish copy review
  pass. Critical journeys also require Playwright and axe coverage.

Sizes are relative (`S` = one narrow change, `M` = one small vertical slice),
not calendar commitments. Stories are listed in required implementation order.

## 6. Sequential implementation roadmap

### Milestone 0 — Resolve launch gates and establish the baseline

**Outcome:** the team can build against approved product, privacy, operational,
and content decisions. No production customer data is collected yet.

| ID | Size | User story | Acceptance/exit criteria |
| --- | --- | --- | --- |
| 0.1 | S | Como responsable de producto, quiero definir la promesa y los límites de la cuenta para que cada pantalla explique un beneficio real. | Approve the MVP modules, guest-first rule, non-goals, cart terminology, and the Spanish value proposition in this roadmap. |
| 0.2 | S | Como responsable de producto, quiero resolver las aclaraciones del PRD para que ingeniería implemente un contrato consistente. | Update `AUTH-03`, the active-cart model, cache rules, and current provider assumptions; close or assign every PRD open decision. |
| 0.3 | M | Como cliente, quiero entender qué datos se usan y para qué antes de crear una cuenta. | Qualified review approves Spanish privacy/terms text, controller/contact, purposes, processors, customer rights, eligibility, and separate optional marketing language for Costa Rica. |
| 0.4 | S | Como cliente, quiero saber cuánto tiempo se conserva mi información. | Approve exact retention for active/inactive accounts, local and cloud carts, exports, consent evidence, deletion receipts, logs, and backups. |
| 0.5 | S | Como operador, quiero proveedores y responsables definidos para poder recuperar el servicio. | Approve Supabase plan/region/DPA/subprocessors, RPO/RTO, backup/restore owner, incident contacts, production access roles, and secret rotation. |
| 0.6 | S | Como cliente que usa correo, quiero recibir códigos de DNAture de forma confiable. | Select production SMTP, sender subdomain/address, SPF/DKIM/DMARC, bounce handling, rate limits, Spanish templates, and failover owner. |
| 0.7 | S | Como cliente, quiero mensajes claros y costarricenses en toda la cuenta. | Create an `es-CR` copy inventory covering navigation, auth, errors, consent, import, pets, carts, destructive actions, and auth emails; name a copy approver. |
| 0.8 | S | Como equipo de producto, queremos medir valor sin recolectar datos innecesarios. | Record baseline guest funnel/performance; approve an event allow-list with no email, phone, address, pet name, free text, or auth tokens. |
| 0.9 | S | Como operador, quiero activar o retirar partes de la función sin afectar el sitio. | Define independent flags for account entry, email, Google, Facebook, local import, cart sync, purchase planner, and recommendations; document safe defaults. |

**Gate 0:** Do not start a public pilot until Stories 0.3–0.6 have accountable
owners and written decisions. Engineering scaffolding may proceed in isolated
development environments.

### Milestone 1 — Build the secure account foundation

**Outcome:** the repository has repeatable Supabase environments, a tested
session boundary, and deny-by-default customer storage.

| ID | Size | User story | Acceptance/exit criteria |
| --- | --- | --- | --- |
| 1.1 | S | Como desarrollador, quiero ambientes separados para no mezclar pruebas con clientes reales. | Create development, preview/staging, and production Supabase projects with separate keys, callbacks, and Netlify environment scopes. |
| 1.2 | S | Como desarrollador, quiero clientes Supabase tipados y separados por entorno de ejecución. | Add pinned `@supabase/supabase-js`/`@supabase/ssr`; create browser and server factories; no service-role secret is importable by client code. |
| 1.3 | M | Como cliente, quiero que mi sesión se valide antes de mostrar información privada. | Integrate session refresh/claim validation with `proxy.js`; invalid or revoked sessions cannot access protected data; public routes do not require auth. |
| 1.4 | S | Como cliente, quiero volver a la página correcta después de iniciar sesión. | Implement a same-origin `returnTo` validator; reject absolute, malformed, encoded, and protocol-relative external destinations; default to `/cuenta`. |
| 1.5 | S | Como cliente, quiero que una caché nunca muestre mi cuenta a otra persona. | Account/auth responses are dynamic and `private, no-store`; automated deployment test checks cache and `Set-Cookie` behavior on Netlify. |
| 1.6 | M | Como cliente, quiero que mis datos básicos pertenezcan solamente a mi cuenta. | Add migrations for `profiles`, `preferences`, and append-only `consent_events`; RLS enabled; explicit grants; constraints, versions, and owner indexes included. |
| 1.7 | M | Como cliente, quiero aislamiento comprobado entre cuentas. | Database tests with anonymous, User A, User B, and permitted server job cover select/insert/update/delete plus forged `user_id`; cross-user access always fails. |
| 1.8 | S | Como operador, quiero migraciones reproducibles y reversibles. | Add migration/type generation commands, CI drift check, seed fixtures without real PII, and a forward-fix/rollback procedure. |
| 1.9 | S | Como cliente, quiero errores seguros y útiles cuando un servicio falla. | Add stable error mapping/correlation IDs, centralized PII redaction, Spanish retry states, and monitoring that excludes raw request bodies and identity secrets. |

**Gate 1:** A security reviewer approves the session/cookie/cache profile and
the cross-user RLS suite before any account UI reaches a shared environment.

### Milestone 2 — Deliver one complete email account slice

**Outcome:** a customer can create or access an account with an email code, view
a minimal account home, and sign out. This is the first internal end-to-end
release.

| ID | Size | User story | Acceptance/exit criteria |
| --- | --- | --- | --- |
| 2.1 | S | Como visitante, quiero ver “Iniciar sesión” en escritorio y móvil. | Add a labeled, keyboard-accessible header action; signed-in state shows first name or “Mi cuenta”; loading never flashes another name. |
| 2.2 | M | Como visitante, quiero entender los beneficios antes de compartir mi correo. | Build `/cuenta/iniciar-sesion` with the approved value proposition, provider slots, privacy link, and “Continuar como invitado.” |
| 2.3 | S | Como cliente, quiero solicitar un código sin revelar si una cuenta ya existe. | Email form validates and normalizes input; response is neutral; resend cooldown/rate-limit and service-failure states are in Spanish. |
| 2.4 | M | Como cliente, quiero pegar y verificar el código recibido. | Accessible single-field OTP supports paste/autofill, expiry, reuse rejection, retry, back navigation, and does not log code/email. |
| 2.5 | M | Como cliente nuevo, quiero que mi cuenta mínima se cree una sola vez. | Successful first auth creates idempotent profile/preferences and records the approved policy version; marketing remains separate and unchecked. |
| 2.6 | M | Como cliente, quiero una portada de cuenta útil aun antes de completar mis datos. | Build `/cuenta` with welcome, profile completeness, empty pets/cart states, popular-products fallback, and quick links; all protected/noindex. |
| 2.7 | S | Como cliente, quiero cerrar mi sesión sin perder mi carrito de invitado. | “Cerrar sesión” revokes the current session, clears account-specific client caches, preserves the anonymous cart, and returns to a safe public page. |
| 2.8 | M | Como cliente, quiero recuperarme de enlaces vencidos o errores de acceso. | Build `/cuenta/error` and callback failure paths with neutral Spanish messages, new-code action, safe `returnTo`, support route, and no provider/token leakage. |
| 2.9 | M | Como equipo, queremos comprobar que el acceso básico es inclusivo y no rompe compras. | Unit/integration/E2E cover new/returning email auth, expiry/reuse/rate limit, safe redirect, logout, guest continuation, axe, keyboard, and current guest suite. |

**Internal release A:** email accounts behind a staff allow-list. Validate actual
email delivery, Netlify callback/cookie behavior, session expiry, and rollback.

### Milestone 3 — Add account ownership and privacy controls

**Outcome:** a customer can manage basic information and exercise core account
rights before DNAture asks them to store pet/address/cart data.

| ID | Size | User story | Acceptance/exit criteria |
| --- | --- | --- | --- |
| 3.1 | M | Como cliente, quiero editar mi nombre y teléfono opcional. | `/cuenta/perfil` validates lengths/formats, uses optimistic version checks, preserves form input on failure, and does not let a profile edit replace verified auth email. |
| 3.2 | S | Como cliente, quiero decidir si se personaliza mi experiencia dentro del sitio. | Add on-site personalization preference independent from marketing; change is immediate, reversible, and recorded with policy/source metadata. |
| 3.3 | S | Como cliente, quiero retirar un permiso opcional tan fácilmente como lo otorgué. | Preferences show separate email/SMS choices off by default; withdrawing creates consent evidence and does not disable account features. |
| 3.4 | M | Como cliente, quiero cerrar todas mis sesiones si pierdo un dispositivo. | Add recent-auth challenge and “Cerrar todas las sesiones”; other sessions are revoked, current outcome is truthfully explained, and tests cover expired sessions. |
| 3.5 | M | Como cliente, quiero descargar una copia de mis datos. | Recent-auth export provides time-limited JSON plus human-readable Spanish summary; excludes tokens/internal logs and records request state without leaking PII. |
| 3.6 | M | Como cliente, quiero eliminar mi cuenta y entender las consecuencias. | Two-step Spanish confirmation, recent auth, immediate disable/revocation, idempotent cleanup, retention exceptions, non-PII reference, and failure monitoring are implemented. |
| 3.7 | S | Como cliente, quiero saber cómo obtener ayuda sin compartir códigos secretos. | Publish support/recovery/deletion copy and an internal script that never requests OTPs, cookies, tokens, or social passwords. |
| 3.8 | M | Como equipo, queremos demostrar que los controles de privacidad funcionan. | E2E covers consent withdrawal, export authorization/expiry, current/all logout, deletion retry, deleted-user access, and audit/log redaction. |

### Milestone 4 — Create the “Mis mascotas” value center

**Outcome:** signed-in customers can safely save existing Plan DNAture data and
use the same PDR logic across devices.

| ID | Size | User story | Acceptance/exit criteria |
| --- | --- | --- | --- |
| 4.1 | M | Como cliente, quiero que mis mascotas estén aisladas de otras cuentas. | Add `pets` migration with owner/version fields, current Plan DNAture constraints, ten-active-pet limit, explicit grants/RLS, cascade policy, and two-user tests. |
| 4.2 | S | Como desarrollador, quiero una sola lógica de mascota y PDR. | Extract/reuse pure validation, normalization, and calculation functions; identical guest/account inputs produce identical results and record calculator rule version. |
| 4.3 | M | Como cliente, quiero ver mis mascotas y su PDR. | Build `/cuenta/mascotas` list with empty/loading/error states, PDR units, last-updated context, and “Agregar mascota.” |
| 4.4 | M | Como cliente, quiero guardar una mascota usando el flujo conocido. | Reuse Plan DNAture fields to create an account pet; validation is Spanish; failed save preserves input; successful save appears on account home. |
| 4.5 | M | Como cliente, quiero actualizar datos y recalcular la PDR. | Edit requires expected version; recomputes with the current approved rule; stale cross-device update prompts reload/review instead of overwriting. |
| 4.6 | S | Como cliente, quiero eliminar una mascota con seguridad. | Confirmation names the impact on selection/recommendations; delete is owner-scoped; focus returns correctly; other pets are unchanged. |
| 4.7 | S | Como cliente con varias mascotas, quiero elegir cuál estoy atendiendo. | Store `selected_pet_id` owner-safely; selector appears on account home; deleted/invalid selection falls back to the most recently updated active pet. |
| 4.8 | M | Como cliente existente, quiero ver qué datos de este dispositivo se pueden guardar antes de subirlos. | Read supported `client` local schema without upload; show counts only, e.g. “Encontramos 2 mascotas”; malformed data is skipped safely. |
| 4.9 | M | Como cliente, quiero importar mis mascotas sin crear duplicados silenciosos. | “Guardar en mi cuenta” is affirmative; preview flags probable duplicates; cloud values win by default; ambiguous conflicts require choice; commit is bounded and idempotent. |
| 4.10 | S | Como cliente, quiero decidir si borro la copia local después de importar. | Success offers an explicit remove-device-copy choice; declining retains current expiry behavior; a migration receipt prevents repeated prompts. |
| 4.11 | M | Como equipo, queremos verificar sincronización e importación de mascotas. | E2E covers two devices, limit ten, calculation parity, duplicate/conflict, corrupt/old storage, retry/partial failure, decline, and cross-user denial. |

**Internal release B:** staff and selected testers use email accounts plus pets.
Measure account activation as a verified account with at least one saved pet or
saved cart—not simply a completed login.

### Milestone 5 — Integrate addresses, active cart, saved carts, and checkout

**Outcome:** accounts improve the current shopping journey without turning it
into payment/order fulfillment and without weakening guest behavior.

| ID | Size | User story | Acceptance/exit criteria |
| --- | --- | --- | --- |
| 5.1 | M | Como cliente, quiero guardar direcciones costarricenses de forma segura. | Add `addresses` with owner/version/default constraints, RLS tests, and fields for etiqueta, provincia, cantón, distrito, señas, and optional delivery contact as approved. |
| 5.2 | M | Como cliente, quiero crear, editar, eliminar y elegir mi dirección principal. | Build `/cuenta/direcciones`; only one default; deleting default has deterministic fallback; conflict/failure states preserve input. |
| 5.3 | S | Como cliente, quiero completar más rápido los datos del pedido. | Signed-in checkout offers profile/default address prefill; customer may use another value; checkout edits never silently update the saved record. |
| 5.4 | S | Como visitante, quiero que mi carrito actual sobreviva una recarga. | Add versioned, bounded, non-PII active-cart local storage; migrate safely from current in-memory state; multi-tab updates are deterministic. |
| 5.5 | M | Como cliente, quiero un carrito actual sincronizado y aislado. | Add `carts`/`cart_items` migrations with `active|saved`, one active/user, owner RLS through parent, stable item/presentation IDs, versioning, and no embedded checkout PII. |
| 5.6 | M | Como cliente, quiero que los cambios del carrito se guarden sin volver lenta la interfaz. | Use optimistic local updates plus debounced/idempotent sync; server rejections reconcile visibly; logout clears account working copy while preserving guest cart. |
| 5.7 | M | Como cliente, quiero elegir qué hacer si mi dispositivo y mi cuenta tienen productos. | Implement the three Spanish reconciliation actions; no silent overwrite; original state survives failed commit; decision is tested for all four state combinations. |
| 5.8 | S | Como cliente, quiero saber si un producto cambió antes de reutilizar el carrito. | Rehydrate against current Contentful/Avify data; mark price/presentation/availability changes; require review; never silently substitute. |
| 5.9 | S | Como cliente, quiero guardar el carrito con un nombre útil. | “Guardar carrito” creates an explicit snapshot with optional bounded label/default date label; enforce maximum five transactionally and explain the limit before replacement/deletion. |
| 5.10 | M | Como cliente, quiero ver, reutilizar y eliminar mis carritos guardados. | Build `/cuenta/carritos` with “Volver a usar,” delete, revalidation, empty/error states, and no claims of payment, submission, or fulfillment. |
| 5.11 | M | Como cliente existente, quiero importar carritos locales de forma controlada. | Extend import preview/commit; remove expired/corrupt entries, deduplicate exact snapshots, cap at five, exclude stored checkout PII, and require affirmative upload. |
| 5.12 | S | Como visitante, quiero que un problema de cuenta no me impida preparar el pedido. | If Supabase is unavailable, local cart and guest checkout work; signed-in sync shows “Guardaremos los cambios cuando se restablezca la conexión” only when a bounded retry/outbox actually exists. |
| 5.13 | S | Como cliente, quiero lenguaje exacto sobre lo que DNAture ha recibido. | Replace “Órdenes anteriores”/“Ir al checkout” and audit all cart/summary success text against the terminology contract in Section 4. |
| 5.14 | M | Como equipo, queremos demostrar que la sincronización no pierde carritos. | Unit/E2E cover merge math/max quantity, two tabs/devices, stale versions, offline/retry, sign-out, changed/unavailable items, saved limit, local PII exclusion, and guest regression. |

**Pilot release C:** accounts, pets, privacy controls, addresses, and cart sync to
a small opt-in audience. Guest completion rate, cart errors, RLS denials, support
contacts, and account activation must remain within approved guardrails.

### Milestone 6 — Add Google, Facebook, and identity recovery

**Outcome:** the public MVP offers familiar sign-in choices without creating
duplicate accounts or depending on one social provider.

External Google/Meta app creation, domain verification, privacy/deletion URLs,
branding approval, and production review should start during Milestone 0 because
lead times are outside engineering control.

| ID | Size | User story | Acceptance/exit criteria |
| --- | --- | --- | --- |
| 6.1 | S | Como cliente, quiero iniciar sesión con Google. | Configure exact environment callbacks/scopes and a separately flagged Spanish button; request only OpenID, verified email, and basic name claims. |
| 6.2 | M | Como cliente, quiero volver a mi destino después de usar Google. | PKCE callback creates/returns to the correct account, validates claims and safe `returnTo`, and handles cancel/denial/outage without leaking provider details. |
| 6.3 | S | Como cliente, quiero iniciar sesión con Facebook. | Configure DNAture-owned Meta app, minimal scopes, exact callbacks, privacy/terms, deletion mechanism, live-mode readiness, and independent button flag. |
| 6.4 | M | Como cliente, quiero volver a mi cuenta después de usar Facebook. | PKCE callback covers success, cancel, missing/unverified email, revoked access, provider outage, and safe destination with neutral Spanish errors. |
| 6.5 | M | Como cliente, quiero usar más de un método sin duplicar mi información. | Verified same-email behavior resolves to the intended account; different established emails are never silently merged; risky/manual linking requires recent auth and proof. |
| 6.6 | M | Como cliente, quiero ver y administrar mis métodos de acceso. | Profile lists Google/Facebook/email labels without internal IDs/tokens; customer can add a method; removing the last usable method is blocked. |
| 6.7 | S | Como cliente, quiero recuperar acceso aunque una red social no esté disponible. | Email OTP remains visible and independently operational; provider-specific support points to the provider without asking for credentials. |
| 6.8 | M | Como equipo, queremos validar proveedores antes de anunciarlos. | Mocked and production-readiness E2E cover callback/replay/state, account linking/duplicates, missing claims, revocation, independent flags, deletion callback, and brand/accessibility review. |

**Public MVP release D:** expose accounts broadly only when email is production
reliable and every advertised provider is live. A delayed provider stays hidden;
it does not delay the rest of the account value.

### Milestone 7 — Turn PDR into a practical “Plan de compra”

**Outcome:** the account provides a distinctive, immediately useful feature
that connects pet information to the cart without presenting veterinary advice.

| ID | Size | User story | Acceptance/exit criteria |
| --- | --- | --- | --- |
| 7.1 | S | Como cliente, quiero elegir para cuántos días voy a comprar. | Add 7, 14, and 30-day options for the selected pet; remember the on-site preference; default is reviewed for `es-CR`. |
| 7.2 | M | Como cliente, quiero saber aproximadamente cuánto alimento necesito. | Pure calculator returns `PDR × days`, clearly labels grams/kilograms, rule version, rounding, and “estimación”; invalid/stale PDR prompts recalculation. |
| 7.3 | M | Como cliente, quiero ver combinaciones de presentaciones que cubran el período. | Use current available presentation sizes to propose bounded quantities, prioritize sufficient amount with understandable excess, and never invent a package size. |
| 7.4 | S | Como cliente, quiero entender por qué se sugiere esa cantidad. | Show calculation summary and approved disclaimer: it is an estimate based on saved PDR and not a diagnosis or substitute for professional guidance. |
| 7.5 | S | Como cliente, quiero agregar la cantidad sugerida a mi carrito. | One action adds exact stable presentation IDs/quantities, respects cart limits, announces result accessibly, and opens/reviews changed availability. |
| 7.6 | M | Como equipo, queremos confiar en los cálculos del plan. | Unit tests cover units, rounding, all periods, package combinations, unavailable products, multiple pets, invalid PDR, and add-to-cart payload; nutrition/content owner signs off. |

### Milestone 8 — Add explainable product recommendations

**Outcome:** customers see content-approved, auditable suggestions for a selected
pet, with a safe generic fallback.

| ID | Size | User story | Acceptance/exit criteria |
| --- | --- | --- | --- |
| 8.1 | M | Como responsable de contenido, quiero una taxonomía estructurada para aprobar recomendaciones. | Extend Contentful with species, life stage, sizes, dietary flags, status/availability mapping, presentation weights, reason keys, approval state, and schema version. |
| 8.2 | M | Como cliente, quiero que solo se personalicen productos con información revisada. | Backfill and nutrition-approve every eligible product; a completeness validator blocks incomplete/unapproved products from personalized claims. |
| 8.3 | M | Como cliente, quiero que los productos incompatibles se excluyan antes de ordenar resultados. | Implement pure hard-exclusion rules for species, life stage, explicit incompatibility, unavailable/discontinued state, and approved dietary fields; tests cover each. |
| 8.4 | M | Como cliente, quiero resultados consistentes para los mismos datos. | Implement versioned deterministic ranking using selected pet, approved metadata, and presentation fit; same snapshot/input yields the same order. |
| 8.5 | S | Como cliente, quiero entender cada sugerencia. | Map reason codes to one or two approved Spanish explanations; no generated medical/health claim or unsupported ingredient inference. |
| 8.6 | M | Como cliente, quiero recomendaciones para la mascota que elija. | Add selected-pet module to `/cuenta`; cards support view/add-to-cart/change-pet; incomplete pet data gives a clear completion action. |
| 8.7 | M | Como cliente, quiero usar recomendaciones mientras exploro el catálogo. | Add a separately flagged catalogue module without inflating unrelated public bundles; generic ranking remains available to guests and on dependency failure. |
| 8.8 | S | Como cliente, quiero ocultar una sugerencia que no me interesa y deshacerlo. | “No me interesa” is pet-specific, reversible in preferences, owner-scoped, and does not imply a health exclusion. |
| 8.9 | S | Como equipo, queremos medir relevancia sin perfilar de más. | Allow-listed events record rule/content version and non-PII reason codes for impression, product view, add-to-cart, dismiss, and fallback; no pet name/raw profile. |
| 8.10 | M | Como equipo, queremos comparar personalización con una alternativa segura. | Run a flagged experiment against approved generic/popular ranking only after sample threshold is defined; guardrails include guest performance, fallback/error rate, and support issues. |
| 8.11 | M | Como equipo, queremos comprobar seguridad y accesibilidad de las recomendaciones. | Tests cover exclusions, determinism, explanations, incomplete metadata, selected/deleted pet, service failure, dismiss/undo, two-user isolation, axe, keyboard, and 320 px reflow. |

**Personalization release E:** promote recommendations only if taxonomy coverage,
nutrition approval, guardrails, and experiment results are acceptable. Otherwise
retain accounts, pets, carts, and the generic catalogue; these features do not
depend on personalized ranking.

### Milestone 9 — Add low-risk retention value

**Outcome:** evidence-backed convenience features encourage customers to return
without introducing marketing or medical assumptions.

| ID | Size | User story | Acceptance/exit criteria |
| --- | --- | --- | --- |
| 9.1 | M | Como cliente, quiero guardar productos para revisarlos después. | Add owner-scoped favorites table, catalogue toggle, and `/cuenta/favoritos`; price/availability is always current; guest prompt is optional and non-blocking. |
| 9.2 | S | Como cliente, quiero recordar revisar la PDR cuando cambie mi mascota. | Customer chooses an on-site review date/reason; dashboard reminder can be dismissed/rescheduled; no email/SMS is sent without separate consent and scope. |
| 9.3 | S | Como cliente, quiero ver cuándo actualicé el plan de mi mascota. | Display last PDR calculation date and rule version in understandable Spanish; do not label a plan “vigente” based only on elapsed time. |
| 9.4 | M | Como cliente, quiero descargar o compartir un resumen del plan. | After content approval, generate an accessible Spanish summary with pet inputs, PDR, shopping estimate, calculation date/version, and disclaimer; no public predictable URL. |
| 9.5 | S | Como equipo, queremos decidir la próxima mejora con evidencia. | Review favorite use, cart resume, planner conversion, recommendation feedback, support data, and mobile/Safari provider share before selecting recently viewed, Apple, or notifications. |

## 7. Release gates and success measures

### 7.1 Release gates

| Gate | Must be true |
| --- | --- |
| Security | Session/cookie/cache review passes; RLS and IDOR tests pass for every customer table; service role is server-only |
| Privacy/legal | Spanish notice/terms/consent, retention, export, deletion, processor/DPA, Costa Rica obligations, and Meta deletion path are approved |
| Reliability | Custom SMTP, callback allow-lists, rate limits, monitoring/redaction, backup restore, and outage fallbacks are exercised |
| Product integrity | Guest flows remain optional and green; cart is not presented as an order; PDR/recommendation content is approved |
| Accessibility | Critical routes pass automated checks plus keyboard, screen-reader smoke test, zoom, and 320 px reflow |
| Operations | Support and incident playbooks, owners, feature flags, rollback, and a maintenance route for export/deletion exist |

### 7.2 Recommended metrics

**Primary value metrics**

- Account activation: verified account plus first saved pet or saved cart.
- Percentage of saved pets with a completed PDR.
- Cross-device or later-session cart resumes that lead to checkout.
- Purchase-plan views that lead to a suggested quantity being added to cart.
- Recommendation product-view/add-to-cart lift versus generic ranking.

**Funnel diagnostics**

- Sign-in page view → provider start → verified session → activation.
- OTP delivery latency, expiry, resend, and verification failure by non-PII
  reason code.
- Local import preview → accept/decline → successful/partial result.
- Cart conflict choice and sync/revalidation failure rates.

**Guardrails**

- Guest checkout completion and public-route performance do not materially
  regress from the Story 0.8 baseline.
- Cross-user authorization incidents: zero.
- Customer-specific cache incidents: zero.
- Export/deletion completion within the approved SLA.
- Auth, sync, recommendation fallback, and support-contact rates remain below
  thresholds set before each release.

Do not use raw registration count as the main success metric. An unused account
is data collection, not customer value.

## 8. Recommended implementation boundaries

Keep account work as a new vertical feature and reuse existing domain logic:

```text
app/cuenta/*                          thin routes/layouts only
app/auth/callback/route.js           OAuth/OTP exchange boundary
features/Account/
  auth/                              sign-in, callback errors, identities
  profile/                           profile, preferences, consent
  pets/                              account persistence around shared pet/PDR domain
  addresses/                         Costa Rica address CRUD
  carts/                             sync, conflict resolution, snapshots
  recommendations/                  eligibility, ranking, explanations
  privacy/                           export, sessions, deletion
lib/supabase/                        browser/server/proxy factories
supabase/migrations/                 schema, grants, RLS, constraints
```

Do not move the whole existing `features/Cart` or `features/PlanDNA` into the
account feature. Extract pure shared domain functions and add account adapters.
The cart reducer should remain usable with a local guest repository and an
authenticated cloud repository. This separation is what lets a Supabase outage
degrade to the current guest experience.

Recommended domain interfaces:

- `AccountRepository`: profile, preferences, consent, session controls.
- `PetRepository`: list/create/update/delete with expected versions.
- `CartRepository`: load/save active cart, save/list/delete snapshots, reconcile.
- `AddressRepository`: owner-scoped CRUD and default selection.
- `RecommendationService`: pure ranking over approved catalogue snapshot and pet.

Server actions or route handlers may implement the boundaries, but they must
share schemas and error codes. Never accept `user_id` from a form as ownership.

## 9. Testing matrix

| Layer | Minimum coverage |
| --- | --- |
| Unit | Spanish validation mapping, `returnTo`, PDR parity, cart merge/dedupe/limits, import normalization/idempotency, recommendation exclusions/ranking/reasons, PII redaction |
| Database | Every operation as anonymous/User A/User B, forged parent/owner IDs, cascades, versions, defaults, cart active uniqueness, five-snapshot enforcement, deletion |
| Integration | OTP success/expiry/reuse/rate limit, Google/Meta callbacks and missing claims, session refresh/revocation, SMTP failure, Contentful/Avify revalidation, export/deletion jobs |
| E2E | Guest journey, new/returning accounts, protected redirect, local import accept/decline, two-device pet/cart sync, cart conflict, address prefill, provider linking, logout-all, export, deletion |
| Security | Open redirect, CSRF, session fixation, OAuth replay/state, enumeration, IDOR, cache leakage, service-role bundle scan, import abuse, log/token/PII leakage |
| Accessibility | Axe plus manual keyboard/focus, OTP autofill/paste, dialogs, live errors, screen-reader smoke test, zoom/reflow, mobile navigation |
| Deployment | Netlify preview/production callback allow-list, cookie and cache headers, feature flags, skew/deployment behavior, rollback, maintenance access to export/deletion |

## 10. Roadmap completion definition

The client-account program is complete when a Costa Rican customer can use
email, Google, or Facebook to access one account; safely import or decline local
data; manage pets, PDRs, profile, addresses, preferences, sessions, export, and
deletion; resume and save carts without confusing them with orders; use a
practical shopping plan; and receive explainable, content-approved suggestions
with a generic fallback.

Completion also requires that the same customer can ignore accounts entirely
and finish every existing guest flow, that two customer identities cannot read
or overwrite each other's data, and that DNAture can monitor, support, roll
back, restore, and delete the feature's data according to its approved policy.

## 11. Technical references checked for this roadmap

- [Supabase: creating a client for SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client)
- [Supabase: SSR advanced guide and cache isolation](https://supabase.com/docs/guides/auth/server-side/advanced-guide)
- [Supabase: securing the Data API with grants and RLS](https://supabase.com/docs/guides/api/securing-your-api)
- [Supabase: production custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp)
- [Netlify: Next.js on Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/)
