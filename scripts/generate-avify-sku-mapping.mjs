import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { buildCatalogReconciliation } from '../features/AvifyDiagnostics/reconciliation.js';

const DEFAULT_INPUT = '/tmp/dnature-catalog-analysis.json';
const DEFAULT_OUTPUT = 'contentful/mappings/product-avify-skus.json';
const DEFAULT_SPACE_ID = 'vyl67gce90hn';
const DEFAULT_ENVIRONMENT_ID = 'staging';

const readArgument = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
};

const inputPath = path.resolve(readArgument('--input', DEFAULT_INPUT));
const outputPath = path.resolve(readArgument('--output', DEFAULT_OUTPUT));
const spaceId = readArgument('--space-id', DEFAULT_SPACE_ID);
const environmentId = readArgument(
  '--environment-id',
  DEFAULT_ENVIRONMENT_ID
);
const snapshot = JSON.parse(await readFile(inputPath, 'utf8'));

if (!Array.isArray(snapshot.contentful) || !Array.isArray(snapshot.avify)) {
  throw new Error(
    'The input snapshot must contain contentful and avify product arrays.'
  );
}

const report = buildCatalogReconciliation(
  snapshot.contentful,
  snapshot.avify
);
const products = report.mappingItems.map((product) => ({
  ...product,
  contentfulUrl: `https://app.contentful.com/spaces/${encodeURIComponent(
    spaceId
  )}/environments/${encodeURIComponent(
    environmentId
  )}/entries/${encodeURIComponent(product.contentfulEntryId)}`,
}));
const statusCounts = Object.fromEntries(
  ['exact', 'probable', 'review', 'unmatched'].map((status) => [
    status,
    products.filter((product) => product.matchStatus === status).length,
  ])
);
const mapping = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  sourceSnapshotGeneratedAt: snapshot.generatedAt || null,
  target: {
    spaceId,
    environmentId,
    contentTypeId: 'product',
    fieldId: 'avifySku',
  },
  sourceSummary: {
    contentfulProducts: snapshot.contentful.length,
    avifyParentProducts: snapshot.avify.length,
    avifyVariants: snapshot.avify.reduce(
      (total, product) => total + (product.variants?.length || 0),
      0
    ),
    excludedInternalAvifyProducts: report.summary.avifyInternal,
    ...statusCounts,
  },
  products,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(mapping, null, 2)}\n`);

console.log(
  JSON.stringify(
    {
      output: outputPath,
      target: mapping.target,
      rows: products.length,
      statuses: statusCounts,
      proposedSkus: products.filter(({ avifySku }) => avifySku).length,
      approved: products.filter(({ approved }) => approved).length,
    },
    null,
    2
  )
);
