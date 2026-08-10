# Stage 2 — Product Owner Requirements for Red Veterinaria

**Status:** Deferred until the Stage 1 account foundation is production-ready.

This document contains the decisions and source material that DNAture must provide before implementing **Red Veterinaria** for production. It covers the partner directory, discovery, favorites, contact flows, optional pet-information sharing, partner administration, and the operating model behind those capabilities.

Promotions, discounts, coupons, benefit codes, and redemption are intentionally excluded. They belong to [Stage 3](./customer-accounts-stage-3-promotions-requirements.md) and cannot block this stage.

## Stage boundary

### Included in Stage 2

- Red Veterinaria navigation and directory.
- Definition and verification of associated veterinarians, veterinary clinics, and pet shops.
- Partner profiles, locations, schedules, services, specialties, and contact information.
- Search, filters, geographic discovery, maps, and result ranking.
- Saving partners as favorites.
- Contact requests or appointment inquiries, if approved.
- Optional sharing of selected pet information with a partner, if approved.
- Partner data maintenance, moderation, complaints, suspension, and offboarding.
- Analytics, support, privacy, and operational controls required by these modules.

### Explicitly excluded from Stage 2

- Promotions, discounts, coupons, campaign offers, loyalty benefits, or special prices.
- Promotion eligibility, discount percentages, codes, QR redemption, usage limits, or settlement.
- Promotional badges, promotional filters, savings claims, and campaign notifications.
- Any commercial promise that requires the Stage 3 rules to be approved.

If the demo currently displays promotional content within Red Veterinaria, that content must be hidden or replaced with neutral partner information in the Stage 2 production implementation.

## Dependencies

- Stage 1 authentication, customer profiles, privacy controls, authorization, support procedures, and production infrastructure must be ready.
- Stage 2 may reuse the authenticated customer and pet records created in Stage 1, but only for purposes approved in this document.
- Stage 3 is not a dependency. Red Veterinaria must remain useful without offers or discounts.
- If a Stage 2 decision would create a discount or promotional entitlement, move that decision to Stage 3.

## Governance and business scope

### S2-G01 — Product scope — **BLOCKS START**

- [ ] Define which partner types are included at launch: veterinarians, clinics, hospitals, pet shops, laboratories, groomers, or others.
- [ ] Define which capabilities launch first: directory, search, favorites, direct contact, inquiry requests, appointment requests, or pet-information sharing.
- [ ] Confirm whether partners need a self-service portal at launch or whether DNAture will manage listings internally.
- [ ] Define the initial geographic coverage in Costa Rica.
- [ ] Define whether the release is a private pilot, limited public launch, or general release.
- [ ] Confirm that promotions and discounts are absent from the Stage 2 release.

### S2-G02 — Decision authority — **BLOCKS START**

- [ ] Name the accountable product owner and executive sponsor.
- [ ] Name the partner-network commercial owner.
- [ ] Name the legal/privacy approver.
- [ ] Name the veterinarian or clinical authority for health-related wording and credential requirements.
- [ ] Name the partner onboarding and data-maintenance owner.
- [ ] Name the customer-support and operational owner.
- [ ] Define who has final authority when product, legal, clinical, commercial, and engineering recommendations conflict.

### S2-G03 — Success and stop criteria — **BLOCKS RELEASE**

- [ ] Define measurable goals for useful geographic coverage, verified listings, search success, favorites, and contact requests.
- [ ] Define the minimum acceptable listing accuracy and partner response performance.
- [ ] Define customer trust or satisfaction indicators.
- [ ] Define conditions that pause or stop the pilot, such as inaccurate credentials, stale listings, privacy incidents, or unresolved complaints.
- [ ] Define the review date and decision-maker for expansion.

### S2-G04 — Budget and external services — **BLOCKS START WHEN APPLICABLE**

- [ ] Approve budgets and owners for maps, geocoding, messaging, partner-management tools, or other required services.
- [ ] Approve the geographic data provider and its licensing terms.
- [ ] Confirm whether map and location services may receive customer location or search data.
- [ ] Approve any partner onboarding, verification, or moderation staffing costs.

## Partner-network model

### S2-NET01 — Meaning of an associated partner — **BLOCKS START**

- [ ] Define what “Red Veterinaria”, “aliado”, and any verification badge mean to a customer.
- [ ] Define whether the relationship is referral, directory listing, commercial alliance, clinical collaboration, or another model.
- [ ] Define what DNAture does and does not endorse about a listed partner.
- [ ] Approve the customer-facing explanation of the network in Spanish for Costa Rica.

