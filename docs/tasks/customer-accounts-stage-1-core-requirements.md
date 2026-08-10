# Stage 1 — Core customer accounts product-owner requirements

**Status:** Active production-entry checklist  
**In scope:** Customer authentication, profile, addresses, pet profiles, portion planning, saved carts, optional personalization, optional reminders, privacy, support, analytics, and release  
**Explicitly excluded:** Red Veterinaria and all promotions/discounts

## How to use this checklist

Every item marked **BLOCKS START** must be approved before Stage 1 production coding begins. Every other item must have a named owner, approver, and target date before coding begins, and must be resolved before the indicated epic or release gate.

No Stage 2 or Stage 3 decision is required to start Stage 1.

## Stage 1 production-entry gates

### S1-G01 — Exact release scope — **BLOCKS START**

- [ ] Mark each capability as `Stage 1 required`, `later Stage 1 release`, or `excluded`:
  - Account registration and sign-in.
  - Customer dashboard.
  - Customer profile and address.
  - Pet profiles.
  - Portion-planning estimates.
  - Saved carts and cart restoration.
  - Product recommendations.
  - In-account reminders.
  - Email or other reminder channels.
- [ ] Confirm whether the storefront continues without online payment.
- [ ] Explicitly decide whether order history, invoices, subscriptions, recurring delivery, and payment are outside Stage 1.
- [ ] Confirm that all Red Veterinaria and promotion UI is disabled or excluded from the Stage 1 production experience.

### S1-G02 — Decision authority — **BLOCKS START**

- [ ] Name the accountable product owner.
- [ ] Name the executive sponsor and budget authority.
- [ ] Name the legal/privacy approver.
- [ ] Name the veterinarian or clinical authority for portion calculations and health-related wording.
- [ ] Name the customer-support and operational owner.
- [ ] Define final authority when product, legal, clinical, operational, and engineering recommendations conflict.

For Stage 1, no partner-network commercial owner is required.

### S1-G03 — Audience and rollout — **BLOCKS START**

- [ ] Define whether Stage 1 starts with staff, invited customers, existing customers, or public registration.
- [ ] Define whether anyone may register or an existing DNAture relationship is required.
- [ ] Define Costa Rican geographic availability and any delivery-area limitations relevant to saved addresses/carts.
- [ ] Approve rollout stages, feature flags, target dates, and go/no-go approvers.

### S1-G04 — Success and stop criteria — **BLOCKS START**

- [ ] Approve the business outcomes for Stage 1.
- [ ] Set measurable targets for sign-up completion, successful sign-in, pet-profile completion, saved-cart use, repeat visits, or support volume.
- [ ] Define stop/rollback thresholds for authentication failures, email failures, authorization incidents, incorrect portion results, broken cart restoration, or excessive support load.
- [ ] Name the owner and review period for post-launch results.

### S1-G05 — Vendors, ownership, and budget — **BLOCKS START**

- [ ] Approve the production authentication/database provider, hosting, Resend, analytics, and monitoring vendors.
- [ ] Confirm the legal DNAture entity that owns each account and contract.
- [ ] Approve expected costs and who may authorize increases.
- [ ] Confirm development, staging, and production environment ownership.
- [ ] Confirm DNS ownership for Resend domain authentication.
- [ ] Confirm ownership of Google/Meta developer applications for approved sign-in providers.
- [ ] Require secrets to be provided through approved environment/secret management, never task documents or chat.

## Authentication and identity

### S1-AUTH01 — Sign-in methods — **BLOCKS START**

- [ ] Decide whether Stage 1 supports email one-time codes, magic links, passwords, Google, Facebook, or another provider.
- [ ] Decide which methods are launch requirements versus later additions.
- [ ] Do not promise Instagram sign-in without confirmed Meta support for the intended identity flow.
- [ ] Approve customer behavior when a social provider or email service is unavailable.

### S1-AUTH02 — Customer eligibility and age — **BLOCKS START**

- [ ] Define who may create a customer account.
- [ ] Define minimum age and any guardian requirements.
- [ ] Decide whether professional, wholesale, staff, or business users may use the customer experience.
- [ ] Approve eligibility wording and unsupported account types.

### S1-AUTH03 — Verification and authoritative identity — **BLOCKS AUTH EPIC**

