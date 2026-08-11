import { describe, expect, it } from 'vitest';

import {
  buildCatalogReconciliation,
  canonicalName,
  isInternalAvifyProduct,
  normalizePresentation,
} from '../../features/AvifyDiagnostics/reconciliation';

const contentfulProduct = (overrides) => ({
  id: 'contentful',
  name: 'Product',
  slug: 'product',
  category: 'Recetas',
  measure: '500g',
  price: 1000,
  unitPrices: null,
  hasImage: true,
  hasDescription: true,
  hasIngredients: true,
  ...overrides,
});

const avifyProduct = (overrides) => ({
  id: 'avify',
  sku: 'generated-sku',
  customSku: 'CP-1',
  name: 'Product',
  slug: 'generated-sku',
  status: 'inactive',
  type: 'simple',
  price: 1000,
  quantity: 5,
  categories: [{ id: 1, label: 'Recetas' }],
  variantCount: 0,
  variants: [],
  ...overrides,
});

describe('catalog reconciliation', () => {
  it('normalizes brand words, connectors, accents, and presentations', () => {
    expect(canonicalName('DNAture Pollo y Búfalo')).toBe(
      canonicalName('DNA Pollo Bufalo')
    );
    expect(normalizePresentation('0.5kg')).toBe('500g');
    expect(normalizePresentation('1k')).toBe('1000g');
  });

  it('keeps Materia Prima products out of public matching candidates', () => {
    expect(
      isInternalAvifyProduct(
        avifyProduct({
          name: 'MP Pulmón',
          categories: [{ id: 2, label: 'Materia Prima' }],
        })
      )
    ).toBe(true);
  });

  it('classifies exact, likely, and ambiguous matches conservatively', () => {
    const contentful = [
      contentfulProduct({
        id: 'exact',
        name: 'DNAture Pollo y Búfalo',
        slug: 'dnature-pollo-y-bufalo',
        price: 3700,
        unitPrices: { '1kg': '3700', '200g': '900' },
      }),
      contentfulProduct({
        id: 'likely',
        name: 'Galleta wild',
        slug: 'galleta-wild',
      }),
      contentfulProduct({
        id: 'review',
        name: 'Sardinas',
        slug: 'sardinas',
      }),
      contentfulProduct({
        id: 'missing-slug',
        name: 'Vitamina E',
        slug: null,
      }),
      contentfulProduct({
        id: 'no-candidate',
        name: 'Callostrum',
        slug: 'callostrum',
      }),
    ];
    const avify = [
      avifyProduct({
        id: 'exact-avify',
        name: 'DNAture Pollo Bufalo',
        customSku: 'CP-EXACT',
        price: 2000,
        type: 'configurable',
        variants: [
          {
            id: '1kg',
            name: '1k',
            price: 3700,
            status: 'active',
            quantity: 4,
          },
          {
            id: '200g',
            name: '200g',
            price: 850,
            status: 'active',
            quantity: 3,
          },
        ],
        variantCount: 2,
      }),
      avifyProduct({
        id: 'likely-avify',
        name: 'Galleta wild deshidratada',
        customSku: 'CP-LIKELY',
      }),
      avifyProduct({
        id: 'sardina-raw',
        name: 'Sardinas crudas',
        customSku: 'CP-RAW',
      }),
      avifyProduct({
        id: 'sardina-dried',
        name: 'Sardinas deshidratadas',
        customSku: 'CP-DRIED',
      }),
      avifyProduct({
        id: 'vitamin',
        name: 'Vitamina E',
        customSku: 'CP-VITAMIN',
      }),
      avifyProduct({
        id: 'internal',
        name: 'MP Pulmón',
        categories: [{ id: 2, label: 'Materia Prima' }],
      }),
    ];

    const report = buildCatalogReconciliation(contentful, avify);

    expect(report.summary).toMatchObject({
      matched: 2,
      likely: 1,
      needsReview: 2,
      avifyInternal: 1,
    });
    expect(report.reviewItems[0]).toMatchObject({
      contentfulName: 'Sardinas',
      ambiguous: true,
    });
    expect(report.contentfulHealth.missingSlug).toEqual([
      { id: 'missing-slug', name: 'Vitamina E' },
    ]);
    expect(report.reviewItems).toContainEqual(
      expect.objectContaining({
        contentfulName: 'Callostrum',
        candidateName: null,
        candidateSku: null,
        candidateGeneratedSku: null,
        candidateAlreadyPaired: false,
        ambiguous: false,
      })
    );
    expect(report.mappingItems).toHaveLength(contentful.length);
    expect(report.mappingItems).toContainEqual(
      expect.objectContaining({
        contentfulEntryId: 'exact',
        avifySku: 'generated-sku',
        avifyCustomSku: 'CP-EXACT',
        matchStatus: 'exact',
        approved: false,
      })
    );
    expect(report.mappingItems).toContainEqual(
      expect.objectContaining({
        contentfulEntryId: 'likely',
        avifySku: 'generated-sku',
        avifyCustomSku: 'CP-LIKELY',
        matchStatus: 'probable',
        approved: false,
      })
    );
    expect(report.mappingItems).toContainEqual(
      expect.objectContaining({
        contentfulEntryId: 'no-candidate',
        avifySku: null,
        matchStatus: 'review',
        approved: false,
      })
    );
    expect(report.priceDifferences).toEqual([
      expect.objectContaining({
        type: 'cross-system',
        product: 'DNAture Pollo y Búfalo',
        presentation: '200g',
        contentfulPrice: 900,
        avifyPrice: 850,
      }),
    ]);
  });

  it('uses the persisted parent SKU before attempting name matching', () => {
    const report = buildCatalogReconciliation(
      [
        contentfulProduct({
          id: 'persisted',
          name: 'Nombre editorial distinto',
          slug: 'nombre-editorial-distinto',
          avifySku: 'RIGHT-PARENT-SKU',
        }),
      ],
      [
        avifyProduct({
          id: 'right',
          sku: 'RIGHT-PARENT-SKU',
          name: 'Nombre operativo de Avify',
        }),
        avifyProduct({
          id: 'wrong',
          sku: 'WRONG-PARENT-SKU',
          name: 'Nombre editorial distinto',
        }),
      ]
    );

    expect(report.summary).toMatchObject({
      matched: 1,
      persistedMappings: 1,
      brokenPersistedMappings: 0,
    });
    expect(report.mappingItems[0]).toMatchObject({
      avifySku: 'RIGHT-PARENT-SKU',
      approved: true,
    });
  });

  it('flags a persisted SKU that Avify no longer returns', () => {
    const report = buildCatalogReconciliation(
      [
        contentfulProduct({
          id: 'missing-link',
          avifySku: 'MISSING-PARENT-SKU',
        }),
      ],
      [avifyProduct({ sku: 'OTHER-SKU' })]
    );

    expect(report.summary).toMatchObject({
      needsReview: 1,
      persistedMappings: 0,
      brokenPersistedMappings: 1,
    });
    expect(report.reviewItems[0]).toMatchObject({
      contentfulId: 'missing-link',
      candidateName: null,
      persistedSkuMissing: 'MISSING-PARENT-SKU',
    });
  });
});
