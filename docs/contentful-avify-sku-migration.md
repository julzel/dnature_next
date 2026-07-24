# Contentful–Avify SKU migration

This runbook adds an `avifySku` field to Contentful products and backfills it
from an approved Contentful-to-Avify mapping. Both changes are implemented as
versioned JavaScript migrations and are tested in the existing `staging`
environment before being applied to `master`.

## Scope and safety rules

- Contentful space: `vyl67gce90hn`
- Test environment: `staging`
- Production environment/alias: `master`
- Product content-type ID: expected to be `product`; confirm this in Contentful
  before running the first migration.
- `avifySku` stores the generated SKU of the **Avify parent product**, never a
  presentation/variant SKU or `customSku`.
- The field starts optional. A Contentful entry without an approved Avify match
  remains valid.
- Never run a migration against `master` until the same migration and mapping
  have succeeded in `staging`.
- Never commit a Contentful Management API token.

## Readiness snapshot — July 24, 2026

| Prerequisite | Status | Evidence/action |
| --- | --- | --- |
| Supported Node.js | Ready | Local Node.js is `v24.15.0`; the project and CLI support Node 24. |
| Repository CLI | Ready | `contentful-cli@4.0.5` is installed as a development dependency. |
| Contentful space ID | Ready | `.env.local` contains the configured space ID. |
| Delivery API access | Ready | Read-only GraphQL checks succeeded for both `master` and `staging`. |
| Master catalog | Ready | The delivery API reports 93 published products. |
| Staging catalog | Ready | The previous environment was backed up and staging was recreated from master; both environments report 93 published products. |
| Management authentication | Ready | A fresh CLI login can list both `master` and `staging`. |
| Staging aliases | Ready | Contentful reports no environment aliases. |
| Staging webhooks | Ready | Contentful reports no webhook definitions in the space. |
| Staging schema migration | Complete | `avifySku` is published on the staging `product` content type as optional, non-localized, unique short text. |
| Master schema migration | Not started | `master` remains unchanged and has no `avifySku` field. |
| Mapping proposal | Ready for review | A fresh 93-row proposal contains 56 exact, 11 probable, and 26 review rows. Six review suggestions conflict with stronger rows; all rows are deliberately unapproved. |
| Product data backfill | Not started | No Contentful product entry has been assigned an Avify SKU. |

All prerequisite checks are now resolved. The schema migration has succeeded in
staging; no backfill migration has been run and `master` remains unchanged.

The pre-refresh staging backup is stored locally at
`backups/contentful/staging-before-avify-2026-07-24.json`. The backup directory
is ignored by Git.

Contentful recommends testing content-model changes in a separate environment.
Reusing the existing unused `staging` environment is appropriate for the free
tier, as long as it is not connected to an active application, webhook, or
environment alias:

- <https://www.contentful.com/developers/docs/tutorials/general/create-and-deploy-content-type-changes/>
- <https://www.contentful.com/developers/docs/tutorials/cli/environment-management/>

## 1. Prerequisites

Install the Contentful CLI as a development dependency so every developer and
CI job uses a repository-controlled version:

```bash
npm install --save-dev contentful-cli
```

Authenticate interactively:

```bash
npx contentful login
```

After a new login, verify access with:

```bash
npx contentful space environment list \
  --space-id "$CONTENTFUL_SPACE_ID"

npx contentful space environment-alias list \
  --space-id "$CONTENTFUL_SPACE_ID"
```

Both commands must succeed before staging is refreshed.

For non-interactive execution, create a Contentful Management API token with
permission to edit the content model and product entries. Keep it in the local
environment:

```text
CONTENTFUL_MANAGEMENT_TOKEN=...
CONTENTFUL_SPACE_ID=vyl67gce90hn
```

The existing `CONTENTFUL_DELIVERY_API_KEY` is read-only and cannot execute
migrations.

Confirm the environments:

```bash
npx contentful space environment list \
  --space-id "$CONTENTFUL_SPACE_ID"
```

Confirm that `staging` is not used by any application or editor. Do not delete
or recreate it until that has been verified.

## 2. Refresh staging when necessary

The safest test environment is a recent clone of `master`. If the existing
`staging` content and model are already current, keep it and continue to the
next step.

If it is stale, first export a backup:

```bash
mkdir -p backups/contentful

npx contentful space export \
  --space-id "$CONTENTFUL_SPACE_ID" \
  --environment-id staging \
  --include-drafts \
  --content-file backups/contentful/staging-before-avify.json
```

The export may contain business content and must not be committed.

After confirming that the backup exists and `staging` is unused, recreate it
from `master`:

```bash
npx contentful space environment delete \
  --space-id "$CONTENTFUL_SPACE_ID" \
  --environment-id staging

npx contentful space environment create \
  --space-id "$CONTENTFUL_SPACE_ID" \
  --environment-id staging \
  --name "Staging" \
  --source master
```