- [ ] Decide whether verified email is mandatory.
- [ ] Decide whether phone verification is required for account access, delivery, or approved communication channels.
- [ ] Decide whether email or phone is authoritative when identifiers change.
- [ ] Approve behavior for unverified, suspended, deactivated, and deleted accounts.

### S1-AUTH04 — Duplicate accounts and provider linking — **BLOCKS AUTH EPIC**

- [ ] Decide what happens when multiple providers return the same verified email.
- [ ] Decide whether linking is automatic, requires reauthentication, or is prohibited.
- [ ] Define the support process for duplicate accounts and ownership disputes.
- [ ] Decide whether data merging is ever permitted and who authorizes it.

### S1-AUTH05 — Sessions and devices — **BLOCKS AUTH EPIC**

- [ ] Approve expected signed-in duration.
- [ ] Decide whether simultaneous devices are allowed.
- [ ] Define events that revoke one or all sessions.
- [ ] Approve customer-facing security alerts and communication channels.

### S1-AUTH06 — Recovery and support verification — **BLOCKS AUTH EPIC**

- [ ] Approve recovery paths for lost email access, changed phone numbers, and compromised social accounts.
- [ ] Define what support may request to verify ownership.
- [ ] Prohibit support from requesting passwords or one-time codes.
- [ ] Approve response-time expectations and escalation for inaccessible accounts.

### S1-AUTH07 — Guest-to-account transition — **BLOCKS CART EPIC**

- [ ] Confirm that customers may browse and use the cart without an account, if applicable.
- [ ] Decide where sign-in is optional versus required.
- [ ] Define how a guest cart merges with an account cart.
- [ ] Approve conflict behavior when both carts contain items.
- [ ] Decide whether checkout data may be offered for profile creation and the consent required.

### S1-AUTH08 — Sign-out, deactivation, and deletion — **BLOCKS PROFILE EPIC**

- [ ] Define these as separate customer actions.
- [ ] Approve any cooling-off or recovery period.
- [ ] Decide what happens to profile, address, pets, saved carts, preferences, consents, and security/operational records.
- [ ] Approve how mandatory retention exceptions are communicated.

## Customer profile and preferences

### S1-PROFILE01 — Required and optional fields — **BLOCKS PROFILE EPIC**

- [ ] Approve the exact fields required during registration.
- [ ] Approve optional profile fields and the business purpose for each.
- [ ] Decide whether phone is required and which formats are supported.
- [ ] Decide whether sensitive fields such as birth date or identity number are prohibited, optional, or necessary. Do not collect them without approved purpose and legal review.

### S1-PROFILE02 — Costa Rican address model — **BLOCKS PROFILE EPIC**

- [ ] Approve province, canton, district, exact directions, postal code, delivery notes, map pin, or another model.
- [ ] Decide whether customers may save multiple addresses.
- [ ] Define how addresses interact with the existing ordering and delivery-area workflow.
- [ ] Define validation, incomplete-address, and unsupported-area behavior.

### S1-PROFILE03 — Preference and consent separation — **BLOCKS PROFILE EPIC**

- [ ] Distinguish functional preferences, personalization, transactional notifications, and marketing consent.
- [ ] Decide which choices default on/off; legal/privacy must approve consent defaults.
- [ ] Define where customers review and change choices.
- [ ] Define which core functions remain available when personalization or marketing is disabled.

## Pet profiles and portion planning

### S1-PET01 — Supported pets and limits — **BLOCKS PET EPIC**

- [ ] Decide whether Stage 1 supports only dogs or also cats/other species.
- [ ] Approve the maximum number of pets per account.
- [ ] Decide whether household sharing or multiple pet managers are in scope.
- [ ] Approve supported measurement units.

### S1-PET02 — Pet fields — **BLOCKS PET EPIC**

- [ ] Approve every required and optional pet field.
- [ ] Approve allowed values for life stage, size, neuter status, body condition, activity, and weight.
- [ ] Decide whether breed, allergies, conditions, medications, photos, veterinarian, or birth date are in scope.
- [ ] Do not collect health-related information without an approved purpose, privacy classification, and authorized reviewer.

### S1-PET03 — Clinical ownership — **BLOCKS PET EPIC**

