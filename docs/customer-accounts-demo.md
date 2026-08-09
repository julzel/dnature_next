# DNAture client accounts — frontend demo handoff

## Purpose

This implementation is an interactive proposal for a client account experience. It is designed for stakeholder review and usability discussion, not for real customer data.

The demo shows how a DNAture account can add value beyond the food products themselves: it helps a client organize pet profiles, understand approximate food needs, prepare recurring purchases, connect with trusted commercial allies, and receive relevant suggestions in one simple place.

All customer-facing interface copy is in Costa Rican Spanish (`es-CR`).

## What was implemented

### Entry and access

- A new account entry in the global header.
- Simulated Google and Facebook access.
- Simulated passwordless email access with one-time code `123456`.
- A prominent “Explorar cuenta con datos de ejemplo” option for stakeholder presentations.
- Clear demo notices explaining that no data is sent to DNAture.
- Signed-out protection for all account sections.

### Client dashboard

- Personal greeting and account summary.
- Number of pet profiles and saved carts.
- Selected-pet food plan for 7, 14, or 30 days.
- Approximate kilograms and number of 1 kg packages needed.
- Summary of the real active shopping cart.
- Shortcuts to pets, the Red Veterinaria, saved carts, and profile settings.
- Example personalized product recommendations, explicitly labeled as a demo proposal.

### Pet profiles

- Create, edit, select, and delete up to 10 profiles.
- Adult and puppy flows.
- Weight, size, neuter status, body condition, and activity data.
- Reuse of DNAture's existing portion-calculation logic.
- Immediate daily-portion preview.
- Clear disclaimer that the estimate does not replace veterinary advice.

### Red Veterinaria

- A new signed-in directory for veterinary clinics, at-home veterinarians, and associated pet shops.
- Eight clearly fictional partner profiles across four Costa Rican provinces.
- Search by partner name, location, service, and specialty.
- Filters for partner type, province, service, available member benefits, and favorites.
- Mobile-first filter disclosure: search and partner type stay immediately available, while secondary filters remain collapsed until requested.
- Detailed partner information including address, hours, highlighted services, specialties, and illustrative availability.
- Persistent favorite partners stored with the local demo account.
- Optional promotional-benefit proposals with example codes and terms.
- A simulated contact-request flow with pet, reason, preferred channel, and preferred schedule.
- Pet-profile sharing disabled by default and available only through an explicit opt-in.
- Clear emergency, commercial-relationship, clinical-responsibility, and fictional-data notices.

The module intentionally treats “Aliado DNAture” as a commercial-network status rather than a clinical endorsement. Real partner information, service claims, availability, promotions, and agreements would require verification before publication.

### Shopping-cart integration

- The current site cart can be saved to the demo account under a friendly name.
- Up to five recent carts are retained.
- Saved carts show products, quantities, dates, and a reference total.
- A saved cart can replace the current cart and be reopened in the existing cart flow.
- The stakeholder sample contains two illustrative saved carts.

Integrating the cart is recommended. Pet profiles are valuable on their own, but the strongest client benefit appears when the profile, portion plan, product discovery, and repeat purchase form one continuous flow. It also gives customers a practical reason to return to their account.

### Profile and preferences

- Personal and Costa Rican address fields.
- Optional personalized recommendations.
- Optional reminders displayed inside the account.
- Sign out without deleting saved demo data.
- Full local demo reset with confirmation.

## Demo routes

| Route | Purpose |
| --- | --- |
| `/cuenta/iniciar-sesion` | Simulated account access and sample-data entry |
| `/cuenta` | Personalized dashboard |
| `/cuenta/mascotas` | Pet profile management |
| `/cuenta/red-veterinaria` | Partner directory, benefits, favorites, and contact-request demo |
| `/cuenta/carritos` | Active-cart saving and saved-cart reuse |
| `/cuenta/perfil` | Client data and preferences |

The routes are excluded from indexing in both their page metadata and `robots.txt` rules.

## Stakeholder presentation script

A concise presentation takes about seven minutes:

