# Customer accounts production — staged product-owner requirements

**Current implementation stage:** Stage 1 — Core customer accounts  
**Primary market:** Costa Rica  
**Purpose:** Separate required business decisions so later Red Veterinaria and promotion work cannot block the core account release.

## Requirement files

| Stage | Scope | Requirement file | Current status |
| --- | --- | --- | --- |
| 1 | Authentication, customer profile, pet profiles, portion planning, saved carts, personalization, reminders, privacy, operations, and launch | [Stage 1 — Core accounts](./customer-accounts-stage-1-core-requirements.md) | Active |
| 2 | Red Veterinaria directory, partner profiles, discovery, favorites, contact requests, partner data sharing, moderation, and partner operations | [Stage 2 — Red Veterinaria](./customer-accounts-stage-2-red-veterinaria-requirements.md) | Deferred |
| 3 | Promotions, discounts, eligibility, funding, redemption, fraud controls, reconciliation, and promotional terms | [Stage 3 — Promotions and discounts](./customer-accounts-stage-3-promotions-requirements.md) | Deferred |

## Scope boundary

Stage 1 must not depend on decisions, contracts, data, operations, or interfaces from Stages 2 or 3.

Therefore, Stage 1 production must exclude:

- Red Veterinaria navigation, directory, partner profiles, services, locations, schedules, maps, favorites, contact requests, and partner-data sharing.
- Partner administration, verification, moderation, contact routing, service levels, contracts, and clinical responsibility for partner services.
- Promotional benefits, discounts, codes, eligibility indicators, redemption, campaign messaging, and promotional analytics.
- Any recommendation, reminder, analytics event, customer consent, or profile field whose only purpose is Red Veterinaria or promotions.

The accepted demo may retain these modules for stakeholder reference, but production Stage 1 must keep them behind a disabled feature flag or exclude them from the production bundle/navigation. Fictional partner and promotion data must never be published as real data.

## Dependency rules

- Stage 1 can begin when the Stage 1 ready-to-start definition is satisfied.
- Unresolved Stage 2 or Stage 3 requirements do not block Stage 1.
- Stage 2 assumes the core identity, profile, authorization, privacy, and operational foundations from Stage 1 are production-ready.
- Stage 3 is a separate commercial release. It must not be silently bundled into Stage 2.
- If a future decision crosses stages, record it in every affected stage and identify which stage owns the authoritative decision.

## How decisions are recorded

For each requirement, record:

- **Decision:** The exact approved behavior or policy.
- **Decision owner:** A named person, not only a department.
- **Approver:** The person with authority to approve the decision.
- **Evidence:** Link to approved copy, policy, contract, design, spreadsheet, or meeting record.
- **Target date:** When unresolved items will be closed.

Allowed statuses: `Open`, `In review`, `Approved`, `Rejected`, `Deferred with approved exclusion`.

“Use best judgment” is not sufficient for legal terms, clinical guidance, customer-data use, consent, retention, commercial commitments, discounts, or support promises.

## Established across all stages

- [x] The stakeholder demo is accepted as a product reference for production development.
- [x] The experience is for DNAture customers; staff and partner administration require separate authorization and scope.
- [x] Customer-facing content is in Costa Rican Spanish (`es-CR`).
- [x] Mobile is the primary customer experience.
- [x] Resend is the selected outbound email/SMTP service.
- [x] Demo `localStorage` records are not production data and will not be migrated.
- [x] Demo partners, schedules, codes, benefits, availability, and promotions are fictional.

## Decision register template

| Decision ID | Status | Decision owner | Approver | Approved decision | Evidence/link | Target date |
| --- | --- | --- | --- | --- | --- | --- |
| Example: S1-AUTH01 | Open | Name | Name | Pending | Pending | YYYY-MM-DD |

