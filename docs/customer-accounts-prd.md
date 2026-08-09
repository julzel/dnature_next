# Product Requirements Document: Customer Accounts and Personalization

| Field | Value |
| --- | --- |
| Product | DNAture customer website |
| Feature | Customer accounts, saved pet profiles, and product recommendations |
| Status | Draft for product, legal/privacy, design, and engineering review |
| PRD version | 1.0 |
| Date | 2026-08-08 |
| Primary market | Costa Rica (`es-CR`) |
| Proposed owner | DNAture product owner |

## 1. Executive summary

DNAture customers should be able to create an account, sign in, and carry their
pet and shopping information across devices. The first release will support:

- Continue with Google.
- Continue with Facebook.
- Continue with email using a short-lived, single-use code, without a stored
  DNAture password.
- A customer account containing contact details, addresses, pet profiles, saved
  carts, preferences, and explicit consent records.
- Personalized, explainable product recommendations based on the customer's
  selected pet and product suitability metadata managed in Contentful.
- A safe, opt-in migration of the customer and pet data that the current site
  keeps only in that browser.

The recommended implementation is Supabase Auth plus Supabase Postgres with Row
Level Security (RLS), integrated into the existing Next.js App Router site.
Contentful remains the product-content source and Avify remains the source for
catalogue/availability data already used by the project. Supabase becomes the
system of record only for customer-owned account data.

Instagram is **not** a launch identity provider. Meta's current Instagram login
APIs are designed for professional (Business/Creator) accounts and do not offer
the dependable consumer identity and verified-email experience required here.
An Instagram button would exclude normal personal accounts and create misleading
expectations. The product may reassess this if Meta later offers a consumer OIDC
provider appropriate for authentication. “Gmail login” will be labeled
“Continuar con Google,” because Google authenticates the identity; a Gmail
mailbox is not required.

This release does not add online payment, server-side order placement, automatic
reordering, a loyalty program, veterinary advice, or machine-learning
recommendations. The existing checkout still generates a customer-side order
image.

## 2. Background and current-state constraints

DNAture is currently a Spanish-language catalogue and ordering assistant for
natural pet food. It is not yet a conventional transaction-processing store.
Relevant current behavior:

- Next.js 16 App Router and React 18 provide the application shell.
- Contentful provides catalogue content. Avify is a server-only catalogue and
  availability integration.
- The Plan DNAture flow saves pet name, age/stage, size, castration status, body
  condition, activity, weight, and calculated daily portion in `localStorage`
  under `client`.
- Checkout may save name, email, phone, delivery address, and pets in the same
  browser for 30 days when the customer selects “Recordar mis datos.”
- Up to five order/cart snapshots are stored in `localStorage` for 30 days.
- No DNAture application API currently receives customer, order, payment, CRM,
  or marketing data.
- Catalogue product data contains category, ingredients, prices, rating, and
  images, but it does not yet contain the structured suitability attributes
  needed for trustworthy pet-based ranking.
- The site already has automated customer-flow and accessibility checks.

Accounts therefore introduce the project's first durable customer-data backend
and materially change its privacy, security, operations, monitoring, and support
responsibilities.

## 3. Problem and opportunity

### Customer problem

Customers must currently re-enter or recreate information when they change
browsers or devices. They cannot reliably return to a pet's feeding plan, reuse
delivery information, or understand which products are most relevant to that
pet. Local-only storage is also easy to clear and hard for customers to inspect
or manage centrally.

### Business opportunity

A useful account can increase repeat engagement, reduce checkout friction, and
make the catalogue easier to navigate. The account also establishes a
permissioned foundation for future capabilities such as order submission,
reordering, subscriptions, and loyalty—without placing those capabilities in
this release.

### Product hypothesis

If customers can save pet profiles and receive transparent recommendations for
a selected pet, then they will find relevant products more quickly and return to
DNAture more often. Social login and passwordless email should reduce account
creation friction, provided anonymous browsing and checkout remain available.

## 4. Goals, success measures, and guardrails

### Goals

1. Let a customer create or access one DNAture account with Google, Facebook, or
   email in a low-friction flow.
2. Make pet profiles and selected customer preferences available across devices.
3. Personalize catalogue discovery with understandable, content-governed rules.
4. Preserve anonymous shopping and avoid coercing customers into account
   creation.
5. Give customers meaningful control over their data and communication consent.
6. Establish secure account infrastructure that can support later commerce
   capabilities.

### Launch success measures

Baselines must be recorded during the instrumentation/canary period before
uplift claims are made.

| Metric | Initial target | Measurement |
| --- | --- | --- |
| Sign-in completion | At least 75% of initiated sign-in attempts, excluding customer cancellation | `auth_started` to `auth_succeeded` funnel by provider |
| Account onboarding completion | At least 65% of first-time authenticated users complete or skip onboarding | `onboarding_viewed` to `onboarding_completed` or `onboarding_skipped` |
| Authentication reliability | At least 99.5% successful callback processing for valid provider responses | Server-side auth callback telemetry |
| Cross-device value | At least 30% of activated accounts return on a later day within 30 days | Privacy-safe authenticated activity cohort |
| Recommendation engagement | At least 10% relative increase in product-detail views or add-to-cart rate from recommendation modules versus non-personalized modules after sufficient sample size | Experiment assignment and recommendation events |
| Data migration success | At least 99% of accepted local-data imports complete without data loss or duplication | Migration result telemetry and reconciliation tests |
| Account deletion SLA | 100% of valid self-service deletions completed or placed in a visible pending state immediately; final deletion within the legally approved operational SLA | Auditable deletion workflow |

### Guardrails

- Anonymous catalogue, calculator, Plan DNAture, cart, and checkout flows remain
  functional.
- Sign-in must not be required to add products, calculate a portion, or create
  the current client-side order image.
- Authentication must not add more than 100 ms to the p75 server response time
  of public catalogue pages when no account UI is requested.
- No serious or critical automated accessibility violations on account routes;
  the release target is WCAG 2.2 AA across complete account flows.
