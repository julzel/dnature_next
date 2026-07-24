import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AvifyDiagnostics from '../../features/AvifyDiagnostics';
import { getCatalogReconciliation } from '../../features/AvifyDiagnostics/server';

vi.mock('../../features/AvifyDiagnostics/server', () => ({
  getCatalogReconciliation: vi.fn(),
}));

const report = {
  summary: {
    contentfulTotal: 93,
    avifyBaseTotal: 207,
    avifyVariantTotal: 65,
    matched: 56,
    likely: 11,
    needsReview: 26,
    avifyInternal: 47,
    avifyUnpaired: 93,
  },
  contentfulHealth: {
    missingSlug: [{ id: 'contentful-1', name: 'Vitamina E' }],
    missingImages: 0,
    missingDescription: 3,
    missingIngredients: 16,
    withPresentationPrices: 18,
  },
  avifyHealth: {
    baseStatuses: { inactive: 207 },
    variantStatuses: { active: 65 },
    missingBaseCustomSku: 22,
    missingVariantCustomSku: 24,
    zeroStockVariants: 2,
    uncategorized: 10,
  },
  categories: {
    contentful: { Snacks: 31, Suplementos: 22 },
    avify: { Suplementos: 51, 'Materia Prima': 47 },
  },
  priceDifferences: [
    {
      type: 'cross-system',
      product: 'DNAture Trucha y Búfalo',
      presentation: '200g',
      contentfulPrice: 900,
      avifyPrice: 850,
      detail: 'La misma presentación tiene precios diferentes.',
    },
  ],
  reviewItems: [
    {
      contentfulId: 'contentful-review',
      contentfulName: 'Sardinas',
      candidateName: 'Sardinas deshidratadas',
      candidateSku: 'CP-10',
      score: 0.67,
      alternativeName: 'Sardinas crudas',
      ambiguous: true,
    },
  ],
  likelyItems: [
    {
      contentfulId: 'contentful-likely',
      contentfulName: 'Galleta wild',
      avifyName: 'Galleta wild deshidratada',
      avifySku: 'CP-20',
      score: 0.8,
    },
  ],
  unpairedAvify: [],
};

describe('Avify catalog reconciliation diagnostics', () => {
  beforeEach(() => {
    getCatalogReconciliation.mockResolvedValue({
      success: true,
      code: 'CATALOG_RECONCILIATION_READY',
      report,
    });
  });

  it('renders a simplified reconciliation report', async () => {
    render(await AvifyDiagnostics());

    expect(
      screen.getByRole('heading', { name: 'Conciliación Contentful ↔ Avify' })
    ).toBeInTheDocument();
    expect(screen.getAllByText('93')).toHaveLength(2);
    expect(screen.getByText('207')).toBeInTheDocument();
    expect(screen.getByText('67')).toBeInTheDocument();
    expect(screen.getByText('26')).toBeInTheDocument();
    expect(screen.getByText('DNAture Trucha y Búfalo')).toBeInTheDocument();
    expect(screen.getByText('Sardinas')).toBeInTheDocument();
    expect(screen.getByText('Galleta wild')).toBeInTheDocument();
    expect(getCatalogReconciliation).toHaveBeenCalledOnce();
  });
});
