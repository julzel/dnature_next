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

  it('uses the current Avify variant identity, price, and availability', () => {
    const avifyCatalog = {
      recipes: {
        products: [
          {
            ...catalog.recipes.products[0],
            preciosPorUnidad: { '500 g': 3750, '1 kg': 6900 },
            commerce: {
              integrationAvailable: true,
              mapped: true,
              parentSku: 'REC-1',
              productId: 100,
              presentations: {
                '500 g': {
                  availability: 'available',
                  variantId: 101,
                  variantSku: 'REC-1-500G',
                  attributes: [{ code: 'size', value: '500g' }],
                },
                '1 kg': {
                  availability: 'unavailable',
                  variantId: 102,
                  variantSku: 'REC-1-1KG',
                  attributes: [{ code: 'size', value: '1kg' }],
                },
              },
            },
          },
        ],
      },
    };

    const result = reconcileCartItems(
      [
        {
          catalogProductId: 'recipe-1',
          presentation: '500 g',
          quantity: 1,
          price: 3500,
        },
        {
          catalogProductId: 'recipe-1',
          presentation: '1 kg',
          quantity: 1,
          price: 6500,
        },
      ],
      avifyCatalog
    );

    expect(result).toEqual({
      items: [
        expect.objectContaining({
          sku: 'REC-1-500G',
          parentSku: 'REC-1',
          avifyProductId: 100,
          avifyVariantId: 101,
          avifyAttributes: [{ code: 'size', value: '500g' }],
          price: 3750,
        }),
      ],
      removedCount: 1,
      updatedPriceCount: 1,
    });
  });

  it('does not let checkout continue with stale prices when Avify is down', () => {
    const unavailableCatalog = {
      snacks: {
        products: [
          {
            ...catalog.snacks.products[0],
            commerce: {
              integrationAvailable: false,
              mapped: false,
              availability: 'unknown',
            },
          },
        ],
      },
    };

    expect(
      reconcileCartItems(
        [
          {
            catalogProductId: 'snack-1',
            quantity: 1,
            price: 2500,
          },
        ],
        unavailableCatalog
      )
    ).toEqual({
      items: [],
      removedCount: 0,
      updatedPriceCount: 0,
      avifyUnavailable: true,
    });
  });

  it('removes a product whose persisted Avify mapping no longer resolves', () => {
    const brokenMappingCatalog = {
      snacks: {
        products: [
          {
            ...catalog.snacks.products[0],
            commerce: {
              integrationAvailable: true,
              mapped: false,
              mappingMissing: true,
              availability: 'unknown',
            },
          },
        ],
      },
    };

    expect(
      reconcileCartItems(
        [
          {
            catalogProductId: 'snack-1',
            quantity: 1,
            price: 2500,
          },
        ],
        brokenMappingCatalog
      )
    ).toEqual({
      items: [],
      removedCount: 1,
      updatedPriceCount: 0,
    });
  });

  it('reduces a stale cart quantity to the current sellable stock', () => {
    const constrainedCatalog = {
      snacks: {
        products: [
          {
            ...catalog.snacks.products[0],
            commerce: {
              integrationAvailable: true,
              mapped: true,
              parentSku: 'SNACK-1',
              productId: 500,
              availability: 'available',
              availableQuantity: 2,
            },
          },
        ],
      },
    };

    expect(
      reconcileCartItems(
        [
          {
            catalogProductId: 'snack-1',
            quantity: 5,
            price: 2500,
          },
        ],
        constrainedCatalog
      )
    ).toEqual({
      items: [
        expect.objectContaining({
          catalogProductId: 'snack-1',
          quantity: 2,
        }),
      ],
      removedCount: 0,
      updatedPriceCount: 0,
      updatedQuantityCount: 1,
    });
  });

  it('removes mapped items whose exact availability cannot be confirmed', () => {
    const unknownCatalog = {
      snacks: {
        products: [
          {
            ...catalog.snacks.products[0],
            commerce: {
              integrationAvailable: true,
              mapped: true,
              parentSku: 'SNACK-1',
              productId: 500,
              availability: 'unknown',
              availableQuantity: null,
            },
          },
        ],
      },
    };

    expect(
      reconcileCartItems(
        [
          {
            catalogProductId: 'snack-1',
            quantity: 1,
            price: 2500,
          },
        ],
        unknownCatalog
      )
    ).toEqual({
      items: [],
      removedCount: 1,
      updatedPriceCount: 0,
    });
  });
});