Environment deletion is destructive. Run these commands only after manually
checking the target environment ID and backup.

## 3. Repository structure

Keep the migration code and approved mapping separate:

```text
contentful/
├── mappings/
│   └── product-avify-skus.json
└── migrations/
    ├── 001-add-avify-sku.js
    └── 002-backfill-avify-skus.js
scripts/
└── validate-avify-sku-mapping.mjs
```

Migration files are committed. The mapping can be committed only if the team is
comfortable storing product IDs and SKUs in the repository. It must never
contain API tokens.

## 4. Schema migration

Create `contentful/migrations/001-add-avify-sku.js`:

```js
module.exports = function addAvifySku(migration) {
  const product = migration.editContentType('product');

  product
    .createField('avifySku')
    .name('Avify parent SKU')
    .type('Symbol')
    .localized(false)
    .required(false)
    .validations([{ unique: true }]);

  product.changeFieldControl('avifySku', 'builtin', 'singleLine', {
    helpText:
      'Generated SKU of the parent product in Avify. Do not use customSku or a variant SKU.',
  });
};
```

Before running it, confirm that `product` is the API identifier shown under the
Contentful product content type. The generated GraphQL collection name
`productCollection` strongly suggests this ID, but the Contentful model is the
source of truth.

Run the schema migration in `staging`:

```bash
npx contentful space migration \
  --space-id "$CONTENTFUL_SPACE_ID" \
  --environment-id staging \
  contentful/migrations/001-add-avify-sku.js
```

Do not pass `--yes` during the first execution. Inspect the migration plan
before approving it.

Verify in the Contentful web app:

1. Open the product content type in `staging`.
2. Confirm that `avifySku` is short text, not localized, optional, and unique.
3. Confirm that existing product entries still open without validation errors.

The migration DSL is documented in the official `contentful-migration`
package:

<https://www.npmjs.com/package/contentful-migration>

## 5. Prepare the approved mapping

Generate one mapping covering all Contentful products, not only the products
currently classified as “review”. The repository generator reads the catalog
research snapshot, applies the same conservative matching rules as
`/avify-test`, and writes
`contentful/mappings/product-avify-skus.json`:

```bash
npm run contentful:mapping:generate -- \
  --input /tmp/dnature-catalog-analysis.json \
  --environment-id staging
```

The generated proposal has this shape:

```json
{
  "generatedAt": "2026-07-24T00:00:00.000Z",
  "products": [
    {
      "contentfulEntryId": "CONTENTFUL_ENTRY_ID",
      "contentfulName": "DNAture product",
      "avifySku": "AVIFY_GENERATED_PARENT_SKU",
      "avifyCustomSku": "CP00",
      "avifyName": "Avify product",
      "matchStatus": "exact",
      "approved": false
    }
  ]
}
```

Allowed `matchStatus` values:

- `exact`
- `probable`
- `review`
- `unmatched`

Only rows with `approved: true` and a non-empty `avifySku` are written.
`unmatched` rows remain in the file as explicit decisions but must not contain
an `avifySku`.

The mapping must use Contentful entry IDs rather than product names or slugs.
Names remain useful for review but are not stable join keys.

## 6. Validate the mapping before migration

Run it before every backfill:

```bash
npm run contentful:mapping:validate
```

This validation is local and makes no Contentful changes. It checks the row
count and status totals, unique Contentful entry IDs, generated-vs-custom SKU
separation, required SKUs for exact/probable rows, and duplicate proposed or
approved links.

The July 24 proposal currently validates with 93 rows and 91 suggested SKUs,
but zero approved links. Six review suggestions reuse a parent SKU already
proposed for an exact/probable row and are emitted as warnings. It is therefore
safe to inspect but would write nothing if the backfill migration were run now.

## 7. Data backfill migration

Create `contentful/migrations/002-backfill-avify-skus.js`:

```js
const mapping = require('../mappings/product-avify-skus.json');

const approvedMappings = new Map(
  mapping.products
    .filter((product) => product.approved && product.avifySku)
    .map((product) => [
      product.contentfulEntryId.trim(),
      product.avifySku.trim(),
    ])
);

module.exports = async function backfillAvifySkus(
  migration,
  { makeRequest }
) {
  const locales = await makeRequest({
    method: 'GET',
    url: '/locales',
  });
  const defaultLocale = locales.items.find((locale) => locale.default)?.code;

  if (!defaultLocale) {
    throw new Error('Contentful default locale could not be determined.');
  }

  migration.transformEntries({
    contentType: 'product',
    from: ['productName', 'avifySku'],
    to: ['avifySku'],
    shouldPublish: 'preserve',
    transformEntryForLocale(fromFields, currentLocale, { id }) {
      if (currentLocale !== defaultLocale) {
        return undefined;
      }

      const approvedSku = approvedMappings.get(id);

      if (!approvedSku) {
        return undefined;
      }

      const existingSku = fromFields.avifySku?.[currentLocale]?.trim();

      if (existingSku && existingSku !== approvedSku) {
        throw new Error(
          `Entry ${id} already has a different avifySku: ${existingSku}`
        );
      }

      if (existingSku === approvedSku) {
        return undefined;
      }

      return { avifySku: approvedSku };
    },
  });
};
```

