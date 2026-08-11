import { describe, expect, it } from 'vitest';

import {
  enrichProductWithAvify,
  getAvailabilityUi,
  getCatalogAvifySkus,
  indexVariantsByPresentation,
  inventorySignal,
  normalizePresentation,
} from '../../features/Catalog/lib/avify-commerce';

const contentfulProduct = (overrides = {}) => ({
  sys: { id: 'contentful-1' },
  productName: 'Producto natural',
  avifySku: 'PARENT-1',
  precio: 1000,
  preciosPorUnidad: null,
  ...overrides,
});

const avifyProduct = (overrides = {}) => ({
  id: 10,
  sku: 'PARENT-1',
  type: 'simple',
  status: 'inactive',
  price: 1250,
  taxPrice: 0,
  taxPercentage: 0,
  quantity: 5,
  reserved: 2,
  onDemand: false,
  variants: [],
  variantOptions: [],
  ...overrides,
});

describe('Avify storefront commerce projection', () => {
  it('turns exact low stock into clear customer-facing availability', () => {
    expect(
      getAvailabilityUi({
        availability: 'available',
        availableQuantity: 1,
      })
    ).toMatchObject({
      canPurchase: true,
      copy: 'Última unidad disponible',
    });
    expect(
      getAvailabilityUi({
        availability: 'available',
        availableQuantity: 4,
      })
    ).toMatchObject({
      canPurchase: true,
      copy: 'Solo quedan 4 unidades',
    });
    expect(
      getAvailabilityUi({
        availability: 'available',
        availableQuantity: 8,
      })
    ).toMatchObject({
      canPurchase: true,
      copy: null,
    });
  });

  it('disables purchase when stock is exhausted or cannot be confirmed', () => {
    expect(getAvailabilityUi({ availability: 'unavailable' })).toEqual({
      availability: 'unavailable',
      canPurchase: false,
      copy: null,
      disabledActionCopy: 'Agotado por ahora',
    });
    expect(getAvailabilityUi({ availability: 'unknown' })).toEqual({
      availability: 'unknown',
      canPurchase: false,
      copy: 'Disponibilidad por confirmar',
      disabledActionCopy: 'No disponible por ahora',
    });
  });

  it('collects unique linked parent SKUs without empty values', () => {
    expect(
      getCatalogAvifySkus({
        recipes: {
          products: [
            { avifySku: ' PARENT-1 ' },
            { avifySku: 'PARENT-1' },
            { avifySku: null },
          ],
        },
        snacks: { products: [{ avifySku: 'PARENT-2' }] },
      })
    ).toEqual(['PARENT-1', 'PARENT-2']);
  });

  it('normalizes equivalent weight and volume presentation labels', () => {
    expect(normalizePresentation('0.5 kg')).toBe('500g');
    expect(normalizePresentation('1k')).toBe('1000g');
    expect(normalizePresentation('1 L')).toBe('1000ml');
  });

  it('uses the Avify price and available location stock for simple products', () => {
    const product = enrichProductWithAvify(
      contentfulProduct(),
      avifyProduct()
    );

    expect(product.precio).toBe(1250);
    expect(product.commerce).toMatchObject({
      mapped: true,
      parentSku: 'PARENT-1',
      productId: 10,
      priceSource: 'avify',
      availability: 'available',
      availableQuantity: 3,
      taxPercentage: 0,
    });
  });

  it('treats on-demand products as available without inventing a quantity', () => {
    expect(
      inventorySignal({ onDemand: true, quantity: 0, reserved: 7 })
    ).toEqual({
      availability: 'available',
      availableQuantity: null,
      onDemand: true,
    });
  });

  it('subtracts reservations and exposes only complete sellable units', () => {
    expect(inventorySignal({ quantity: 5.8, reserved: 2 })).toEqual({
      availability: 'available',
      availableQuantity: 3,
      onDemand: false,
    });
  });

  it('uses exact Avify variants and keeps an honest fallback for unmatched labels', () => {
    const product = enrichProductWithAvify(
      contentfulProduct({
        preciosPorUnidad: {
          '500g': 1000,
          '1kg': 1900,
          '2kg': 3500,
        },
      }),
      avifyProduct({
        type: 'configurable',
        price: 9999,
        variants: [
          {
            id: 11,
            sku: 'VARIANT-500',
            name: '500 g',
            price: 1100,
            quantity: 4,
            reserved: 1,
            onDemand: false,
            attributes: [{ code: 'size', value: '500g' }],
          },
          {
            id: 12,
            sku: 'VARIANT-1000',
            name: '1k',
            price: 2000,
            quantity: 0,
            reserved: 0,
            onDemand: false,
            attributes: [{ code: 'size', value: '1kg' }],
          },
        ],
      })
    );

    expect(product.preciosPorUnidad).toEqual({
      '500g': 1100,
      '1kg': 2000,
      '2kg': 3500,
    });
    expect(product.commerce).toMatchObject({
      priceSource: 'mixed',
      availability: 'available',
      presentations: {
        '500g': {
          priceSource: 'avify',
          availability: 'available',
          variantSku: 'VARIANT-500',
          variantId: 11,
        },
        '1kg': {
          priceSource: 'avify',
          availability: 'unavailable',
          variantSku: 'VARIANT-1000',
        },
        '2kg': {
          priceSource: 'contentful-fallback',
          availability: 'unknown',
          variantSku: null,
        },
      },
    });
  });

  it('can match a presentation through variant attributes or option labels', () => {
    const indexed = indexVariantsByPresentation({
      variants: [
        {
          sku: 'VARIANT-MEDIUM',
          name: 'Configuración 2',
          attributes: [{ code: 'size', value: 'Mediana' }],
        },
      ],
      variantOptions: [
        {
          values: [
            {
              label: 'Tamaño mediano',
              productsSku: 'VARIANT-MEDIUM',
            },
          ],
        },
      ],
    });

    expect(indexed.get('mediano')?.sku).toBe('VARIANT-MEDIUM');
    expect(indexed.get('tamanomediano')?.sku).toBe('VARIANT-MEDIUM');
  });

  it('does not auto-match an ambiguous presentation label', () => {
    const indexed = indexVariantsByPresentation({
      variants: [
        { sku: 'VARIANT-A', name: '500g', attributes: [] },
        { sku: 'VARIANT-B', name: '500 g', attributes: [] },
      ],
    });

    expect(indexed.get('500g')).toBeNull();
  });

  it('does not apply an ambiguous parent price to an unmapped configurable product', () => {
    const product = enrichProductWithAvify(
      contentfulProduct({ precio: 1500 }),
      avifyProduct({ type: 'configurable', price: 9999 })
    );

    expect(product.precio).toBe(1500);
    expect(product.commerce).toMatchObject({
      mapped: true,
      priceSource: 'contentful-fallback',
      availability: 'unknown',
    });
  });

  it('marks the fallback when Avify cannot be reached', () => {
    const product = enrichProductWithAvify(contentfulProduct(), null, {
      integrationAvailable: false,
    });

    expect(product.precio).toBe(1000);
    expect(product.commerce).toMatchObject({
      integrationAvailable: false,
      mapped: false,
      mappingMissing: false,
      priceSource: 'contentful-fallback',
      availability: 'unknown',
    });
  });

  it('distinguishes a broken persisted mapping from an unavailable API', () => {
    const product = enrichProductWithAvify(contentfulProduct(), null, {
      integrationAvailable: true,
    });

    expect(product.commerce).toMatchObject({
      integrationAvailable: true,
      mapped: false,
      mappingMissing: true,
      availability: 'unknown',
    });
  });
});
