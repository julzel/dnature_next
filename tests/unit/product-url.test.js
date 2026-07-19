import { describe, expect, it } from 'vitest';

import {
  getProductPath,
  normalizeProductSlug,
} from '../../features/Catalog/lib/product-url';

describe('product URL boundaries', () => {
  it('normalizes canonical Contentful slugs', () => {
    expect(normalizeProductSlug('  DNATURE-POLLO  ')).toBe('dnature-pollo');
    expect(getProductPath('dnature-pollo')).toBe('/productos/dnature-pollo');
  });

  it.each(['', 'pollo crudo', 'pollo_', 'ácarne', null, undefined])(
    'rejects malformed slug %s',
    (slug) => {
      expect(normalizeProductSlug(slug)).toBeNull();
      expect(getProductPath(slug)).toBeNull();
    }
  );

  it('normalizes encoded leading whitespace for canonical redirects', () => {
    expect(normalizeProductSlug('%20dnature-pollo')).toBe('dnature-pollo');
    expect(getProductPath('%20dnature-pollo')).toBe('/productos/dnature-pollo');
  });

  it('rejects malformed percent encoding', () => {
    expect(normalizeProductSlug('%E0%A4%A')).toBeNull();
  });
});