1. Open `/cuenta/iniciar-sesion` and explain that every access method is simulated.
2. Select “Explorar cuenta con datos de ejemplo.”
3. On the dashboard, switch between Luna and Nala and change the plan between 7, 14, and 30 days.
4. Open “Mis mascotas,” edit a profile, and show how the portion changes with the profile data.
5. Open “Red Veterinaria,” search for “nutrición,” filter by province, and save an ally as a favorite.
6. Open a partner, review the proposed member benefit, and prepare a contact request for Luna. Emphasize that profile sharing is off by default and that nothing is sent.
7. Open “Mis carritos,” choose “Alimento de la quincena,” and use it to populate the existing site cart.
8. Open “Mi perfil” to show address reuse, personalization controls, sign-out behavior, and demo reset.
9. Return to the access page and demonstrate the email flow using code `123456` if time allows.

Use obviously fictional information during the presentation. The sample account is `sofia.demo@dnaturefood.com` and is not a real identity.

## How the demo stores data

The implementation has no database, no real authentication, and no account API. It stores one versioned JSON document in the current browser's `localStorage` under:

```text
dnature-account-demo-v1
```

This storage choice is intentionally limited to the approved frontend demo. It allows navigation and browser refreshes to feel realistic without creating the impression that the data belongs to a secure customer account.

Important limitations:

- Anyone with access to the browser profile can inspect or change the demo data.
- Data does not synchronize between devices or browsers.
- Clearing browser storage deletes the account demo.
- Google, Facebook, email verification, recommendations, partner contacts, availability, benefits, and reminders do not call external services.
- The account is not connected to a real DNAture customer record.
- Sample cart names, products, prices, and dates are illustrative.
- Every partner, address, schedule, appointment option, promotion, and benefit in the Red Veterinaria is fictional.

No production feature should rely on this local state as an authorization or security boundary.

## Verification added

- Unit coverage for the versioned state, storage migration, sample data, pet lifecycle, sign-in merging, cart limits, partner favorites, and invalid stored data.
- Browser tests for the full stakeholder sample, email-code flow, pet creation, saved-cart restoration, partner search, favorites, and contact-request flow.
- Narrow-phone coverage verifies the directory, expanded filters, partner details, and contact form at 320 px without horizontal page overflow.
- Automated accessibility checks for the sign-in page, populated dashboard, and populated Red Veterinaria.
- Production compilation was validated. The final static-generation stage still requires network access to the project's existing Contentful endpoint.

## Requirements for production readiness

### 1. Confirm the product scope

Before backend implementation, stakeholders should approve:

- The account value proposition and navigation.
- Which pet fields are required versus optional.
- Who owns and medically reviews the portion rules and disclaimer.
- Whether product suggestions are manually curated, rule-based, or behavior-based.
- Saved-cart behavior when a product, presentation, or price changes.
- Whether reminders stay inside the account or later expand to email or WhatsApp.
- The minimum address information needed for the current ordering workflow.
- The retention, export, and account-deletion experience.
- Which organizations qualify as allies and who approves or suspends a listing.
- Which partner types, provinces, service areas, and contact methods launch first.
- Who verifies partner credentials, services, schedules, and commercial status, and how often.
- Whether contact requests go to the partner directly or through DNAture.
- Promotion funding, redemption, limits, expiration, exclusions, and dispute ownership.
- Whether any pet information may be shared with a partner and the exact consent required.

Legal decisions remain intentionally deferred during demo review, as requested. They are still launch blockers and must be completed before collecting real customer information.

### 2. Production architecture

The recommended path for the current Next.js and Netlify project is:

- **Supabase Auth** for real sessions and supported OAuth providers.
- **Supabase Postgres** for profiles, pets, preferences, and saved carts.
- **Row Level Security (RLS)** on every customer-owned table, enabled from the beginning.
- **Resend** as the approved SMTP/email delivery service for verification and account emails.
- Server-side authorization checks for every account read or mutation.
- Netlify environment variables for public Supabase configuration and protected server secrets.

The browser must never receive a Supabase service-role key or Resend API key. OAuth callback URLs must be configured for local, preview, and production Netlify environments. Preview deployments should use test credentials and non-production data.

### 3. Authentication and identity