- No provider access or refresh tokens may be placed in application tables,
  logs, analytics, or browser `localStorage`.
- No recommendation may be presented as medical or veterinary advice.

## 5. Non-goals

The following are explicitly outside the first release:

- Payment processing, payment-method storage, invoices, refunds, or server-side
  order fulfillment.
- A DNAture email-and-password credential store. Passwordless email is the
  fallback authentication method.
- Instagram login for personal accounts.
- Sign in with Apple, Microsoft, phone/SMS, passkeys, or multi-factor
  authentication for ordinary customer accounts. Apple is a candidate for a
  later provider based on customer-device data.
- Marketing automation, CRM sync, promotional email/SMS sending, or lookalike ad
  audiences.
- Loyalty points, subscriptions, auto-reorder, gift cards, or referrals.
- Machine-learning ranking, third-party behavioral profiling, or inference from
  social-network data.
- Veterinary diagnosis, allergy diagnosis, treatment, or prescriptive health
  advice.
- Staff impersonation or a customer-service administration console.

## 6. Users and jobs to be done

### Primary personas

**Returning pet guardian**

Has one or more dogs, knows their basic characteristics, and wants to retrieve a
portion plan and suitable products without entering the same data again.

**New shopper seeking guidance**

Does not yet understand the catalogue and wants a small set of explainable
starting points for a specific pet.

**Privacy-conscious guest**

Wants to browse or prepare an order without creating an account or receiving
marketing.

**Multi-pet household**

Needs separate feeding information and recommendations for pets with different
life stages, sizes, activity levels, or dietary considerations.

### Jobs to be done

- “When I return on another device, help me find my pets and their portions.”
- “When I am choosing food, show me which products fit the pet I am shopping
  for and tell me why.”
- “When I prepare another order, reuse information I deliberately saved.”
- “When I no longer want an account, let me remove it and its data without
  contacting support.”
- “When I do not want an account, let me continue shopping normally.”

## 7. Product principles

1. **Account value before data collection.** Explain what will be saved before
   asking the customer to sign in.
2. **Guest-first commerce.** An account is beneficial, never a gate to existing
   flows.
3. **Minimum necessary data.** Request only the identity claims and customer
   fields needed for the stated feature.
4. **Explainable personalization.** Every recommendation has a customer-readable
   reason based on selected pet data and approved product metadata.
5. **Explicit choices.** Account terms/privacy acceptance, personalization, and
   marketing consent are separate concepts. Marketing is unchecked by default.
6. **One person, one account, multiple identities.** Verified provider
   identities can be linked safely; provider choice should not fragment customer
   records.
7. **Content-controlled safety.** Merchandising and nutrition owners define
   eligibility tags; the ranking code does not infer medical suitability from
   ingredient prose.

## 8. Scope and release phases

### Phase 0 — Foundation and policy readiness

- Approve customer privacy notice, terms, consent language, retention schedule,
  data-subject request process, incident contacts, and vendor agreements.
- Confirm whether and how the customer database must be registered with
  Costa Rica's PRODHAB; obtain qualified legal review rather than treating this
  PRD as legal advice.
- Create separate development, preview/staging, and production Supabase projects.
- Select and configure a production transactional-email/SMTP provider with
  DNAture-owned sender authentication; Supabase's trial email service is not a
  production dependency.
- Define provider apps, approved origins, callback URLs, support ownership, key
  rotation, backups, recovery, and production access roles.
- Extend the Contentful product model with approved recommendation metadata and
  backfill all active products before personalized modules can launch.
- Implement telemetry baselines and feature flags.

### Phase 1 — MVP accounts and saved pets

- Google, Facebook, and passwordless email account creation/sign-in.
- Account entry point in desktop and mobile headers.
- Account dashboard and profile/preferences pages.
- Cloud-backed pet create, read, update, and delete.
- Optional import of existing local profile, pets, remembered delivery details,
  and saved carts after sign-in.
- Saved addresses and saved carts available across devices.
- Logout from current device and logout from all devices.
- Identity management, including adding a second supported sign-in method.
- Self-service account data export and account deletion.
- Generic “popular products” fallback while recommendation content is incomplete.

### Phase 2 — Personalized discovery

- Pet selector on account home, catalogue, and recommendation modules.
- Rule-based product recommendations with visible reasons.
- Personalized sections on account home and catalogue; optional home-page module
  after performance validation.
- Recommendation feedback (“No me interesa”) and basic relevance telemetry.
- Controlled experiment against the generic ranking.

### Phase 3 — Evaluate expansion

- Sign in with Apple, if supported by customer device/browser data and business
  value.
- Favorites and recently viewed products.
- Personalized education/content.
- Server-side order history only after DNAture implements an actual order
  submission/fulfillment integration.
- More sophisticated ranking only after data volume, catalogue taxonomy quality,
  safety review, and measurable need justify it.

## 9. Experience architecture and navigation

### Public routes

| Route | Purpose |
| --- | --- |
| `/cuenta/iniciar-sesion` | Sign in or create an account; the same provider flow handles both |
| `/auth/callback` | Server-side OAuth/PKCE and email-code exchange; never indexed |
| `/cuenta/error` | Safe, actionable authentication error and retry page |

### Authenticated routes

| Route | Purpose |
| --- | --- |
| `/cuenta` | Account overview, selected pet, recommendations, and shortcuts |
| `/cuenta/perfil` | Name, phone, communication preferences, and identities |
| `/cuenta/mascotas` | Pet list and pet create/edit/delete flows |
| `/cuenta/direcciones` | Saved delivery addresses |
| `/cuenta/carritos` | Saved cart/order-image snapshots; not represented as fulfilled orders |
| `/cuenta/privacidad` | Consent history, data export, logout-all, and account deletion |

All account routes use `noindex, nofollow`. A signed-out visitor requesting an
authenticated route is redirected to sign-in with a validated, same-origin
`returnTo` value. Invalid or external return targets fall back to `/cuenta`.

