import { readFile } from 'node:fs/promises';
import path from 'node:path';

const DEFAULT_MAPPING = 'contentful/mappings/product-avify-skus.json';
const mappingPath = path.resolve(process.argv[2] || DEFAULT_MAPPING);
const mapping = JSON.parse(await readFile(mappingPath, 'utf8'));
const allowedStatuses = new Set([
  'exact',
  'probable',
  'review',
  'unmatched',
]);
const entryIds = new Set();
const automaticSkus = new Map();
const approvedSkus = new Map();
const suggestedSkus = new Map();
const errors = [];
const warnings = [];

if (!Array.isArray(mapping.products)) {
  throw new Error('The mapping must contain a products array.');
}

const countStatuses = () =>
  Object.fromEntries(
    [...allowedStatuses].map((status) => [
      status,
      mapping.products.filter((product) => product.matchStatus === status)
        .length,
    ])
  );

const trimString = (value) => (typeof value === 'string' ? value.trim() : '');

for (const [index, product] of mapping.products.entries()) {
  const row = index + 1;
  const entryId = trimString(product.contentfulEntryId);
  const avifySku = trimString(product.avifySku);
  const customSku = trimString(product.avifyCustomSku);

  if (!entryId) {
    errors.push(`Row ${row}: missing contentfulEntryId`);
  } else if (entryIds.has(entryId)) {
    errors.push(`Row ${row}: duplicate Contentful entry ${entryId}`);
  } else {
    entryIds.add(entryId);
  }

  if (!allowedStatuses.has(product.matchStatus)) {
    errors.push(`Row ${row}: invalid matchStatus ${product.matchStatus}`);
  }

  if (typeof product.approved !== 'boolean') {
    errors.push(`Row ${row}: approved must be a boolean`);
  }

  if (product.matchStatus === 'unmatched' && avifySku) {
    errors.push(`Row ${row}: unmatched products cannot have avifySku`);
  }

  if (
    ['exact', 'probable'].includes(product.matchStatus) &&
    !avifySku
  ) {
    errors.push(`Row ${row}: ${product.matchStatus} mapping is missing avifySku`);
  }

  if (product.approved && product.matchStatus !== 'unmatched' && !avifySku) {
    errors.push(`Row ${row}: approved mapping is missing avifySku`);
  }

  if (avifySku && customSku && avifySku === customSku) {
    errors.push(
      `Row ${row}: avifySku contains customSku instead of the generated parent SKU`
    );
  }

  if (avifySku && ['exact', 'probable'].includes(product.matchStatus)) {
    const priorRow = automaticSkus.get(avifySku);

    if (priorRow) {
      errors.push(
        `Row ${row}: generated Avify SKU ${avifySku} is also proposed on row ${priorRow}`
      );
    } else {
      automaticSkus.set(avifySku, row);
    }
  }

  if (avifySku) {
    const suggestions = suggestedSkus.get(avifySku) || [];
    suggestions.push({
      approved: product.approved,
      row,
      status: product.matchStatus,
    });
    suggestedSkus.set(avifySku, suggestions);
  }

  if (avifySku && product.approved) {
    const priorRow = approvedSkus.get(avifySku);

    if (priorRow) {
      errors.push(
        `Row ${row}: approved Avify SKU ${avifySku} is also used on row ${priorRow}`
      );
    } else {
      approvedSkus.set(avifySku, row);
    }
  }
}

for (const [avifySku, suggestions] of suggestedSkus) {
  if (suggestions.length < 2) {
    continue;
  }

  warnings.push(
    `Rows ${suggestions
      .map(({ row }) => row)
      .join(', ')} share suggestion ${avifySku}`
  );

  const automaticSuggestion = suggestions.some(({ status }) =>
    ['exact', 'probable'].includes(status)
  );
  const approvedReview = suggestions.some(
    ({ approved, status }) => approved && status === 'review'
  );

  if (automaticSuggestion && approvedReview) {
    errors.push(
      `Approved review suggestion ${avifySku} conflicts with an exact/probable row`
    );
  }
}

const expectedRows = mapping.sourceSummary?.contentfulProducts;

if (
  typeof expectedRows === 'number' &&
  mapping.products.length !== expectedRows
) {
  errors.push(
    `Expected ${expectedRows} Contentful rows, found ${mapping.products.length}`
  );
}

const statusCounts = countStatuses();

for (const [status, count] of Object.entries(statusCounts)) {
  const expected = mapping.sourceSummary?.[status];

  if (typeof expected === 'number' && expected !== count) {
    errors.push(
      `Summary says ${expected} ${status} rows, but the mapping contains ${count}`
    );
  }
}

if (warnings.length) {
  console.warn(`Warnings:\n${warnings.join('\n')}`);
}

if (errors.length) {
  console.error(`Invalid mapping:\n${errors.join('\n')}`);
  process.exitCode = 1;
} else {
  const approved = mapping.products.filter(
    (product) => product.approved && product.avifySku
  ).length;
  const proposed = mapping.products.filter(({ avifySku }) => avifySku).length;

  console.log(
    `Mapping valid: ${mapping.products.length} rows, ${proposed} proposed SKUs, ${approved} approved links.`
  );
  console.log(`Status counts: ${JSON.stringify(statusCounts)}`);
}