- [ ] Obtain written approval of the portion formula from a named qualified veterinary/clinical authority.
- [ ] Approve supported species, ages, weight range, edge cases, rounding, units, and contraindications.
- [ ] Approve when no estimate is shown and the customer guidance for that situation.
- [ ] Approve all health-related claims, explanations, and disclaimers.
- [ ] Define formula versioning, review frequency, change approval, and behavior for existing profiles.
- [ ] Decide whether the result is educational guidance, a purchase-planning estimate, or another approved category.

### S1-PET04 — History and deletion — **BLOCKS PET EPIC**

- [ ] Decide whether weight, portion, and profile changes are stored historically or only as current values.
- [ ] Define customer-visible history and retention.
- [ ] Define what deleting a pet removes and any approved exceptions.
- [ ] Decide whether deleted pet records may remain in anonymized analytics.

## Saved carts and existing commerce flow

### S1-CART01 — Stage 1 commerce boundary — **BLOCKS START**

- [ ] Confirm whether accounts continue to use a cart without online payment.
- [ ] Define what “use this cart” or “reorder” means.
- [ ] Explicitly include or exclude order history, invoices, subscriptions, recurring delivery, and payments.

### S1-CART02 — Saved-cart rules — **BLOCKS CART EPIC**

- [ ] Approve maximum carts, maximum items, naming, duplicates, overwrite, and deletion behavior.
- [ ] Define saved-cart and inactive-account retention.
- [ ] Decide whether carts synchronize across devices immediately.

### S1-CART03 — Catalog changes — **BLOCKS CART EPIC**

- [ ] Decide behavior when a saved product is unavailable, discontinued, renamed, repriced, or moved to another presentation.
- [ ] Decide whether substitutions are shown and who owns substitution rules.
- [ ] Decide whether historical price, current price, or both are displayed.
- [ ] Approve confirmation before replacing or merging the active cart.

### S1-CART04 — Profile/address reuse — **BLOCKS CART EPIC**

- [ ] Decide whether stored profile/address data prepopulates the ordering flow.
- [ ] Approve customer confirmation before stored data is used or changed.
- [ ] Decide whether cart activity may influence Stage 1 recommendations or reminders.

## Personalization and reminders

### S1-PERS01 — Personalization scope — **BLOCKS PERSONALIZATION EPIC**

- [ ] Decide whether recommendations ship in Stage 1.
- [ ] Approve allowed inputs: pet profile, cart activity, purchase activity, or content engagement.
- [ ] Prohibit unapproved inputs and undisclosed tracking.
- [ ] Decide whether customers see why something was recommended.

### S1-PERS02 — Recommendation ownership and safety — **BLOCKS PERSONALIZATION EPIC**

- [ ] Name the business/clinical owner of recommendation rules.
- [ ] Approve eligible products, exclusions, conflicts, and unavailable-product behavior.
- [ ] Define which recommendations require veterinary review.
- [ ] Prohibit diagnostic, treatment, or guaranteed-outcome wording without separate authority.
- [ ] Define rule testing, versioning, review, and emergency disablement.

### S1-PERS03 — Reminders and channels — **BLOCKS REMINDERS EPIC**

- [ ] Decide whether reminders are in-account only or also email, WhatsApp, push, or SMS.
- [ ] Approve triggers, timing, frequency, quiet periods, and stop conditions.
- [ ] Separate helpful account reminders from marketing.
- [ ] Define opt-out behavior per channel.
- [ ] Approve the vendor, business account, budget, and operating owner for any non-email channel.

## Legal, privacy, and data governance

Qualified legal/privacy counsel must approve these decisions. An implementation agent must not invent them.

### S1-LEGAL01 — Legal entity and governing requirements — **BLOCKS START**

- [ ] Identify the legal entity operating accounts and acting as data controller.
- [ ] Provide official business identity, address, and privacy contact.
- [ ] Identify applicable Costa Rican and cross-border requirements.
- [ ] Name qualified counsel and the approval process.

### S1-LEGAL02 — Customer documents — **BLOCKS PUBLIC LAUNCH**

- [ ] Provide approved privacy notice and account terms.
- [ ] Provide approved cookie/tracking notice and consent behavior where required.
- [ ] Provide approved portion-planning disclaimer.
- [ ] Provide approved electronic-communications and marketing wording.
- [ ] Provide approved account deletion, export, and complaint instructions.
- [ ] Version documents and define acceptance of material changes.

### S1-LEGAL03 — Data inventory and purpose — **BLOCKS DATA MODEL**