### S2-NET02 — Eligibility and verification — **BLOCKS START**

- [ ] Define eligibility criteria for every permitted partner type.
- [ ] Define required business, professional, permit, and identity documentation.
- [ ] Define who verifies each document and which authoritative source is used.
- [ ] Define verification frequency, expiration handling, and re-verification triggers.
- [ ] Define approval, rejection, suspension, appeal, and offboarding rules.
- [ ] Define how verification status and limitations appear to customers.

### S2-NET03 — Public partner profiles — **BLOCKS START**

- [ ] Approve all public listing fields: legal and display names, description, partner type, addresses, phone numbers, WhatsApp, website, and social links.
- [ ] Approve service, specialty, species, schedule, emergency-care, accessibility, and payment-method taxonomies.
- [ ] Decide whether staff names, professional credentials, photographs, logos, prices, and availability may be shown.
- [ ] Obtain rights to use partner names, trademarks, photographs, and other submitted content.
- [ ] Define how multiple branches and temporary closures are represented.
- [ ] Define who is accountable for the accuracy of each field.

### S2-NET04 — Discovery, geography, and ranking — **BLOCKS START**

- [ ] Define search and filter behavior, supported place names, service categories, and species categories.
- [ ] Define whether the site requests precise device location, accepts a typed location, uses a saved address, or supports all three.
- [ ] Approve the consent and fallback experience for location permission.
- [ ] Define distance units, search radius, map behavior, and handling when no nearby results exist.
- [ ] Define the ranking algorithm and permitted ranking signals.
- [ ] Decide whether commercial relationships may affect ranking; if yes, approve clear disclosure and legal review.
- [ ] Confirm that promotional offers are not ranking signals in Stage 2.

### S2-NET05 — Favorites — **BLOCKS START**

- [ ] Confirm that customers can save and remove favorite partners.
- [ ] Define whether favorites are private to the customer or visible to DNAture and partners.
- [ ] Define retention, export, and deletion behavior for favorites.
- [ ] Define any non-promotional personalization allowed from favorite data.
- [ ] Approve analytics events that may be generated from favorites.

### S2-NET06 — Contact and inquiry flows — **BLOCKS START IF INCLUDED**

- [ ] Decide whether DNAture only displays contact channels or transmits an inquiry to a partner.
- [ ] If DNAture transmits inquiries, define required and optional fields, recipients, delivery channels, statuses, and confirmation behavior.
- [ ] Decide whether the flow is an inquiry, appointment request, or confirmed booking; approve exact customer wording.
- [ ] Define expected response times without promising service DNAture cannot enforce.
- [ ] Define delivery-failure, duplicate, cancellation, spam, harassment, and abuse handling.
- [ ] Define which party becomes responsible for the customer relationship after contact.
- [ ] Define whether message content is stored, for how long, and who may access it.

### S2-NET07 — Sharing pet information — **BLOCKS START IF INCLUDED**

- [ ] State the exact customer benefit and approved purpose for sharing pet information.
- [ ] Define the exact fields that may be shared; default to the minimum necessary.
- [ ] Require an explicit, partner-specific customer action before each share unless legal approves a different model.
- [ ] Define the consent record, disclosure text, timestamp, partner recipient, and audit evidence.
- [ ] Decide whether the partner receives a snapshot or continuing access.
- [ ] Define expiry, revocation, correction, deletion, and re-sharing behavior.
- [ ] Define whether health-related notes or clinical information are permitted and obtain clinical and legal approval.
- [ ] Define what happens to already transmitted information when a customer revokes access or deletes an account.

### S2-NET08 — Clinical boundaries and urgent situations — **BLOCKS START**

- [ ] Define whether emergency or urgent-care filters are permitted and how their accuracy is maintained.
- [ ] Approve wording that distinguishes directory information from veterinary advice, diagnosis, or guaranteed availability.
- [ ] Define the emergency guidance shown when a customer may need urgent veterinary attention.
- [ ] Define who reviews health-related service categories, partner claims, and customer-facing clinical wording.
- [ ] Define how unsafe, misleading, or unverified clinical claims are reported and removed.

### S2-NET09 — Partner and administrative access — **BLOCKS START**

