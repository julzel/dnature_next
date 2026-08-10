# Contentful–Avify SKU contract

## Current state

The `product` content type in the Contentful `staging` and `master`
environments has an optional, non-localized and unique `avifySku` field. The
completed backfill links 92 of 93 Contentful products to approved Avify parent
products. The remaining product stays intentionally unmapped until a person
approves an exact match.

The authoritative implementation artifacts are:

```text
contentful/migrations/001-add-avify-sku.js
contentful/migrations/002-backfill-avify-skus.js
contentful/migrations/003-make-category-test-optional.js
contentful/mappings/product-avify-skus.json
scripts/validate-avify-sku-mapping.mjs
```

Do not reproduce the product mapping in documentation. The versioned JSON file
is the source of truth for entry IDs, approval state and SKU values.

## Data ownership contract

- `avifySku` stores the generated SKU of an Avify parent product.
- It must never store `customSku` or a presentation/variant SKU.
- Contentful owns editorial copy, slugs, images and merchandising content.
- Avify owns current price, presentations, inventory and availability.
- A product without an approved mapping remains valid and uses the supported
  Contentful-only fallback.
- Entry IDs are the stable join key during migration; names and slugs are not.

## Safety rules for future changes

1. Never commit a Contentful Management API token or a content export.
2. Validate the mapping before every data migration:

   ```bash
   npm run contentful:mapping:validate
   ```

3. Apply and verify every correction in `staging` before applying the same
   committed migration and mapping to `master`.
4. Confirm that `staging` is not connected to an active application, webhook or
   environment alias before refreshing or deleting it.
5. Export the target environment immediately before a destructive refresh or
   production data migration. Store the export outside Git.
6. Inspect the Contentful migration plan interactively on its first run. Do not
   add `--yes` until the exact plan has already been reviewed.
7. Treat migrations as non-transactional: a failed run may have updated earlier
   entries.
8. Never overwrite a conflicting production value silently. Create a narrowly
   scoped corrective migration and repeat the staging verification.

## Verification checklist

Before promoting a mapping change, verify that:

- the number of populated fields equals the approved mapping count;
- every populated SKU is unique and resolves to exactly one Avify parent;
- no populated SKU belongs to a child variant or equals a `customSku`;
- unapproved and unmatched rows were not modified;
- product copy, slug, media and publication state remain unchanged; and
- `/avify-test/` shows the expected reconciliation while running locally
  against the intended Contentful environment.

Set `CONTENTFUL_ENVIRONMENT_ID=staging` only in the local or staging runtime
used for verification. If absent, the application defaults to `master`.

## Recovery

- A failed staging change can be corrected on a fresh clone of `master`.
- If an optional schema field exists but its backfill fails, leave the field in
  place, fix the mapping and retry in staging.
- Correct an incorrect master value through a new versioned migration.
- Keep the pre-change master export until the integration has been verified in
  production.

## References

- [Contentful CLI](https://www.contentful.com/developers/docs/tools/cli/)
- [Contentful migration DSL](https://www.npmjs.com/package/contentful-migration)
- [Content import and export](https://www.contentful.com/developers/docs/tutorials/cli/import-and-export/)
- [Contentful environment workflow](https://www.contentful.com/developers/docs/tutorials/general/create-and-deploy-content-type-changes/)
