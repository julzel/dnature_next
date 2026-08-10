# Stage 3 — Product Owner Requirements for Promotions and Discounts

**Status:** Deferred commercial stage. It is not required for core accounts or the initial Red Veterinaria release.

This document contains the business, financial, legal, operational, and product decisions DNAture must make before offering production promotions, discounts, coupons, codes, or partner benefits to authenticated customers.

## Stage boundary

### Included in Stage 3

- DNAture-funded or partner-funded promotions and discounts.
- Customer, account, pet, purchase, product, service, branch, or campaign eligibility.
- Coupons, benefit codes, QR codes, entitlements, redemption, usage limits, and expiration.
- Online and offline validation, fraud controls, reversals, refunds, disputes, and reconciliation.
- Promotional placement, campaign communication, terms, support, and performance reporting.

### Not automatically included

- A loyalty-points program, subscription, referral program, gift cards, store credit, or payment processing unless each is expressly approved in scope.
- A partner promotion simply because the partner appears in Red Veterinaria.
- Discounting regulated, restricted, clinically sensitive, or otherwise excluded products or services.

## Dependencies

- Stage 1 accounts must be production-ready before account-specific eligibility or redemption is enabled.
- If a promotion applies to a Red Veterinaria partner, the relevant Stage 2 partner, contract, listing, and operational controls must be production-ready.
- Promotions that do not use Red Veterinaria may proceed only if their target, fulfillment, and ownership model is independently approved.
- No promotion is implied by a customer account, pet profile, saved cart, recommendation, or partner relationship.

## Governance, scope, and economics

### S3-G01 — Promotion program scope — **BLOCKS START**

- [ ] Define which program types are permitted at launch: automatic discounts, coupons, partner benefits, one-time offers, campaigns, or others.
- [ ] Define where each program may apply: DNAture products, a partner’s products, veterinary services, pet-shop purchases, or another approved target.
- [ ] Define whether redemption is online, in person, by assisted support, or through more than one channel.
- [ ] Confirm whether loyalty, referrals, subscriptions, gift cards, store credit, or payments are excluded or separately included.
- [ ] Define the pilot audience, geography, duration, and participating products, services, and partners.

### S3-G02 — Decision authority — **BLOCKS START**

- [ ] Name the accountable product owner and executive sponsor.
- [ ] Name the commercial owner for promotions and partner benefits.
- [ ] Name the finance, accounting, and tax approver.
- [ ] Name the legal/privacy approver.
- [ ] Name the partner-network owner when a promotion involves Red Veterinaria.
- [ ] Name the customer-support, fraud, reconciliation, and operational owners.
- [ ] Define who has final authority when product, legal, finance, commercial, partner, and engineering recommendations conflict.

### S3-G03 — Economics and funding — **BLOCKS START**

- [ ] Define who funds each discount and who absorbs refunds, reversals, taxes, processing costs, and fraud losses.
- [ ] Approve total campaign budget, per-customer exposure, and maximum liability.
- [ ] Define whether DNAture compensates a partner and on what evidence and schedule.
- [ ] Define required margins and prohibited loss-making scenarios.
- [ ] Define the financial owner who can pause a campaign.

### S3-G04 — Success and stop criteria — **BLOCKS RELEASE**

- [ ] Define success metrics such as activation, qualified redemption, incremental purchase, retention, cost, margin, and customer satisfaction.
- [ ] Define how incrementality will be evaluated without misleading attribution.
- [ ] Define fraud, budget, complaint, operational, legal, and technical thresholds that pause or stop a campaign.
- [ ] Define review cadence, reporting owners, and expansion criteria.

## Promotion and discount rules

### S3-PROMO01 — Offer definition — **BLOCKS EACH PROMOTION**

- [ ] Record the offer owner, sponsor, funding source, purpose, audience, and participating seller or partner.
- [ ] Define eligible and excluded products, services, branches, channels, customer segments, and geographic areas.
- [ ] Define the discount type and value, currency, maximum savings, minimum purchase, start time, end time, timezone, and inventory or budget cap.
- [ ] Define whether the offer stacks with other discounts, prices, benefits, refunds, or campaigns.
- [ ] Define account, customer, household, pet, transaction, partner, and time-period usage limits.
- [ ] Define what happens when prices, availability, partner status, or campaign funding changes.
- [ ] Obtain commercial, finance, legal, operational, and product approval before publication.

