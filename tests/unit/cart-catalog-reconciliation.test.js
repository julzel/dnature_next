import { describe, expect, it } from 'vitest';

import {
  MAX_CHECKOUT_ITEMS,
  flattenCatalog,
  reconcileCartItems,
} from '../../features/Cart/lib/catalog-reconciliation';

const catalog = {
  recipes: {
    products: [
      {
        sys: { id: 'recipe-1' },
        avifySku: 'REC-1',
        productName: 'Receta completa',
        preciosPorUnidad: {
          '500 g': 3500,
          '1 kg': 6500,
        },
        images: [{ url: '/images/recipe.jpg' }],
      },
    ],
  },
  snacks: {
    products: [
      {
        sys: { id: 'snack-1' },
        avifySku: 'SNACK-1',
        productName: 'Snack natural',
        medida: '100 g',
        precio: 2500,
        images: [],
      },
    ],
  },
};

describe('checkout catalog reconciliation', () => {
  it('flattens category groups without changing their product order', () => {
    expect(flattenCatalog(catalog).map(({ sys }) => sys.id)).toEqual([
      'recipe-1',
      'snack-1',
    ]);
  });

  it('uses current catalog identity, copy, image, and presentation price', () => {
    const result = reconcileCartItems(
      [
        {
          id: 'stale-cart-key',
          catalogProductId: 'recipe-1',
          sku: 'OLD-SKU',
          productName: 'Nombre anterior',
          presentation: '1 kg',
          quantity: 2,
          price: 6000,
        },
      ],
      catalog
    );

    expect(result).toEqual({
      items: [
        {
          id: 'recipe-1-1 kg',
          catalogProductId: 'recipe-1',
          sku: 'REC-1',
          productName: 'Receta completa 1 kg',
          presentation: '1 kg',
          quantity: 2,
          price: 6500,
          image: '/images/recipe.jpg',
        },
      ],
      removedCount: 0,
      updatedPriceCount: 1,
    });
  });

  it('falls back to SKU and keeps an unchanged published price', () => {
    const result = reconcileCartItems(
      [
        {
          id: 'legacy-key',
          catalogProductId: 'missing-id',
          sku: 'SNACK-1',
          productName: 'Snapshot',
          presentation: '100 g',
          quantity: 3,
          price: 2500,
        },
      ],
      catalog
    );

    expect(result.items).toEqual([
      expect.objectContaining({
        id: 'snack-1',
        catalogProductId: 'snack-1',
        sku: 'SNACK-1',
        productName: 'Snack natural',
        presentation: '100 g',
        quantity: 3,
        price: 2500,
      }),
    ]);
    expect(result.updatedPriceCount).toBe(0);
    expect(result.removedCount).toBe(0);
  });

  it('removes unavailable products, unknown presentations, and invalid quantities', () => {
    const result = reconcileCartItems(
      [
        {
          catalogProductId: 'discontinued',
          quantity: 1,
          price: 1000,
        },
        {
          catalogProductId: 'recipe-1',
          presentation: '2 kg',
          quantity: 1,
          price: 1000,
        },
        {
          catalogProductId: 'snack-1',
          quantity: 100,
          price: 2500,
        },
      ],
      catalog
    );

    expect(result).toEqual({
      items: [],
      removedCount: 3,
      updatedPriceCount: 0,
    });
  });

  it('rejects oversized untrusted checkout input instead of truncating it', () => {
    const requestedItems = Array.from(
      { length: MAX_CHECKOUT_ITEMS + 5 },
      (_, index) => ({
        catalogProductId: 'snack-1',
        quantity: 1,
        price: 2500,
        id: `item-${index}`,
      })
    );

    const result = reconcileCartItems(requestedItems, catalog);

    expect(result).toMatchObject({
      items: [],
      exceedsLimit: true,
      requestedCount: MAX_CHECKOUT_ITEMS + 5,
    });
  });
});
