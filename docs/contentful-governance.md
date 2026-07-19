# Contentful schema and slug governance

## Ownership

- **Content owner:** DNAture project owner — approves product names, category
  placement, pricing, images, availability, and any slug change.
- **Technical owner:** DNAture project owner or delegated repository maintainer
  — maintains the Contentful query shape, cache tags, sitemap behavior, and
  production verification.

## Product slug contract

`urlSlug` must be lowercase ASCII kebab case:

```text
^[a-z0-9]+(?:-[a-z0-9]+)*$
```

It must be unique across products, contain no leading/trailing whitespace, and
remain stable after publication. The application normalizes legacy input before
redirecting to the canonical URL, but Contentful must still be corrected at the
source. When a published slug changes, the content owner supplies an explicit
old-to-new redirect decision before publication.

## Publishing checklist

1. Validate the slug against the contract and duplicate it in a pre-publish
   Contentful check.
2. Provide product name, concise description/ingredients, price, category,
   presentation, and at least one image with meaningful alt/title text.
3. Confirm the product is suitable for indexing before publication. The sitemap
   reads normalized catalogue entries automatically.
4. After publishing, verify the canonical product URL, page metadata, social
   image, and sitemap entry on preview.

Product JSON-LD is intentionally deferred. The current schema does not have
approved availability, currency, SKU/GTIN, and return-policy fields needed for
reliable merchant-rich-result data. Add those fields and an owner-approved data
contract before enabling Product/Offer structured data.