### Header behavior

- Add a labeled account action alongside search and cart. Do not rely on an
  unlabeled person icon.
- Signed out: “Iniciar sesión.”
- Signed in: first name when available, otherwise “Mi cuenta.”
- Mobile navigation exposes the same states and destinations.
- Loading state must not flash another customer's name or block public
  navigation.

## 10. Core user flows

### 10.1 Create an account or sign in

1. Customer selects “Iniciar sesión” from the header or a contextual prompt.
2. Page states the benefits: save pets, sync information, and receive relevant
   recommendations. It also offers “Continuar como invitado.”
3. Customer chooses Google, Facebook, or email.
4. For Google/Facebook, the browser follows an OAuth authorization-code flow
   with PKCE and returns to the server callback. Request only identity scopes
   required for name, verified email, and stable provider subject.
5. For email, the customer enters an address and receives a short-lived,
   single-use code. The UI gives a neutral response whether or not the address
   already exists to reduce account enumeration.
6. On first successful authentication, DNAture creates a minimal profile and
   records the versioned privacy/terms acknowledgement required for account
   operation. Marketing consent is separate and optional.
7. Customer returns to the validated original destination or `/cuenta`.
8. If local eligible data exists, the import choice appears once before normal
   onboarding.

Social sign-in creates an account on first successful use and signs in on later
uses. The copy must not force customers to decide between separate “register”
and “login” modes for the same provider.

### 10.2 Import existing browser data

1. After first sign-in on a browser, detect the current supported versions of
   `client` and `carts` without uploading them.
2. Show a summary such as “Encontramos 2 mascotas, una dirección y 3 carritos en
   este dispositivo.” Never expose full address details on this confirmation
   screen.
3. Customer chooses “Guardar en mi cuenta” or “No guardar.” Upload occurs only
   after the affirmative action.
4. Server validates and normalizes every field. Unknown, malformed, expired, or
   unsupported records are skipped and reported generically.
5. Merge rules:
   - Match pets by existing secure pet ID. For legacy IDs, use normalized name,
     age/stage, size, and weight only to propose duplicates; do not silently
     overwrite.
   - Existing cloud records win field-level conflicts. Present ambiguous pet or
     address conflicts for customer choice.
   - Exact duplicate saved carts are ignored. Preserve at most five, ordered by
     most recently saved, until a later product decision changes the limit.
   - Never overwrite the provider-verified account email with locally stored
     checkout email.
6. On success, update browser caches from cloud data. Remove migrated local PII
   only after the customer accepts a clear “remove this device's copy” choice;
   otherwise retain it under the existing expiration policy.
7. Store a migration version and timestamp so the prompt is not repeated unless
   a later migration introduces new eligible data.

### 10.3 Manage pets

- The existing Plan DNAture fields remain available and feed the same approved
  portion calculation.
- A customer may have up to ten active pets in MVP. The UI explains the limit
  and preserves existing pets if it is reached.
- Pet name is required. The current supported portion profile and weight limits
  remain required when calculating a portion.
- Saving a pet writes to the account when signed in and to the existing browser
  flow when signed out.
- Edit and delete require ownership checks in both RLS and server-side mutation
  code.
- Deleting a pet removes its direct recommendations and selection state. It does
  not alter immutable consent/security audit records.
- If cloud saving fails, do not claim success. Preserve unsaved form data in the
  current page and offer retry.

### 10.4 View recommendations

1. Customer chooses a pet; default to the most recently selected active pet.
2. DNAture loads current eligible catalogue products and approved suitability
   metadata.
3. Hard exclusions are applied first.
4. Remaining products are ranked by deterministic rules.
5. Each card shows one or two reasons, for example “Adecuado para perros adultos”
   or “Disponible en una presentación cercana a su PDR.”
6. The customer can view a product, add it to cart, change pet, or select “No me
   interesa.”
7. If the profile is incomplete, taxonomy is missing, or the service fails,
   show the generic catalogue/popular ranking and explain how to complete the
   pet profile. Never render an empty page.

### 10.5 Manage identities and recover access

- Customers can see linked methods (Google, Facebook, email) without showing
  provider tokens or provider-internal IDs.
- A signed-in customer may link a second identity after recent-authentication
  verification.
- Automatically link only provider identities whose email is verified and
  matches the unique existing account email, using the auth vendor's supported
  secure linking behavior.
- If a provider does not return a verified email, require verified email
  completion before creating a durable customer profile.
- Never silently merge two established accounts with different verified emails.
  Provide a support-safe recovery path that requires proof of control of both
  identities.
- Prevent removal of the last usable sign-in method.
- Email one-time-code sign-in is the recovery path when the customer controls the
  account email. Provider-only recovery remains the provider's responsibility.

### 10.6 Sign out, export, and delete

- “Cerrar sesión” revokes the current session and clears account-specific caches
  from the device without deleting the anonymous cart.
- “Cerrar todas las sesiones” revokes all sessions after recent authentication.
- Export produces a machine-readable JSON file and a human-readable summary of
  profile, pets, addresses, preferences, saved carts, consent records, and
  linked-provider labels. It contains no tokens, passwordless codes, or internal
  security logs.
- Deletion requires recent authentication, a plain-language impact summary, and
  explicit confirmation. It deletes/anonymizes account data according to the
  approved retention schedule, revokes sessions, disconnects provider
  identities, and displays a non-PII confirmation reference.
- If asynchronous cleanup is required, the account is disabled immediately and
  the customer sees a truthful pending state. Retries and failures are monitored.
- The Facebook app's required user-data-deletion mechanism must call the same
  idempotent deletion workflow.

## 11. Functional requirements and acceptance criteria