### S3-PROMO02 — Eligibility and issuance — **BLOCKS START**

- [ ] Define the authoritative eligibility rules and the system that evaluates them.
- [ ] Decide whether eligibility attaches to an account, verified email, customer, household, pet, cart, purchase history, membership, partner, or manually approved case.
- [ ] Define duplicate-account and identity-handling rules without collecting unnecessary data.
- [ ] Define whether existing customers qualify and whether eligibility can be applied retroactively.
- [ ] Define entitlement creation, activation, reservation, release, expiry, and revocation.
- [ ] Define the customer experience when eligibility cannot be confirmed.

### S3-PROMO03 — Codes and redemption — **BLOCKS START**

- [ ] Decide whether redemption uses automatic eligibility, a code, QR code, link, account lookup, partner validation, receipt evidence, or another method.
- [ ] Define code generation, uniqueness, distribution, storage, secrecy, expiration, and invalidation rules.
- [ ] Define the authoritative redemption record and atomic controls that prevent double use.
- [ ] Define pending, approved, rejected, cancelled, expired, reversed, and disputed states.
- [ ] Define the online and offline fallback when a customer, partner, or system lacks connectivity.
- [ ] Define the evidence shown to customers, partners, support, and finance.
- [ ] Define behavior for partial fulfillment, split transactions, refunds, cancellations, and exchanges.

### S3-PROMO04 — Fraud, abuse, and fairness — **BLOCKS RELEASE**

- [ ] Define prohibited behavior, abuse signals, rate limits, duplicate detection, and high-risk thresholds.
- [ ] Define when redemption is automatically denied versus sent for manual review.
- [ ] Define investigation access, evidence retention, decision authority, and audit requirements.
- [ ] Define customer and partner notification, appeal, correction, and reinstatement processes.
- [ ] Review eligibility and enforcement rules for unfair exclusion or unintended discrimination.
- [ ] Define emergency controls for disabling issuance or redemption without corrupting valid records.

### S3-PROMO05 — Reconciliation, tax, and disputes — **BLOCKS RELEASE**

- [ ] Define accounting treatment for discounts, reimbursements, liabilities, breakage, reversals, and expired entitlements.
- [ ] Obtain tax approval for every promotion model and transaction channel.
- [ ] Define partner claim submission, required evidence, validation, settlement schedule, and payment authorization.
- [ ] Define refund, chargeback, duplicate, mismatch, rejected claim, and customer-dispute procedures.
- [ ] Define who can make financial adjustments and the required audit trail.
- [ ] Define reconciliation reports, owners, review cadence, and retention.

### S3-PROMO06 — Campaign lifecycle — **BLOCKS START**

- [ ] Define draft, approval, scheduled, active, paused, depleted, expired, cancelled, and archived states.
- [ ] Define who may create, approve, edit, publish, pause, extend, cancel, and archive a promotion.
- [ ] Define whether material changes require re-acceptance or new customer notice.
- [ ] Define what customers see when an offer is not yet active, exhausted, expired, paused, or cancelled.
- [ ] Define how outstanding entitlements are handled when a campaign or partner ends.

## Privacy, legal, and contractual requirements

### S3-LEGAL01 — Promotion data inventory — **BLOCKS START**

- [ ] Inventory all eligibility, issuance, exposure, click, code, redemption, transaction, receipt, fraud, dispute, and settlement data.
- [ ] Define purpose, legal basis, sensitivity, source, access, recipient, retention, and deletion for each field.
- [ ] Define whether customer, pet, cart, purchase, location, or partner data may be combined for eligibility or targeting.
- [ ] Prohibit unapproved sensitive or health-related inference for promotional targeting.

### S3-LEGAL02 — Offer terms and disclosures — **BLOCKS EACH PROMOTION**

- [ ] Approve complete Spanish terms: promoter, eligibility, value, exclusions, dates, locations, limits, stacking, availability, redemption, refunds, cancellation, and contact information.
- [ ] Define how customers access the applicable version before accepting or redeeming an offer.
- [ ] Define versioning and evidence that the correct terms were presented.
- [ ] Approve material-limitation placement so important restrictions are not hidden.
- [ ] Confirm consumer-protection, advertising, tax, and sector-specific compliance in Costa Rica.