- [ ] Define whether partners receive accounts and, if so, which staff roles and permissions exist.
- [ ] Define who may create, edit, publish, verify, suspend, and delete partner records.
- [ ] Define approval workflows for partner-submitted changes.
- [ ] Define authentication requirements, audit logs, and access reviews for partner and DNAture staff.
- [ ] Define a safe manual operating process if no partner portal is included initially.

## Privacy, legal, and contractual requirements

### S2-LEGAL01 — Data inventory and purposes — **BLOCKS START**

- [ ] Inventory every new data field for partners, locations, searches, favorites, inquiries, location use, and pet sharing.
- [ ] Define the purpose and legal basis for each processing activity.
- [ ] Classify data by sensitivity and define who can access it.
- [ ] Confirm which information is public, customer-only, partner-visible, or DNAture-internal.

### S2-LEGAL02 — Retention and customer rights — **BLOCKS RELEASE**

- [ ] Define retention and deletion periods for searches, precise location, favorites, inquiries, consent records, partner records, and audit logs.
- [ ] Define how customer access, correction, export, objection, and deletion requests apply to Stage 2 data.
- [ ] Define responsibilities after information has been sent to an independent partner.
- [ ] Define what must be retained for disputes, safety, fraud prevention, or legal obligations.

### S2-LEGAL03 — Vendors and cross-border processing — **BLOCKS RELEASE**

- [ ] Approve every map, geocoding, messaging, verification, storage, and analytics vendor.
- [ ] Record the data each vendor receives, processing location, retention, security commitments, and subprocessor terms.
- [ ] Approve required agreements and privacy-notice disclosures.

### S2-LEGAL04 — Partner agreements — **BLOCKS PARTNER LAUNCH**

- [ ] Approve the partner participation agreement and data responsibilities.
- [ ] Define credential, listing-accuracy, response, confidentiality, security, and incident-reporting obligations.
- [ ] Define permitted trademark and content use.
- [ ] Define complaint, suspension, termination, and data-return/deletion obligations.
- [ ] Define responsibility and liability for services delivered by partners.
- [ ] Confirm that the agreement contains no implied promotional commitment; promotions require a separate Stage 3 approval or addendum.

### S2-LEGAL05 — Disclosures and consent copy — **BLOCKS RELEASE**

- [ ] Approve Spanish copy explaining DNAture’s relationship with partners and any limitations of endorsement.
- [ ] Approve location-permission, inquiry-transmission, and pet-information-sharing disclosures.
- [ ] Approve directory accuracy, availability, emergency, and clinical disclaimers.
- [ ] Approve consent withdrawal and customer-rights instructions.

## Content and communication

### S2-CONTENT01 — Naming and Spanish copy — **BLOCKS UI ACCEPTANCE**

- [ ] Approve the module name, partner labels, verification labels, filters, actions, empty states, errors, and help copy in Costa Rican Spanish.
- [ ] Approve wording for closed locations, unavailable services, stale information, no results, and failed inquiries.
- [ ] Approve accessibility labels and plain-language explanations.
- [ ] Remove promotional badges, benefit labels, offer filters, discount codes, and savings claims from Stage 2 content.

### S2-CONTENT02 — Partner assets — **BLOCKS PARTNER PUBLICATION**

- [ ] Provide approved logos, photographs, descriptions, contact details, locations, schedules, and services.
- [ ] Record content ownership, usage permission, source, verification date, and next review date.
- [ ] Define image quality, accessibility text, and prohibited-content standards.

### S2-COMMS01 — Customer and partner messages — **BLOCKS RELEASE IF INCLUDED**

- [ ] Approve inquiry acknowledgements, delivery failures, partner notifications, cancellations, and follow-up messages.
- [ ] Define which messages are transactional and which require separate consent.
- [ ] Approve sender identity, reply handling, frequency limits, and escalation paths.
- [ ] Confirm that Stage 2 messages contain no promotional offer unless Stage 3 is separately approved and released.

## Operations, support, and measurement

### S2-OPS01 — Partner onboarding and data maintenance — **BLOCKS PARTNER LAUNCH**

- [ ] Document onboarding, verification, publishing, periodic review, change requests, and offboarding.
- [ ] Define listing owners and service-level expectations for correcting inaccurate information.
- [ ] Define automated and manual stale-data detection.
- [ ] Define coverage and continuity when the responsible operator is unavailable.

### S2-OPS02 — Complaints and safety — **BLOCKS RELEASE**