### Authentication

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| AUTH-01 | Offer Google, Facebook, and email one-time-code authentication | All three options are available in Spanish on supported browsers; first use creates one account and later use returns to it |
| AUTH-02 | Preserve a safe intended destination | A valid same-origin `returnTo` survives login; external, malformed, and protocol-relative values are rejected |
| AUTH-03 | Use secure web sessions | OAuth uses authorization code + PKCE; session cookies are `HttpOnly`, `Secure` in production, and an approved `SameSite` value; no auth token is stored in `localStorage` |
| AUTH-04 | Handle callback errors without leaking details | Customers see a provider-neutral message and retry action; logs use correlation IDs and contain no codes/tokens/PII |
| AUTH-05 | Avoid account enumeration | Email initiation, unknown-account cases, and rate-limit responses do not disclose whether an email is registered |
| AUTH-06 | Support identity linking safely | A verified same-email provider resolves to the intended account; different-email established accounts are not auto-merged; the last identity cannot be removed |
| AUTH-07 | Support session control | Current-device logout and logout-all work; protected routes reject revoked/expired sessions |
| AUTH-08 | Keep guest journeys intact | A new browser can complete every existing catalogue, calculator, Plan DNAture, cart, and checkout test without authentication |

### Account profile and customer data

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| ACCT-01 | Display an account overview | Signed-in customer sees profile status, pets, saved carts, recommendations/fallback, and privacy controls; another user's data is never visible |
| ACCT-02 | Manage profile | Customer can update name and optional phone; verified account email changes require re-verification |
| ACCT-03 | Manage addresses | Customer can create, edit, delete, and choose one default address; address fields follow the current Costa Rica checkout structure |
| ACCT-04 | Manage pets | Customer can create, edit, delete, and select up to ten pets; portion results match the existing calculator for the same inputs |
| ACCT-05 | Reuse saved data deliberately | Checkout offers signed-in profile/address values but lets the customer edit the current checkout without unintentionally changing saved defaults |
| ACCT-06 | Manage saved carts | Customer can view, reopen, and delete up to five saved cart snapshots; UI calls them carts/snapshots, not completed orders |
| ACCT-07 | Import browser data | Eligible local data is summarized before upload, requires affirmative choice, follows deterministic merge rules, and is idempotent |
| ACCT-08 | Export and delete | Customer can request export and complete deletion/revocation; repeated deletion callbacks are safe |
| ACCT-09 | Handle concurrency | Mutations use record versions or timestamps; stale edits cannot silently overwrite newer cross-device changes |
| ACCT-10 | Handle service failure honestly | Failed reads show retry/fallback; failed writes preserve input and never show a success state |

### Preferences and consent

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| CONSENT-01 | Separate necessary processing from marketing | Account operation/privacy acknowledgement and optional email/SMS marketing choices are visually and technically separate; optional choices default off |
| CONSENT-02 | Record consent evidence | Each choice stores purpose, status, policy version, timestamp, locale, and source surface; raw IP/user agent are not stored unless legal/security review requires them |
| CONSENT-03 | Support withdrawal | Customer can withdraw optional consent as easily as granting it; withdrawal stops future export/sync to that channel when such integrations exist |
| CONSENT-04 | Do not condition account value on marketing | Declining marketing does not disable accounts, saved pets, saved addresses, carts, or personalization within the site |

### Recommendations

| ID | Requirement | Acceptance criteria |
| --- | --- | --- |
| REC-01 | Use approved structured metadata | Only products with a complete, published recommendation profile are eligible for personalized claims |
| REC-02 | Apply hard exclusions before ranking | Ineligible life stage, species, discontinued/unavailable status, explicit incompatibility, and approved dietary exclusions remove the product before scoring |
| REC-03 | Rank deterministically | The same pet, catalogue snapshot, and rule version produce the same ordered result |
| REC-04 | Explain recommendations | Every personalized product has at least one reason traceable to product metadata and the selected pet; no unsupported health claim is generated |
| REC-05 | Provide safe fallback | Missing/invalid pet data, incomplete product metadata, or dependency failure yields generic products and a non-alarming explanation |
| REC-06 | Avoid sensitive inference | Ranking uses customer-entered pet data and first-party product interactions only; it does not import social interests, contacts, or ad profiles |
| REC-07 | Capture feedback | “No me interesa” suppresses that product for the selected pet and can be undone from account preferences |
| REC-08 | Version decisions | Impression telemetry includes rule version and non-PII reason codes so results can be audited |

## 12. Recommendation specification

### Required Contentful product metadata

Add a reusable `recommendationProfile` content type or equivalent structured
fields referenced by each active product:

| Field | Type | Purpose |
| --- | --- | --- |
| `species` | Controlled multi-select | MVP value is `dog`; prevents unsupported-species claims |
| `lifeStages` | Controlled multi-select | `puppy-stage-1`, `puppy-stage-2`, `puppy-stage-3`, `adult` |
| `sizes` | Controlled multi-select | `small`, `medium`, `large`, or `all` |
| `activityLevels` | Controlled multi-select | Optional relevance boost, not a medical claim |
| `bodyConditions` | Controlled multi-select | Optional and nutrition-owner approved; never inferred from purchase behavior |
| `proteinSources` | Controlled multi-select | Supports customer-readable matching and future exclusions |
| `dietaryFlags` | Controlled multi-select | Only approved factual flags such as single-protein; no free-form safety logic |
| `excludedProfiles` | Controlled multi-select/reference | Explicit content-governed hard exclusions |
| `recommendationPriority` | Integer within a bounded range | Merchandising tie-breaker, never allowed to override hard exclusions |
| `recommendationReasons` | Localized entries keyed by reason code | Pre-approved Spanish explanation copy |
| `reviewStatus` | Enum | Draft, nutrition-approved, retired |
| `reviewedAt` / `reviewedBy` | Audit fields | Recency and owner accountability |

Publication validation must reject unknown taxonomy values and prevent a product
from becoming personalized-eligible unless required fields and an approved
review status are present. Existing ingredient prose must not be parsed to make
eligibility decisions.

### MVP ranking model

For an eligible product:

```text
score =
  40 if exact life-stage match
  20 if exact size match, 15 if product applies to all sizes
  10 if activity match
  10 if body-condition match approved by nutrition owner
   8 if an available presentation is close to the pet's calculated portion need
   0–5 bounded merchandising priority
   0–3 existing catalogue rating tie-breaker
```

