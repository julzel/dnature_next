import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getCatalogReconciliation } from '../../features/AvifyDiagnostics/server';
import { buildCatalogReconciliation } from '../../features/AvifyDiagnostics/reconciliation';
import { listAllAvifyProducts } from '../../services/avify';
import { fetchFromContentful } from '../../services/contentful';

vi.mock('../../features/AvifyDiagnostics/reconciliation', () => ({
  buildCatalogReconciliation: vi.fn(),
}));
vi.mock('../../services/avify', () => ({
  listAllAvifyProducts: vi.fn(),
}));
vi.mock('../../services/contentful', () => ({
  fetchFromContentful: vi.fn(),
}));

const originalContentfulSpaceId = process.env.CONTENTFUL_SPACE_ID;

describe('Avify diagnostics server orchestration', () => {
  beforeEach(() => {
    process.env.CONTENTFUL_SPACE_ID = 'test-space';
    fetchFromContentful.mockResolvedValue({
      productCollection: {
        total: 0,
        items: [],
      },
    });
    listAllAvifyProducts.mockResolvedValue({
      success: true,
      products: [],
    });
    buildCatalogReconciliation.mockReturnValue({
      reviewItems: [
        {
          contentfulId: 'entry-id',
          contentfulName: 'Sardinas',
        },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();

    if (originalContentfulSpaceId === undefined) {
      delete process.env.CONTENTFUL_SPACE_ID;
    } else {
      process.env.CONTENTFUL_SPACE_ID = originalContentfulSpaceId;
    }
  });

  it('adds a direct Contentful URL to each review item', async () => {
    const result = await getCatalogReconciliation();

    expect(result.success).toBe(true);
    expect(result.report.reviewItems[0]).toMatchObject({
      contentfulId: 'entry-id',
      contentfulUrl:
        'https://app.contentful.com/spaces/test-space/environments/master/entries/entry-id',
    });
  });
});
