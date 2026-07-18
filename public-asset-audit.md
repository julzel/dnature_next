# Public asset cleanup audit

- **Static audit refreshed:** 2026-07-18
- **Required production-log window:** at least 30 consecutive days
- **Current access-log evidence:** not available in this workspace
- **Verified orphan assets:** 0

## Current inventory

The repeatable static scan found 94 site files totaling 119.1 MiB. Two ignored
local `.DS_Store` files were excluded from the site inventory. Of the actual
site files:

- 22 are referenced by runtime source or are required operational outputs;
- 72 are source-unreferenced candidates totaling 85.4 MiB;
- none of those 72 candidates is approved for deletion without production/CDN
  request evidence.

The candidate count differs from the roadmap's original count of 70 because
the application changed after that audit, including removal of the Blog route.
The current script is the canonical inventory source.

## Reproduce the static scan

```bash
npm run audit:public-assets -- \
  --output /tmp/dnature-public-asset-audit.json
```

The report distinguishes:

- runtime-referenced and operational assets;
- source-unreferenced candidates;
- repository metadata such as `.DS_Store`;
- candidates observed in supplied logs;
- verified orphans, but only when a sufficient log window is declared.

## Complete the production evidence gate

Export at least 30 consecutive days of production and CDN access logs. The
window must include requests served from every hostname that can deliver
`public/` URLs. Then run:

```bash
npm run audit:public-assets -- \
  --access-log /path/to/production-access.log \
  --coverage-days 30 \
  --output /tmp/dnature-public-asset-audit-with-logs.json
```

Repeat `--access-log` for multiple files. The scan is intentionally
conservative: any candidate URL found in any supplied log is retained.

Review the resulting `verifiedOrphans.assets` list before deletion. Access-log
coverage is a human assertion because hosting exports vary and the script
cannot prove that an export includes every production/CDN request.

## Deletion and verification procedure

Delete only the reviewed `verifiedOrphans.assets` set in an isolated change.
Record the before/after byte totals from the audit reports, then run:

```bash
npm run lint
npm test
npm run build
npm run test:e2e
npm run verify:production -- \
  --base-url https://staging.example.com \
  --product-url /productos/a-current-product/
```

The production verifier checks protected routes, metadata, canonical URLs,
robots/sitemaps, and now confirms that favicon and Open Graph/Twitter image
URLs return actual image responses.