Before scoring, exclude any product that fails species/life-stage eligibility,
has an explicit excluded profile, is retired/discontinued, or is unavailable
according to the currently approved catalogue/availability source. Exact score
weights are feature-flagged configuration with a version identifier and require
product/nutrition approval before change.

The “presentation close to PDR” rule must compare compatible units over an
approved shopping horizon. It must not claim that package size itself is a
feeding recommendation. Price, sponsorship, and margin may not override hard
eligibility or appear as a health rationale.

### Cold start and incomplete data

- No pet: show popular products and invite the customer to create/select a pet.
- Incomplete pet: show only rules supported by known fields; otherwise generic
  ranking.
- No eligible personalized products: show generic catalogue categories rather
  than “no products for your pet.”
- Multiple pets: personalize for one explicit selected pet; never combine
  incompatible profiles into a single unexplained ranking.

## 13. Data model and ownership

Supabase `auth.users` and its managed identity tables own authentication. Public
application tables use UUID primary keys, UTC timestamps, migrations, and RLS.
No application foreign key should depend on an email address.

| Table | Key fields | Retention/notes |
| --- | --- | --- |
| `profiles` | `user_id`, display/first/last name, optional phone, locale, onboarding state, timestamps/version | One per auth user; customer-owned |
| `pets` | `id`, `user_id`, current Plan DNAture fields, calculated portion, calculator rule version, timestamps/version | Up to ten active pets; delete with account |
| `addresses` | `id`, `user_id`, label, Costa Rica address fields, is-default, timestamps/version | Optional; delete with account |
| `saved_carts` | `id`, `user_id`, created/saved time, source, schema version | Maximum five active snapshots unless policy changes |
| `saved_cart_items` | `cart_id`, stable Contentful/Avify identifiers, presentation, quantity, captured display name/price | Snapshot only; current price/availability is revalidated when reopened |
| `preferences` | `user_id`, personalization enabled, selected pet, recommendation dismissals | On-site personalization remains independent from marketing consent |
| `consent_events` | `id`, `user_id`, purpose, granted/withdrawn, policy version, source, timestamp | Append-only evidence; retention set by approved legal schedule |
| `data_requests` | `id`, `user_id` or irreversible lookup, export/deletion type, state, timestamps, non-PII result reference | Operational audit without keeping deleted profile data |
| `migration_receipts` | `user_id`, device-generated migration ID hash, schema version, counts, result, timestamp | Enforces idempotency; never stores imported raw payload |

Recommendation results are computed from current pet/product data and need not be
stored as a customer profile. Privacy-safe impression/click events may be sent to
the approved analytics system only under the applicable consent/policy decision.

### Data-system boundaries

| System | Owns | Must not own |
| --- | --- | --- |
| Supabase Auth | Sessions, provider identities, verified account email | Product catalogue, social access tokens in app tables |
| Supabase Postgres | Customer profile, pets, addresses, preferences, saved carts, consent/data-request records | Payment data, unapproved social profile data |
| Contentful | Product copy, images, recommendation taxonomy and approved reasons | Customer records or behavioral profiles |
| Avify | Existing product/availability/price information within its approved integration | DNAture authentication or customer profile unless separately scoped later |
| Browser | Short-lived anonymous/local state and server-issued session cookie | Provider tokens or a second durable copy of signed-in customer PII |

## 14. Technical approach

### Architecture decision

Use Supabase Auth and Postgres rather than building identity primitives in the
Next.js application.

| Option | Strengths | Limitations | Decision |
| --- | --- | --- | --- |
| Supabase Auth + Postgres/RLS | Social/passwordless auth, managed identity linking, relational customer data, database-enforced ownership, fits Next.js and future personalization | New vendor and operational surface; Meta/Google app review still required | **Selected** |
| Auth.js + separately managed database | Framework-native and flexible | Team must assemble email delivery, database/session operations, provider edge cases, and secure customer-data authorization | Not selected for MVP |
| Auth-only vendor + separate database | Polished identity UX and broad provider support | Two new vendors/data planes and added identity-to-data synchronization | Reconsider if product/design needs exceed selected platform |
| Custom authentication | Maximum control | Unacceptable security, recovery, maintenance, and delivery risk for this project | Rejected |

The selection is a proposed product/architecture decision and still requires
commercial, data-residency, DPA, backup/recovery, and legal review before vendor
commitment.

### Next.js integration

- Add a new `features/Account/` vertical slice that owns account UI, auth client
  boundaries, data mutations, validation, and private helpers.
- Keep `app/` account pages thin, consistent with the existing architecture.
- Put the Supabase server boundary in `services/` only if it is shared
  infrastructure; feature-specific queries remain under `features/Account/`.
- Use the currently supported Supabase SSR approach with server-readable cookies
  and PKCE. Pin and review the auth packages because the vendor documents the
  SSR package API as subject to change.
- Validate the session/user on the server for protected reads and mutations;
  never authorize from client-supplied `user_id`.
- Enforce owner policies in RLS on every exposed table. Service-role credentials
  are server-only and reserved for tightly scoped admin/deletion jobs.
- Add schema migrations and generated/checked types. Preview and production use
  separate projects and secrets.
- Cache public catalogue data as it is today. Customer-specific responses use
  private/no-store semantics and must never enter shared Next.js/CDN caches.
- Update CSP `connect-src`, auth redirect handling, monitoring redaction, the
  operations runbook, privacy inventory, sitemap exclusions, and production
  verification script.

### Logical request flow

```text
Browser
  -> Next.js public/account UI
      -> Supabase Auth (identity and session)
      -> Supabase Postgres + RLS (customer-owned data)
      -> Contentful (product content + recommendation metadata)
      -> Avify service (current price/availability source where approved)
```

### API/mutation boundaries

Prefer typed server actions or route handlers with the same authorization and
validation guarantees. Minimum domain operations:

- `getAccountOverview()`
- `updateProfile(input, expectedVersion)`
- `list/create/update/deletePet(...)`
- `list/create/update/deleteAddress(...)`
- `list/save/reopen/deleteSavedCart(...)`
- `previewLocalImport(metadata)` and `commitLocalImport(payload, migrationId)`
- `getRecommendations(petId, ruleVersion)`
- `updatePreferences(input)`
- `requestDataExport()`
- `deleteAccount(confirmation)`
- `revokeOtherSessions()`

Every mutation validates a bounded schema, derives `user_id` from the verified
session, applies rate limits where abuse is plausible, returns stable error
codes, and excludes raw customer input from logs.

## 15. Security, privacy, and compliance requirements

This section is an engineering/product baseline, not legal advice. Launch
requires qualified review against Costa Rica's Law 8968 and its regulations,
provider terms, and any other market-specific obligations.

### Data protection

- Present a versioned privacy notice before or at first collection. It must
  identify the database/controller, purposes, recipients/processors, optional
  versus required fields, consequences of refusal, customer rights, and contact
  details.
- Collect only `openid`, verified email, and basic profile claims needed for the
  account. Do not request contacts, posts, friends, likes, Instagram media, or
  advertising permissions.
- Maintain a reviewed data map, processor/subprocessor inventory, retention
  schedule, and data-subject request runbook.
- Define exact retention before launch for inactive accounts, consent/security
  audit records, deletion job records, backups, logs, and exports. “Keep
  forever” is not acceptable.
- Exports expire after a short, approved period and require recent
  authentication. Download links are single-use or strongly time-bound.
- Account deletion cascades through customer-owned data and documents exceptions
  approved by legal review. Backups expire through documented lifecycle rather
  than ad hoc direct editing.
- Do not use account or pet data for off-site advertising or marketing without
  an explicit later scope, notice, and consent/legal review.

### Application and identity security

- OAuth 2.0 authorization code flow with PKCE, exact redirect allow lists,
  `state`/nonce validation, and HTTPS in all non-local environments.
- HttpOnly session cookies; rotate refresh tokens according to vendor guidance.
- Rate-limit email code requests, code verification, OAuth callback abuse,
  exports, deletion, and high-volume mutations by privacy-reviewed signals.
- Use generic customer-facing auth errors and correlation IDs. Never log email
  codes, authorization codes, tokens, cookies, full addresses, phone numbers,
  pet payloads, or exports.
- RLS defaults to deny. Each customer can select/mutate only rows whose
  `user_id = auth.uid()`; relationship tables also validate ownership through
  their parent.
- Service role is unavailable to browser bundles. Secrets never use a
  `NEXT_PUBLIC_` prefix unless explicitly designed to be publishable by the
  vendor.
- Protect state-changing requests against CSRF according to the chosen cookie
  pattern and require recent authentication for identity, export, logout-all,
  and deletion operations.
- Sanitize profile strings, constrain lengths/enums/numbers, and escape output.
  Profile images from providers are out of MVP unless proxied and reviewed.
- Establish least-privilege production access, MFA for administrators, audit
  logging, secret rotation, dependency scanning, backup restore testing, and an
  incident-response owner.
- Add auth/vendor endpoints to availability monitoring without sending PII.
  Define behavior for provider outage and database outage.

### Provider-specific readiness

- Google and Facebook apps use DNAture-owned organization accounts, approved
  branding, exact production/preview callbacks, verified domains, privacy URL,
  terms URL, support contact, and deletion instructions/callback as required.
- Provider secrets are separately rotated and scoped per environment.
- Provider launch is gated on production/live status and any provider review;
  developer/test-mode success is not launch readiness.
- Store the auth vendor user/identity references, not provider access tokens.

## 16. Accessibility, localization, and responsive behavior

- All customer copy is Spanish (`es-CR`) at launch; provider brand labels follow
  each provider's current brand requirements.
- Meet WCAG 2.2 AA for the complete account experience, including responsive
  variants.
- Every social button has text, a visible focus state, sufficient contrast, and
  a non-color error state.
- Authentication and import errors are announced through an appropriate live
  region and focus moves to a clear error summary.
- Dialogs, menus, identity controls, destructive confirmations, and pet selector
  support keyboard navigation, Escape behavior where appropriate, focus trapping,
  and focus restoration.
- Passwordless code input supports paste, autofill semantics, back/forward, and
  screen readers without forcing a six-box interaction.
- Session-expiry messaging preserves entered form data and offers sign-in in a
  new flow without creating focus loss.
- Touch targets, zoom/reflow, reduced motion, and 320 CSS-pixel layouts are part
  of release testing.
- Dates/times use Costa Rica locale and make timezone meaning clear. Currency
  remains Costa Rican colón where displayed.

## 17. Analytics and experimentation

### Event taxonomy

| Event | Required properties |
| --- | --- |
| `auth_viewed` | surface, anonymous experiment assignment |
| `auth_started` | provider (`google`, `facebook`, `email`), surface |
| `auth_succeeded` | provider, new-or-returning, latency bucket |
| `auth_failed` | provider, stable error category, retryable; no provider message/token |
| `onboarding_completed` / `onboarding_skipped` | step count, import offered/accepted |
| `local_import_completed` | schema version, counts by record type, result category |
| `pet_saved` | create/update, profile-completeness bucket; no name/weight/raw attributes |
| `recommendations_viewed` | rule version, reason codes, item count, selected-pet opaque ID or session-scoped hash |
| `recommendation_selected` | product stable ID, position, reason codes, action |
| `recommendation_dismissed` | product stable ID, reason code if voluntarily selected |
| `account_export_requested` | result category |
| `account_deletion_requested/completed` | result category, duration bucket |

Analytics must follow the project's consent decision and updated privacy notice.
Email, name, phone, address, provider subject, full user UUID, auth tokens, pet
name, exact weight, and free text are forbidden event properties.

### Experiment design

- Phase 2 uses a stable account-level assignment between personalized and
  generic modules.
