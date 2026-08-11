# Avify integration roadmap

Status legend: `[x]` implemented, `[ ]` pending, `[~]` partially complete.

## Phase 1 — Vendor and account confirmation

- [ ] Receive a sandbox account and token.
- [ ] Confirm that `api.avify.com/graphql` is the supported production endpoint.
- [ ] Confirm sellability rules for inactive parents and active children.
- [ ] Confirm exact configurable-product attributes and variant identifiers.
- [ ] Obtain rate limits and retry/error classification.
- [ ] Obtain idempotency guarantees for cart and `createOrder` mutations.
- [ ] Confirm the representation of DNAture’s ₡3,500 delivery fee.
- [ ] Obtain webhook authentication, retries, duplicates and ordering rules.
- [ ] Confirm token rotation and whether least-privilege scopes exist.
- [ ] Complete production location 1815 and validate its address.
- [ ] Resolve Avify tax configuration (currently 0; DNAture requires 13 % IVA).
- [ ] Approve payment methods, sales channel and initial order status.

## Phase 2 — Stabilize catalogue reads

- [x] Fix pagination and reject incomplete catalog snapshots.
- [x] Query mapped SKU values in bounded batches.
- [x] Add tax, reserved stock, `onDemand`, variant attributes and option values.
- [x] Apply location 1815 to inventory reads.
- [x] Use persisted Contentful parent-SKU mappings in diagnostics.
- [x] Use Avify price and stock for simple products and exact variants.
- [x] Recheck current price and availability before checkout and saved-cart restore.
- [x] Fail closed at checkout when Avify cannot validate mapped products.
- [x] Preserve parent and child Avify identity in the active cart.
- [x] Add unit coverage for pricing, inventory, ambiguity and failure modes.
- [~] Replace every presentation fallback with an approved child relationship.
- [ ] Add repeatable live contract tests against sandbox.
- [ ] Add monitoring and alerting for Avify read failures and broken mappings.

## Phase 3 — Authoritative Avify cart and totals

- [ ] Implement server-only reads for locations and payment methods.
- [ ] Implement sandbox-only mutations for `addCartProduct` and
  `updateCartProduct`.
- [ ] Preserve `cartId` and `sessionCookie` on the server.
- [ ] Use `cartTotals` as the final commercial total.
- [ ] Reconcile delivery fee, discount and 13 % IVA with Avify totals.
- [ ] Add idempotency, timeouts, retry policy and structured monitoring.

## Phase 4 — Pending orders

- [ ] Implement `createOrder` only in sandbox first.
- [ ] Supply approved customer, shipping, payment, cart, location and channel.
- [ ] Create an order as pending; never mark it paid or confirmed automatically.
- [ ] Store Avify order ID and a safe local reference.
- [ ] Provide customer recovery for timeout and unknown-result cases.

## Phase 5 — Synchronization and pilot

- [ ] Add an authenticated webhook endpoint.
- [ ] Deduplicate events and tolerate out-of-order delivery.
- [ ] Add periodic reconciliation for missed webhooks.
- [ ] Track latency, failures, duplicate attempts, stock rejection and total mismatches.
- [ ] Pilot with synthetic orders and staff before real customers.

See [the human guide](../integrations/avify-guide.md) and
[the technical implementation](../integrations/avify-storefront.md).