- Replace every simulated provider action with Supabase Auth.
- Support passwordless email access or email/password only after stakeholder confirmation.
- Configure Google and Facebook applications, consent screens, domains, and callback URLs.
- Validate Instagram feasibility separately before presenting it as a guaranteed sign-in provider; Meta's Instagram products and permissions are not identical to general consumer identity login.
- Require verified email addresses when email is the account identifier.
- Add secure sign-out, session expiry, refresh, and revoked-session handling.
- Define safe account-linking rules when social providers return the same verified email.
- Add rate limits and abuse controls for verification attempts and account creation.
- Use neutral errors that do not reveal whether an email address is registered.

### 4. Suggested data model

At minimum:

- `profiles`: one row per authenticated user; name, phone, address fields, timestamps.
- `pets`: owner ID, profile fields used by the calculator, optional calculated snapshot, timestamps.
- `preferences`: personalization and reminder choices with change timestamps.
- `saved_carts`: owner ID, name, timestamps, and schema version.
- `saved_cart_items`: saved cart ID, stable product/presentation identifier, quantity, and optional price snapshot.
- `partners`: legal/commercial identity, status, verification dates, partner type, and public profile data.
- `partner_locations`: address, province, canton, district, service area, coordinates, hours, and contact channels.
- `partner_services`: controlled service taxonomy linked to each location.
- `partner_benefits`: eligibility, code or redemption mechanism, start/end dates, limits, terms, and active status.
- `favorite_partners`: authenticated owner ID and partner ID.
- `partner_contact_requests`: customer, partner, reason, preferred channel, status, timestamps, and a consent snapshot.
- `account_events`: restricted operational audit events without sensitive payloads.

Portions and prices should be recalculated from trusted current rules when displayed or used. Stored snapshots may support history, but they must not silently override current product availability or pricing.

Every customer-owned table needs an explicit ownership column and RLS policies for `select`, `insert`, `update`, and `delete`. Test that one authenticated user cannot read or mutate another user's records.

### 5. Cart and catalog hardening

- Use stable catalog and presentation IDs rather than demo IDs or product names.
- Revalidate product availability, current price, tax, and delivery rules when restoring a cart.
- Explain substitutions or removed products before replacing the active cart.
- Decide whether saving an identical cart updates it or creates a copy.
- Define maximum quantities and saved-cart limits at both API and database layers.
- Preserve guest-cart items during sign-in and offer an explicit merge choice if the account already has an active cart.
- Add transaction-safe mutations for saved carts and items.

### 6. Red Veterinaria and partner operations

- Create a partner onboarding and approval workflow separate from the customer-facing directory.
- Verify legal business identity, locations, professional credentials where applicable, public contact channels, and permission to use brand assets.
- Use controlled taxonomies for partner type, services, specialties, and geographic coverage.
- Record who verified each field, when it was verified, and when it expires or needs review.
- Let partners or authorized DNAture staff maintain hours while preserving moderation and audit history.
- Never represent commercial membership as clinical accreditation or a guarantee of outcomes.
- Define a fast suspension and removal process for closed, outdated, unsafe, or disputed listings.
- Route contact requests through authenticated server endpoints with rate limits, spam protection, delivery status, and safe retry behavior.
- Share no pet data unless the customer selects a pet, actively opts in, and confirms a clear field-level summary.
- Store the consent wording and version alongside any transmitted profile snapshot.
- Treat illustrative availability as non-binding until a partner provides a real scheduling integration or confirms the request.
- Add a correction/reporting channel for inaccurate partner information.

For promotions:

- Require start and end dates, eligibility rules, redemption limits, exclusions, inventory constraints, and approved Spanish terms.
- Revalidate eligibility server-side at redemption; never trust a code displayed in the browser as proof of entitlement.
- Decide whether DNAture, the partner, or both fund each benefit and own customer support.
- Track issuance and redemption without exposing one customer's activity to another.
- Automatically stop expired, depleted, suspended-partner, or manually disabled benefits.
- Keep core partner discovery useful even when no discount is available.

### 7. Personalization and customer value

Recommended sequence after the account foundation:

1. **Useful without tracking:** selected pet, food plan, saved carts, and profile completeness.
2. **Rule-based assistance:** product categories and educational content matched to life stage and needs, with transparent reasons such as “Sugerido por su etapa adulta.”
3. **Convenience:** reorder from a validated saved cart and surface upcoming food needs.
4. **Opt-in reminders:** first inside the account, then email only after consent and notification rules are approved.
5. **Care history:** optional weight and portion history, with clear dates and source information.
6. **Local support:** relevant nearby allies, favorite locations, and transparent member benefits without selling placement as medical advice.