- Define primary metric, minimum sample, test duration, and stopping rules before
  exposure. Do not declare success from an underpowered early trend.
- Guardrails include auth reliability, page performance, dismissals, support
  contacts, and checkout/cart completion.
- Customers who disable on-site personalization receive the generic experience
  and are not included as personalized exposure.

## 18. Notifications and communications

Transactional email in MVP is limited to authentication, verified email change,
security/session notices, data-export delivery, and deletion confirmation as
approved. Each template:

- Clearly identifies DNAture and why the message was sent.
- Contains no pet, cart, or address detail unless strictly necessary.
- Uses short-lived, single-use links where applicable.
- Is localized in Spanish and tested for common mobile/email clients.
- Has a support path for unexpected activity.

Production email uses an approved SMTP provider, authenticated DNAture sending
domain, SPF/DKIM/DMARC configuration, bounce monitoring, delivery alerts, and a
tested provider failover/incident procedure. Authentication-code messages must
not include marketing content.

Marketing email and SMS are not implemented in this scope even if consent fields
are collected for future readiness. Avoid collecting channel consent until
DNAture has approved copy, processor, suppression behavior, and an actual use
plan.

## 19. Error and edge-case behavior

| Scenario | Expected behavior |
| --- | --- |
| Customer closes provider window or denies access | Return to sign-in with a neutral cancellation message and retry/guest options |
| Provider returns no usable verified email | Request and verify email before durable profile creation, or explain that the provider cannot be used |
| Email code requested on one device and entered on another | Complete sign-in safely where supported and return to a default account route; never expose the originating browser's local import data |
| Duplicate verified identity | Secure vendor-supported link to the existing account; do not create a duplicate profile |
| Different established accounts appear related | Do not merge; require proof of both accounts through a reviewed recovery process |
| Session expires during edit | Preserve non-sensitive form state in memory, reauthenticate, then retry with concurrency validation |
| Product removed after cart was saved | Keep historical snapshot label, mark unavailable when reopened, and require current price/availability confirmation |
| Pet/profile deleted in another tab/device | Refresh to current server truth and explain the conflict; do not restore stale data automatically |
| Supabase unavailable | Public catalogue and guest cart remain usable; account modules show a bounded retry state |
| Contentful recommendation fields incomplete | Exclude affected products from personalized claims and show generic fallback |
| Avify unavailable | Follow the existing approved catalogue fallback; never claim availability that was not verified |
| Deletion job receives duplicate callbacks | Return the same safe completion/pending outcome without error or duplicated side effects |

## 20. Testing and release acceptance

### Automated coverage

- Unit tests for validation, merge/deduplication, ranking, hard exclusions,
  explanation mapping, return URL validation, and PII redaction.
- Database tests for every RLS policy, including cross-user reads/mutations,
  orphan relationships, deleted accounts, and service-role boundaries.
- Integration tests for Google/Facebook mocked callback states and email
  one-time-code success, expiry, reuse, rate limiting, cancellation, and missing
  claims.
- End-to-end tests for new account, returning sign-in, guest continuation,
  protected-route redirect, local import accept/decline, cross-device pet sync,
  address/cart reuse, identity linking, logout/logout-all, export, and deletion.
- Accessibility tests extend the existing axe and keyboard suite to every account
  route and critical state; automated checks are supplemented by manual screen
  reader and zoom/reflow testing.
- Security tests for CSRF, open redirect, session fixation, token leakage,
  authorization bypass/IDOR, account enumeration, OAuth replay, upload/import
  abuse, and log redaction.
- Performance tests compare public-route and signed-in-route p75 behavior and
  prevent account code from unnecessarily inflating public catalogue bundles.
- Migration tests cover all known `client`/`carts` schema versions, corrupt and
  expired storage, duplicates, retry, partial failure, and idempotency.

### Launch acceptance checklist

- [ ] Product, design, nutrition/content, engineering, operations, support, and
  legal/privacy owners approve their sections.
- [ ] Google and Facebook provider apps are production-ready, not test-only.
- [ ] Privacy notice, terms, consent records, export, deletion, and Meta data
  deletion path pass end-to-end review.
- [ ] All customer tables have tested RLS and explicit grants.
- [ ] Recommendation taxonomy is complete and approved for every personalized
  product; incomplete products fall back safely.
- [ ] Guest regression suite passes unchanged.
- [ ] Account end-to-end, accessibility, security, migration, and load tests pass
  in staging.
- [ ] Production CSP, environment variables, callback allow lists, monitoring
  redaction, backups, restore procedure, and incident contacts are verified.
- [ ] Feature flags and rollback procedure are tested.
- [ ] Support has troubleshooting and account-recovery scripts that never ask
  customers to send codes or tokens.
- [ ] Baseline funnel and performance dashboards are live before broad rollout.

## 21. Rollout and rollback

1. **Internal:** staff/test identities only; validate callbacks, policies,
   deletion, and local migration against non-production data.
2. **Canary:** expose account entry point to a small random percentage; keep
   recommendations generic. Monitor auth errors, support contacts, database/RLS
   failures, latency, and guest regressions.
3. **Accounts general availability:** release account/saved-pet capabilities;
   keep personalized ranking behind a separate flag.
4. **Recommendation experiment:** enable only after Contentful metadata audit and
   nutrition approval.
5. **General personalization:** expand if success metrics and guardrails hold.

Rollback flags independently disable provider buttons, account prompts, local
import, and personalized modules. Disabling UI must not strand existing
customers: authenticated account access, export, and deletion remain available
through a safe maintenance path. A rollback never deletes customer data.

## 22. Dependencies and owners