- [ ] Define how customers report inaccurate information, misconduct, safety concerns, or privacy issues.
- [ ] Define severity levels, response times, investigation ownership, evidence handling, and escalation.
- [ ] Define when a listing or contact capability is temporarily disabled.
- [ ] Define how customers and partners are notified of outcomes where appropriate.

### S2-OPS03 — Support readiness — **BLOCKS RELEASE**

- [ ] Provide support scripts and escalation paths for search, favorites, location, inquiries, consent, and partner complaints.
- [ ] Define supported channels and hours.
- [ ] Train support staff on the boundary between directory support and veterinary advice.
- [ ] Confirm support can identify and escalate privacy or safety incidents.

### S2-DATA01 — Analytics — **BLOCKS RELEASE**

- [ ] Approve events for directory views, searches, filters, zero-result searches, map use, favorites, contact attempts, and delivery outcomes.
- [ ] Define metric owners, dashboards, retention, access, and review cadence.
- [ ] Prohibit sensitive message, precise-location, or pet-health data from analytics unless specifically approved.
- [ ] Confirm Stage 2 success does not depend on promotion or discount performance.

### S2-SEC01 — Security and monitoring — **BLOCKS RELEASE**

- [ ] Approve authorization rules for customer, partner, support, and administrative access.
- [ ] Define audit events for listing changes, verification, contact access, pet sharing, suspension, and deletion.
- [ ] Define alerting for unauthorized access, bulk extraction, delivery failures, and abnormal contact activity.
- [ ] Complete security and privacy review of every enabled Stage 2 data flow.

## Release approval

### S2-REL01 — Pilot data and acceptance — **BLOCKS RELEASE**

- [ ] Use only real, verified partners with permission to participate; do not publish fictional demo partners as real listings.
- [ ] Approve the pilot geography, partner cohort, customer cohort, duration, and support coverage.
- [ ] Approve mobile-first acceptance criteria for directory, filters, maps, profiles, favorites, and contact flows.
- [ ] Test no-results, denied-location, stale-listing, closed-location, failed-contact, revoked-consent, and account-deletion cases.
- [ ] Confirm all Stage 3 UI and behavior are disabled.

### S2-REL02 — Sign-off — **BLOCKS RELEASE**

- [ ] Product owner signs off on scope and customer experience.
- [ ] Partner-network owner signs off on listings and operations.
- [ ] Legal/privacy signs off on contracts, disclosures, consent, and data handling.
- [ ] Clinical authority signs off on credentials, services, emergency, and health-related wording.
- [ ] Engineering/security signs off on authorization, auditability, monitoring, and recovery.
- [ ] Support and operations sign off on procedures, staffing, and escalation.
- [ ] Executive sponsor authorizes release.

## Required source material

- [ ] Approved partner strategy and launch scope.
- [ ] Verified partner roster and branch data.
- [ ] Credential and business-document verification policy.
- [ ] Signed partner agreements and content permissions.
- [ ] Approved service, specialty, species, and location taxonomies.
- [ ] Approved Spanish copy and disclosures.
- [ ] Privacy data inventory, retention schedule, and consent rules.
- [ ] Vendor decisions and agreements.
- [ ] Support, complaint, safety, incident, and offboarding procedures.
- [ ] Acceptance criteria, pilot plan, and named signers.

## Decisions an AI agent must not make

An implementation agent may recommend technical options, identify inconsistencies, and build only after the relevant decisions are approved. It must not independently:

- Define who qualifies as an associated or verified partner.
- Verify professional credentials or represent that a partner is safe, available, or clinically appropriate.
- Choose what personal, location, or pet information may be disclosed to a partner.
- Invent partner listings, contact details, contracts, permissions, service claims, or emergency guidance.
- Decide ranking policies that confer undisclosed commercial advantage.
- Create appointments or service guarantees that the operating model cannot fulfill.
- Introduce discounts, promotions, codes, savings claims, or promotional messages.
- Replace legal, clinical, commercial, privacy, security, or executive approval.

## Stage 2 ready-to-start gate

Stage 2 implementation may start when all applicable **BLOCKS START** items have named owners and recorded decisions, the Stage 1 foundation is ready, and the initial partner data can be verified safely. Stage 3 decisions are not prerequisites.

Production release additionally requires every applicable **BLOCKS RELEASE**, **BLOCKS PARTNER LAUNCH**, and **BLOCKS UI ACCEPTANCE** item to be completed and signed off.
