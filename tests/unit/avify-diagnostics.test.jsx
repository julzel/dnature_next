import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import AvifyDiagnostics from '../../features/AvifyDiagnostics';
import { listAvifyProducts } from '../../services/avify';

vi.mock('../../services/avify', () => ({
  listAvifyProducts: vi.fn(),
}));

describe('Avify diagnostics', () => {
  beforeEach(() => {
    listAvifyProducts.mockResolvedValue({
      success: true,
      code: 'AVIFY_PRODUCTS_LOADED',
      message: 'Products loaded.',
      status: 200,
      products: [
        {
          id: 42,
          name: 'Alimento natural',
          sku: 'DOG-FOOD-01',
          price: 20,
          quantity: 8,
          status: 'ENABLED',
          variantCount: 1,
        },
      ],
      pageSize: 10,
      totalCount: 1,
    });
  });

  it('renders safe product summaries using one GraphQL request', async () => {
    render(await AvifyDiagnostics());

    expect(
      screen.getByRole('heading', { name: 'Pruebas de integración con Avify' })
    ).toBeInTheDocument();
    expect(screen.getByText('Alimento natural')).toBeInTheDocument();
    expect(screen.getByText('DOG-FOOD-01')).toBeInTheDocument();
    expect(screen.getByText(/Se recibieron 1 de 1 productos/)).toBeInTheDocument();
    expect(listAvifyProducts).toHaveBeenCalledOnce();
    expect(listAvifyProducts).toHaveBeenCalledWith({
      pageNum: 1,
      pageSize: 10,
    });
  });
});