| Dependency | Accountable role |
| --- | --- |
| Product scope, copy, metrics, and rollout approval | Product owner |
| Supabase project, schema, RLS, auth integration, migrations | Engineering owner |
| Google Cloud OAuth and Meta app configuration/review | Engineering + business owner |
| Transactional email/SMTP, sender-domain authentication, and deliverability | Operations + business owner |
| Privacy notice, consent, retention, vendor/DPA and PRODHAB determination | Qualified legal/privacy owner |
| Product suitability taxonomy and recommendation reason approval | Nutrition/content owner |
| Contentful model/migration and completeness workflow | Content owner + engineering |
| Monitoring, backup/restore, incident response, secret rotation | Operations owner |
| Account/recovery/deletion support playbooks | Customer support owner |
| UX, responsive states, provider brand compliance, accessibility | Design owner |

## 23. Risks and mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Social provider review or policy change delays launch | Missing advertised provider | Keep email passwordless as independent fallback; gate each button by production readiness |
| Account linking creates duplicates or takeover opportunity | Loss of trust/data exposure | Link only securely verified identities; no silent merge of different established emails; recent-auth checks |
| Existing local data is overwritten or uploaded unexpectedly | Customer data loss/privacy breach | Preview, affirmative import, deterministic conflicts, idempotency, reconciliation tests |
| Product taxonomy is incomplete or inaccurate | Unsafe/irrelevant recommendation claims | Structured required fields, approval workflow, hard exclusions, generic fallback |
| Account backend outage harms current store | Lost sales/engagement | Keep public and guest flows independent; bounded account fallback and separate feature flags |
| New PII appears in logs/analytics | Privacy/security incident | Central redaction, event allow list, payload tests, no raw mutation bodies |
| Customers mistake saved cart images for fulfilled orders | Support and trust problems | Consistently label as saved cart/order image; do not claim order status/history |
| Account scope expands into medical advice | Safety and regulatory risk | Pre-approved factual reason copy; no diagnosis/inference; nutrition/legal review |
| Vendor lock-in grows | Migration cost | Own relational schema/migrations, stable internal domain API, routine export/restore tests |
| Auth SDK/SSR integration changes | Security or session regression after dependency updates | Pin versions, review vendor release notes, and run callback/cookie/cache-isolation tests before upgrades |

## 24. Open decisions before implementation

These are deliberate gates, not unspecified implementation details:

1. Who is the legal database controller, privacy contact, and customer-support
   escalation owner?
2. What exact retention periods apply to inactive accounts, consent evidence,
   security logs, exports, deletion receipts, and backups?
3. Does the proposed database use and any cross-border processing require
   registration, notices, contractual terms, or additional controls under Costa
   Rican law?
4. Has Supabase passed commercial, data-residency, subprocessor, DPA,
   availability, backup, and recovery review? If not, which requirement fails?
5. Should remembered delivery details be imported by default only after explicit
   confirmation, or should Phase 1 initially import pets and carts only?
6. Which role has authority to mark Contentful recommendation metadata as
   nutrition-approved?
7. Which exact product statuses and Avify fields constitute “available” for hard
   eligibility?
8. Is the existing five-cart/30-day behavior retained for cloud carts, or does
   product/legal review approve a different limit?
9. Is Sign in with Apple justified for Phase 2 by actual Safari/iOS traffic?
10. What volume and statistical threshold is required before judging the
    recommendation experiment?
11. What account age eligibility and terms language are required? Do not collect
    date of birth solely to answer this question; prefer the minimum
    legally-approved eligibility control.
12. Which production transactional-email provider, sending domain, bounce policy,
    and failover procedure are approved for email codes and security messages?

## 25. Delivery sequence

1. Resolve legal/vendor/content ownership gates and approve the data map.
2. Add Supabase environments, migrations, RLS tests, server session plumbing,
   and feature flags.
3. Implement email authentication and account shell first, then Google and
   Facebook behind independent readiness flags.
4. Implement profile, pets, addresses, saved carts, preferences, and safe local
   migration.
5. Implement export, deletion, session controls, support/operations workflows,
   and full security/accessibility coverage.
6. Extend Contentful, backfill/approve recommendation metadata, then ship the
   deterministic ranking behind a separate experiment flag.
7. Canary, observe baselines, expand accounts, run the recommendation experiment,
   and decide on Phase 3 using evidence.

## 26. External references and rationale

- [Supabase Auth overview](https://supabase.com/docs/guides/auth): supported
  passwordless/social methods and Auth/Postgres integration.
- [Supabase social login providers](https://supabase.com/docs/guides/auth/social-login):
  current first-party provider support, including Google and Facebook; Instagram
  is not listed as a standard provider.
- [Supabase identity linking](https://supabase.com/docs/guides/auth/auth-identity-linking):
  verified-email automatic linking and user-initiated manual linking behavior.
- [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security):
  database-enforced customer row ownership.
- [Supabase SSR authentication](https://supabase.com/docs/guides/auth/server-side):
  cookie-based sessions and PKCE guidance for frameworks such as Next.js.
- [Supabase passwordless email](https://supabase.com/docs/guides/auth/auth-email-passwordless):
  single-use email OTP support.
- [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp):
  production email delivery requires separately configured SMTP rather than the
  restricted trial sender.
- [Google OpenID Connect](https://developers.google.com/identity/openid-connect/openid-connect):
  Google identity terminology and OIDC-based sign-in.
- [Meta's official Instagram API collection](https://www.postman.com/meta/instagram/folder/6raa77c/instagram-api-with-instagram-login):
  Instagram Login is currently for professional accounts and management
  capabilities, supporting the decision not to present it as consumer login.
- [Costa Rica Law 8968, official text](https://pgrweb.go.cr/scij/Busqueda/Normativa/Normas/nrm_texto_completo.aspx?nValor1=1&nValor2=70975&param1=NRTC):
  informed-consent, data-quality, access/correction/deletion, and database duties
  that require qualified launch review.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/): accessibility conformance target.

## 27. Definition of done

The feature is done when a customer can create or access one account with any
launch provider, safely import or decline local data, manage pets and account
information across devices, receive explainable and content-approved
recommendations with a generic fallback, control sessions/consent/export/deletion,
and still complete every existing guest flow. It must pass the launch checklist,
have operational owners and rollback paths, and satisfy the approved privacy,
security, accessibility, and recommendation-governance requirements.