- [ ] Approve every customer, address, pet, cart, preference, consent, analytics, email, support, and security field stored in Stage 1.
- [ ] Document purpose, legal basis, sensitivity, source, recipients, owner, and prohibited uses.
- [ ] Identify fields that must not be collected.
- [ ] Classify pet and health-related information.

### S1-LEGAL04 — Retention and deletion — **BLOCKS DATA MODEL**

- [ ] Approve retention for accounts, profiles, addresses, pets, carts, preferences, consents, security events, emails, support cases, analytics, and backups.
- [ ] Define anonymization versus deletion.
- [ ] Define legal holds and operational exceptions.
- [ ] Define inactive-account notification, deactivation, and deletion.

### S1-LEGAL05 — Customer data rights — **BLOCKS PUBLIC LAUNCH**

- [ ] Approve verification for access, correction, export, objection, consent withdrawal, and deletion requests.
- [ ] Define response times, responsible team, export format, and escalation.

### S1-LEGAL06 — Children and guardians — **BLOCKS AUTH EPIC**

- [ ] Decide whether minors may use accounts.
- [ ] If allowed, provide age-gating, guardian consent, and data requirements.
- [ ] If prohibited, provide eligibility wording and enforcement expectations.

### S1-LEGAL07 — Vendors and international processing — **BLOCKS VENDOR SETUP**

- [ ] Approve the authentication/database provider, Netlify, Resend, OAuth providers, analytics, monitoring, and Stage 1 messaging providers.
- [ ] Complete data-processing agreements and transfer reviews.
- [ ] Approve public subprocessor disclosure and vendor-change process.
- [ ] Define permitted data-processing regions.

### S1-LEGAL08 — Incident responsibilities — **BLOCKS PUBLIC LAUNCH**

- [ ] Name incident decision-makers and notification owners.
- [ ] Approve customer, regulator, and vendor notification procedures.
- [ ] Define evidence preservation and post-incident review.

## Content, brand, accessibility, and communication

### S1-CONTENT01 — Naming and language — **BLOCKS CONTENT FREEZE**

- [ ] Approve “Mi DNAture” and every Stage 1 module name.
- [ ] Approve Costa Rican voseo, tone, capitalization, and terminology.
- [ ] Decide whether another language is required.
- [ ] Name the final Spanish copy approver.

### S1-CONTENT02 — States and promises — **BLOCKS CONTENT FREEZE**

- [ ] Approve onboarding, empty, loading, validation, error, expired-session, unavailable-product, and deletion copy.
- [ ] Approve every response-time, availability, security, privacy, health, delivery, or savings statement used in Stage 1.
- [ ] Remove promises the business cannot operationally support.

### S1-CONTENT03 — Accessibility — **BLOCKS START**

- [ ] Approve the accessibility target, recommended as WCAG 2.2 AA.
- [ ] Make mobile and assistive-technology acceptance part of definition of done.
- [ ] Name who may approve documented exceptions; agents may not silently waive requirements.

### S1-COMMS01 — Resend identity and templates — **BLOCKS AUTH EPIC**

- [ ] Approve sender name, domain, from address, reply-to behavior, and monitored support address.
- [ ] Name the owner of DNS, SPF, DKIM, DMARC, bounce handling, and suppression review.
- [ ] Approve Spanish verification, login, email-change, security-alert, and account-closure templates.

### S1-COMMS02 — Marketing separation — **BLOCKS PUBLIC LAUNCH**

- [ ] Decide whether marketing email is in Stage 1.
- [ ] Separate marketing consent from transactional messages.
- [ ] Define audiences, unsubscribe, suppression, frequency, and ownership.

## Analytics, staff access, support, and operations

### S1-OPS01 — Analytics and consent — **BLOCKS ANALYTICS EPIC**

- [ ] Approve Stage 1 KPIs and events.
- [ ] Approve analytics vendor, retention, access roles, and consent.
- [ ] Decide whether pet attributes, approximate location, cart behavior, and recommendations may enter analytics.
- [ ] Prohibit events containing email, phone, exact address, free-text directions, or unapproved pet/health data.

### S1-OPS02 — Staff roles — **BLOCKS START**

- [ ] Define Stage 1 roles such as support, content reviewer, clinical reviewer, privacy administrator, and system administrator.
- [ ] Approve what each role may view and change.
- [ ] Define high-risk actions requiring dual approval.
- [ ] Define audit-log visibility and review cadence.