### S3-LEGAL03 — Partner promotion agreements — **BLOCKS PARTNER PROMOTION**

- [ ] Approve a signed promotion agreement or addendum for each participating partner.
- [ ] Define funding, eligible inventory or services, validation, settlement, taxes, refunds, fraud losses, disputes, support, and audit rights.
- [ ] Define permitted marketing claims, trademarks, assets, channels, and approval process.
- [ ] Define availability commitments, termination, suspension, outstanding entitlements, and customer remediation.
- [ ] Confirm that a general Red Veterinaria listing agreement alone does not authorize a promotion.

### S3-LEGAL04 — Marketing consent and communication — **BLOCKS CAMPAIGN MESSAGES**

- [ ] Define which communications are transactional and which are promotional marketing.
- [ ] Define the required consent, preferences, suppression, unsubscribe, and evidence rules for each channel.
- [ ] Define audience-selection and exclusion rules.
- [ ] Approve sender identity, frequency caps, quiet hours, and complaint handling.
- [ ] Confirm that declining marketing does not improperly block necessary account or redemption messages.

### S3-LEGAL05 — Vendors and data sharing — **BLOCKS RELEASE**

- [ ] Approve vendors used for codes, QR validation, messaging, analytics, fraud, receipts, settlement, or support.
- [ ] Record data disclosed, processing location, retention, security commitments, subprocessors, and contractual protections.
- [ ] Approve required privacy-notice and customer-rights updates.

## Customer experience and content

### S3-CONTENT01 — Spanish promotional copy — **BLOCKS UI ACCEPTANCE**

- [ ] Approve offer names, summaries, calls to action, eligibility explanations, exclusions, expiry, redemption instructions, and support copy in Costa Rican Spanish.
- [ ] Approve states for unavailable, ineligible, already used, pending, rejected, expired, exhausted, reversed, and disputed offers.
- [ ] Substantiate savings, scarcity, exclusivity, and availability claims.
- [ ] Avoid dark patterns, misleading countdowns, hidden limits, ambiguous prices, or exaggerated benefits.
- [ ] Approve accessible presentation of codes, terms, status, and errors on mobile devices.

### S3-CONTENT02 — Placement and personalization — **BLOCKS START**

- [ ] Define approved placements in the account dashboard, cart, product pages, pet profiles, Red Veterinaria, email, and other channels.
- [ ] Define which customer actions or data may trigger an offer.
- [ ] Define frequency, priority, conflict, and suppression rules when several offers qualify.
- [ ] Define whether recommendations and promotions must be visually distinguished.
- [ ] Confirm that customers without offers still receive a complete and useful experience.

### S3-COMMS01 — Campaign and redemption messages — **BLOCKS RELEASE**

- [ ] Approve issuance, activation, reminder, expiration, redemption, rejection, reversal, cancellation, and dispute messages.
- [ ] Define required versus optional messages, delivery channels, timing, and retry behavior.
- [ ] Define which messages require marketing consent and which are necessary to administer an accepted benefit.
- [ ] Approve support contact, reply handling, and escalation instructions.

## Operations, support, security, and measurement

### S3-OPS01 — Campaign operations — **BLOCKS RELEASE**

- [ ] Document campaign creation, approval, publication, monitoring, pausing, cancellation, and archiving.
- [ ] Define operating coverage during active offers and high-volume periods.
- [ ] Define budget, inventory, partner availability, and redemption monitoring.
- [ ] Define incident and rollback procedures that preserve valid customer entitlements and financial records.

### S3-OPS02 — Customer and partner support — **BLOCKS RELEASE**

- [ ] Provide support scripts for eligibility, missing offers, invalid codes, failed redemption, expired benefits, refunds, disputes, and suspected fraud.
- [ ] Define customer, partner, finance, legal, and engineering escalation paths and response times.
- [ ] Define authority and limits for goodwill adjustments or manual redemptions.
- [ ] Train staff on applicable offer terms and evidence requirements.

### S3-DATA01 — Analytics and financial reporting — **BLOCKS RELEASE**

