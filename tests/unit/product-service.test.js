import { describe, expect, it, vi } from 'vitest';

import {
  formatProductData,
  formatProductsData,
  findPersistedProductSlugs,
  productBySlugQuery,
  productSlugIndexQuery,
} from '../../features/Catalog/api/products';

const product = (id, urlSlug) => ({
  productName: `Product ${id}`,
  category: 'Recetas',
  categorySlug: 'recetas',
  urlSlug,
  imageCollection: { items: [] },
  iconosCollection: { items: [] },
  sys: { id },
});

describe('Contentful product slug boundary', () => {
  it('normalizes a valid legacy Contentful slug', () => {
    expect(formatProductData(product('one', ' DNATURE-POLLO ')).urlSlug).toBe(
      'dnature-pollo'
    );
  });

  it('rejects invalid slugs', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(formatProductData(product('one', 'pollo crudo'))).toBeNull();
    expect(warning).toHaveBeenCalledOnce();
    warning.mockRestore();
  });

  it('blocks collisions after normalization', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const catalog = formatProductsData([
      product('one', 'dnature-pollo'),
      product('two', ' DNATURE-POLLO '),
    ]);

    expect(catalog).toEqual({});
    expect(warning).toHaveBeenCalledWith(
      'Skipping products with colliding urlSlug: dnature-pollo'
    );
    warning.mockRestore();
  });

  it('resolves the persisted dirty slug before requesting one product', () => {
    expect(
      findPersistedProductSlugs(
        [product('one', ' DNATURE-POLLO '), product('two', 'otro-producto')],
        'dnature-pollo'
      )
    ).toEqual([' DNATURE-POLLO ']);
    expect(
      findPersistedProductSlugs(
        [product('one', 'dnature-pollo'), product('two', ' DNATURE-POLLO ')],
        'dnature-pollo'
      )
    ).toHaveLength(2);
  });

  it('keeps Contentful collection limits bounded', () => {
    expect(productSlugIndexQuery).toContain('productCollection(limit: 100)');
    expect(productSlugIndexQuery).not.toMatch(/imageCollection|iconosCollection/);
    expect(productBySlugQuery).toContain('productCollection(where: { urlSlug: $slug }, limit: 1)');
    expect(productBySlugQuery).toContain('imageCollection(limit: 20)');
    expect(productBySlugQuery).toContain('iconosCollection(limit: 20)');
  });
});