Do not infer health conditions or present recommendations as diagnoses. Customers should be able to disable personalization without losing core account functions.

### 8. Email with Resend

- Authenticate the DNAture sending domain with SPF, DKIM, and DMARC.
- Separate transactional templates from any future marketing communication.
- Build Spanish templates for verification, sign-in codes, email changes, and security notices.
- Use short-lived, single-use authentication codes managed by the auth provider.
- Configure sender names, reply handling, bounce monitoring, suppression, and retry behavior.
- Never place secrets or sensitive pet/account details in email URLs.
- Test delivery and rendering across major mobile email clients.

### 9. Security, privacy, and legal launch gates

- Complete a data inventory and classify each field before persistence.
- Publish approved privacy, terms, retention, deletion, and consent copy.
- Collect only fields with an approved business purpose.
- Encrypt traffic, protect secrets, rotate credentials, and review dependencies.
- Add CSRF-safe mutation patterns, input validation, output escaping, and rate limiting.
- Provide verified email-change and account-deletion flows.
- Define administrator access, support verification, audit logging, and breach response.
- Approve partner terms, directory disclaimers, promotion terms, consent wording, and responsibility for clinical and commercial disputes.
- Review Costa Rican requirements and any other applicable jurisdictions with qualified counsel.

The implementation should not move from demo to real data collection until these controls and policies are approved.

### 10. Reliability and operations

- Structured error reporting with sensitive-data redaction.
- Metrics for sign-up completion, sign-in failures, pet-profile completion, cart saves, and cart restores.
- Metrics for directory searches, zero-result filters, favorites, contact-request delivery, response time, and benefit redemption.
- Alerts for elevated auth/email failures.
- Database migrations, backups, restore tests, and a rollback plan.
- Idempotent account and cart mutations.
- Support playbooks for duplicate accounts, inaccessible email addresses, and deletion requests.
- Feature flags for staged rollout and rapid disablement.

### 11. Production test plan

- Unit tests for validation, portion logic, cart reconciliation, and permissions helpers.
- Integration tests against an isolated Supabase project with RLS enabled.
- End-to-end tests for every auth provider, email verification, refresh, expiry, sign-out, account linking, and recovery.
- Authorization tests with two users attempting cross-account access.
- Partner-directory moderation, publication, expiration, suspension, and stale-data tests.
- Contact-request consent, delivery, retry, duplicate-submission, rate-limit, and cross-account isolation tests.
- Promotion eligibility, expiration, inventory-limit, single-use, and concurrent-redemption tests.
- Accessibility checks across desktop and mobile account routes.
- Responsive visual review on common Costa Rican mobile device sizes and slower connections.
- Failure testing for offline behavior, expired codes, unavailable products, email delivery failures, and database timeouts.
- Load and abuse testing for login and verification endpoints.

## Recommended implementation order after approval

1. Freeze approved UX and define the production data contract.
2. Create Supabase environments, migrations, RLS policies, and automated policy tests.
3. Integrate Supabase Auth with email through Resend.
4. Add one OAuth provider end to end, then add further providers individually.
5. Replace local profile and pet state with server-authorized persistence.
6. Add saved-cart persistence and robust catalog reconciliation.
7. Create partner onboarding, verification, moderation, and directory publishing.
8. Add favorites and the consent-based partner contact-request flow.
9. Pilot one tightly scoped benefit with server-side eligibility and redemption controls.
10. Add transparent rule-based recommendations.
11. Complete legal copy, deletion/export, security review, observability, and support tools.
12. Run a staff-only pilot, then a limited customer beta behind a feature flag.
13. Review evidence and approve general availability.

## Demo reset and removal

Stakeholders can reset the proposal from “Mi perfil” → “Borrar datos de demostración.” Developers can also remove the `dnature-account-demo-v1` local-storage entry.

If the proposal is not approved, remove the `/cuenta` routes, the header account entry, `AccountDemoProvider`, feature files, and related tests. The demo does not create server-side records that require cleanup.
