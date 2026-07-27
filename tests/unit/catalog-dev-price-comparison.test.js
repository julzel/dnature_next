import { describe, expect, it } from 'vitest';

import {
  addDevelopmentPriceComparison,
  getCatalogAvifySkus,
} from '../../features/Catalog/lib/dev-price-comparison';
import { shouldLoadDevelopmentPrices } from '../../features/Catalog/server';

const catalog = {
  recetas: {
    id: 'recetas',
    products: [
      { productName: 'Pollo', avifySku: 'PARENT-1', precio: 5000 },
      { productName: 'Trucha', avifySku: 'PARENT-2', precio: 6000 },
      { productName: 'Sin vínculo', avifySku: null, precio: 4000 },
    ],
  },
};

describe('development catalog price comparison', () => {
  it('runs only in local development outside fixture E2E mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalFixtureMode = process.env.E2E_USE_FIXTURES;

    process.env.NODE_ENV = 'development';
    delete process.env.E2E_USE_FIXTURES;
    expect(shouldLoadDevelopmentPrices()).toBe(true);

    process.env.E2E_USE_FIXTURES = '1';
    expect(shouldLoadDevelopmentPrices()).toBe(false);

    process.env.NODE_ENV = 'production';
    delete process.env.E2E_USE_FIXTURES;
    expect(shouldLoadDevelopmentPrices()).toBe(false);

    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }
    if (originalFixtureMode === undefined) {
      delete process.env.E2E_USE_FIXTURES;
    } else {
      process.env.E2E_USE_FIXTURES = originalFixtureMode;
    }
  });

  it('collects unique linked parent SKUs', () => {
    expect(getCatalogAvifySkus(catalog)).toEqual([
      'PARENT-1',
      'PARENT-2',
    ]);
  });

  it('adds Avify prices by parent UUID without mutating Contentful prices', () => {
    const enriched = addDevelopmentPriceComparison(catalog, [
      { sku: 'PARENT-1', price: 4800 },
      { sku: 'PARENT-2', price: 0 },
    ]);

    expect(enriched.recetas.products).toEqual([
      expect.objectContaining({
        precio: 5000,
        developmentPriceComparison: { avifyPrice: 4800 },
      }),
      expect.objectContaining({
        precio: 6000,
        developmentPriceComparison: { avifyPrice: 0 },
      }),
      expect.objectContaining({
        precio: 4000,
        developmentPriceComparison: { avifyPrice: null },
      }),
    ]);
    expect(catalog.recetas.products[0]).not.toHaveProperty(
      'developmentPriceComparison'
    );
  });
});