Important behavior:

- The entry ID passed to `transformEntryForLocale` selects the mapping.
- Unapproved and unmatched entries are left untouched.
- Existing conflicting values stop the migration instead of being overwritten.
- `shouldPublish: 'preserve'` keeps published entries published and draft
  entries in draft state.
- Because `avifySku` is not localized, the migration writes only to the
  environment’s default locale.

Contentful migrations are not transactional: a failure can occur after earlier
entries were updated. The local validation, conflict guard, current staging
clone, and pre-production export are therefore required rather than optional.

Run the validator and backfill against `staging`:

```bash
node scripts/validate-avify-sku-mapping.mjs

npx contentful space migration \
  --space-id "$CONTENTFUL_SPACE_ID" \
  --environment-id staging \
  contentful/migrations/002-backfill-avify-skus.js
```

## 8. Verify staging

Verify all of the following before touching `master`:

1. The number of populated `avifySku` fields equals the approved mapping count.
2. No two Contentful products have the same `avifySku`.
3. Every populated SKU resolves to exactly one Avify parent product.
4. No `avifySku` equals a child/variant SKU.
5. The 56 exact matches are correct.
6. The 11 probable matches have been approved by a person.
7. The 26 review matches are either approved or explicitly unmatched.
8. Published/draft state was preserved.
9. Product names, slugs, images, descriptions, and other fields were not
   changed.

### Select the staging application environment

The application supports an optional server-only environment setting. Before
using `/avify-test` to verify staging, set:

```text
CONTENTFUL_ENVIRONMENT_ID=staging
```

The Contentful GraphQL client and Contentful entry links will then use:

```text
https://graphql.contentful.com/content/v1/spaces/{spaceId}/environments/{environmentId}
```

If the variable is absent, the application safely defaults to `master`. Restart
the development server after changing it and confirm that the Contentful links
on `/avify-test` contain `/environments/staging/`.

## 9. Apply to master

Take a fresh master export before production changes:

```bash
npx contentful space export \
  --space-id "$CONTENTFUL_SPACE_ID" \
  --environment-id master \
  --include-drafts \
  --content-file backups/contentful/master-before-avify.json
```

Re-run local mapping validation, then apply the same committed migrations and
mapping:

```bash
node scripts/validate-avify-sku-mapping.mjs

npx contentful space migration \
  --space-id "$CONTENTFUL_SPACE_ID" \
  --environment-id master \
  contentful/migrations/001-add-avify-sku.js

npx contentful space migration \
  --space-id "$CONTENTFUL_SPACE_ID" \
  --environment-id master \
  contentful/migrations/002-backfill-avify-skus.js
```

Do not regenerate or edit the mapping between the successful staging run and
the master run. If a correction is necessary, update the mapping, repeat the
staging migration on a fresh staging clone, and verify again.

## 10. Post-migration application rollout

Deploy the application integration in compatibility mode:

```text
Contentful product has avifySku
  -> Contentful owns editorial and multimedia fields
  -> Avify owns price, variants, inventory, and availability

Contentful product has no avifySku
  -> keep the current Contentful-only behavior
  -> log the missing mapping for follow-up
```

Do not remove Contentful sales fields during this migration. Remove or stop
using them only after the Avify-backed catalog has been verified in production.

## Recovery

- If staging fails, discard or refresh `staging`; `master` remains unchanged.
- If the schema migration succeeds but the backfill fails, leave the optional
  field in place, correct the mapping, refresh staging, and retry.
- If a master value is wrong, correct that row in the mapping and run a new,
  narrowly scoped corrective migration. Do not silently overwrite conflicting
  values in the original migration.
- Keep the pre-migration master export until the Avify integration has been
  stable in production.

## Official references

- Contentful CLI:
  <https://www.contentful.com/developers/docs/tools/cli/>
- Contentful migration DSL:
  <https://www.npmjs.com/package/contentful-migration>
- Import and export:
  <https://www.contentful.com/developers/docs/tutorials/cli/import-and-export/>
- Environment workflow:
  <https://www.contentful.com/developers/docs/tutorials/general/create-and-deploy-content-type-changes/>