### S1-OPS03 — Customer support — **BLOCKS PUBLIC LAUNCH**

- [ ] Approve channels, operating hours, response targets, escalation levels, and owner.
- [ ] Provide playbooks for login, duplicate accounts, incorrect data, cart issues, deletion/export, privacy complaints, and compromise.
- [ ] Train support staff before pilot.

### S1-OPS04 — Monitoring and incidents — **BLOCKS PUBLIC LAUNCH**

- [ ] Define alerts for authentication, email, database, authorization, and saved-cart failures.
- [ ] Name responders and escalation contacts.
- [ ] Approve maintenance, customer communication, rollback, and status-update expectations.

## Release and acceptance

### S1-REL01 — Environment and data separation — **BLOCKS SETUP**

- [ ] Approve separate development, staging, and production environments.
- [ ] Define production access and access-review ownership.
- [ ] Approve synthetic/non-production test-data rules.
- [ ] Confirm demo `localStorage` data is discarded, not migrated.

### S1-REL02 — Pilot — **BLOCKS PILOT**

- [ ] Define participants, duration, devices, support, and geographic availability.
- [ ] Approve success, pause, rollback, and expansion criteria.
- [ ] Decide which Stage 1 capabilities remain feature-flagged.

### S1-REL03 — Acceptance evidence — **BLOCKS RELEASE**

- [ ] Approve acceptance scenarios for every in-scope module.
- [ ] Require mobile, desktop, accessibility, authorization, privacy, failure, recovery, and data-rights evidence.
- [ ] Require written clinical approval for portion guidance.
- [ ] Require legal approval for all customer-facing policies and consent.
- [ ] Confirm Stage 2 and Stage 3 features are absent or disabled.

### S1-REL04 — Go/no-go authority — **BLOCKS RELEASE**

- [ ] Name product, engineering, legal/privacy, clinical, operations, and executive signers.
- [ ] Define mandatory signers for pilot and public release.
- [ ] Define stop/rollback authority and conditions.

## Inputs required from the product owner

- [ ] Approved Stage 1 scope matrix and explicit exclusions.
- [ ] Named product, executive, legal/privacy, clinical, support, and operational owners.
- [ ] Approved customer journeys and acceptance scenarios.
- [ ] Final profile, address, and pet fields.
- [ ] Written portion-formula and disclaimer approval.
- [ ] Legal entity details, policies, consent matrix, and retention schedule.
- [ ] Vendor approvals, account ownership, budget, and data-processing agreements.
- [ ] Resend domain/DNS ownership and approved templates.
- [ ] Approved sign-in providers and owned developer applications.
- [ ] Support channels, playbooks, hours, and escalation contacts.
- [ ] Analytics events, consent, reporting owner, and success targets.
- [ ] Pilot cohort, release criteria, rollback conditions, and signers.

## Stage 1 AI-agent boundaries

An implementation agent must not:

- Enable, implement, or expose Red Veterinaria or promotion capabilities during Stage 1.
- Approve clinical formulas, pet-health fields, health claims, or disclaimers.
- Treat drafted legal/consent language as approved legal advice.
- Choose retention, lawful basis, age eligibility, international-processing rules, or marketing permissions.
- Use customer or pet data for a purpose not explicitly approved for Stage 1.
- Promise response times, availability, security outcomes, delivery coverage, or savings without evidence and authority.
- Provision vendors, spend budget, create external applications, sign agreements, or accept terms for DNAture.
- Weaken accessibility, authorization, privacy, security, or audit requirements to accelerate delivery.

When a required decision is missing, the agent must stop the affected Stage 1 workstream, cite the decision ID, and request an authorized answer. Missing Stage 2/3 decisions are not blockers because those capabilities are excluded.

## Stage 1 ready-to-start definition

- [ ] Every **BLOCKS START** item is approved.
- [ ] Every remaining Stage 1 item has an owner, approver, and target date.
- [ ] No Stage 1 capability depends on partner-network or promotion decisions.
- [ ] Vendor ownership and development/staging environments are available.
- [ ] Engineering has converted approved decisions into a traceable Stage 1 roadmap.
- [ ] Product owner and engineering lead have signed the Stage 1 decision-register baseline.