- [ ] Approve events for offer exposure, activation, redemption attempts, outcomes, reversals, support cases, and campaign messages.
- [ ] Define conversion, incrementality, cost, margin, liability, fraud, breakage, and partner-settlement calculations.
- [ ] Define metric owners, dashboards, access, retention, reconciliation, and review cadence.
- [ ] Prevent codes, receipts, message content, sensitive pet data, and unnecessary personal data from entering analytics.

### S3-SEC01 — Authorization and auditability — **BLOCKS RELEASE**

- [ ] Define roles and permissions for campaign, support, finance, partner, and administrative users.
- [ ] Require segregation of duties for high-value changes, approvals, settlement, and manual adjustments.
- [ ] Define immutable audit evidence for offer changes, issuance, redemption, reversal, dispute, and financial adjustment.
- [ ] Define alerting for bulk code access, abnormal issuance, redemption spikes, repeated failures, and unauthorized changes.
- [ ] Complete security, privacy, fraud, and financial-control reviews.

## Release approval

### S3-REL01 — Pilot and acceptance — **BLOCKS RELEASE**

- [ ] Approve the pilot offers, audience, partners, geography, budget, duration, and maximum exposure.
- [ ] Use real, approved offers and signed partners; do not present fictional demo discounts as redeemable.
- [ ] Test eligible, ineligible, expired, exhausted, duplicate, offline, concurrent, reversed, refunded, disputed, and partner-unavailable cases.
- [ ] Test mobile accessibility, slow networks, retries, and prevention of duplicate redemption.
- [ ] Reconcile test and pilot records across product, support, partner, and finance views.

### S3-REL02 — Sign-off — **BLOCKS RELEASE**

- [ ] Product owner signs off on scope and customer experience.
- [ ] Commercial owner signs off on every offer and partner commitment.
- [ ] Finance, accounting, and tax sign off on economics, reconciliation, and reporting.
- [ ] Legal/privacy signs off on terms, marketing, contracts, data use, and disclosures.
- [ ] Engineering/security signs off on eligibility, authorization, auditability, fraud controls, and recovery.
- [ ] Support and operations sign off on staffing, procedures, and escalation.
- [ ] Executive sponsor authorizes release and maximum financial exposure.

## Required source material

- [ ] Approved promotion strategy, launch scope, and pilot plan.
- [ ] Offer specifications and economics for every launch promotion.
- [ ] Signed partner promotion agreements or addenda where applicable.
- [ ] Approved finance, accounting, tax, reconciliation, refund, and dispute procedures.
- [ ] Approved eligibility, issuance, code, redemption, fraud, and lifecycle rules.
- [ ] Approved Spanish offer copy, terms, disclosures, and messages.
- [ ] Privacy data inventory, consent rules, retention schedule, and vendor approvals.
- [ ] Support scripts, operating runbooks, monitoring, and incident procedures.
- [ ] Acceptance criteria, success and stop thresholds, and named signers.

## Decisions an AI agent must not make

An implementation agent may recommend designs and technical controls after DNAture defines the program. It must not independently:

- Invent an offer, discount percentage, coupon, code, eligibility rule, scarcity claim, or expiration date.
- Decide who funds a discount or bears tax, refund, fraud, dispute, or settlement costs.
- Determine the legal validity of offer terms or marketing consent.
- Select customers using sensitive, clinical, or unapproved inferred data.
- Represent a partner as participating without a signed approval.
- Issue, redeem, reverse, or financially adjust real benefits without approved authorization rules.
- Expand a directory relationship into a promotional relationship.
- Replace product, commercial, finance, legal, privacy, security, partner, or executive approval.

## Stage 3 ready-to-start gate

Stage 3 implementation may start only when all applicable **BLOCKS START** items are approved, the relevant Stage 1 and optional Stage 2 dependencies are production-ready, and at least one real promotion has an approved specification, owner, funding model, terms, and operating process.

Production release additionally requires every applicable **BLOCKS EACH PROMOTION**, **BLOCKS PARTNER PROMOTION**, **BLOCKS CAMPAIGN MESSAGES**, **BLOCKS RELEASE**, and **BLOCKS UI ACCEPTANCE** item to be completed and signed off.
