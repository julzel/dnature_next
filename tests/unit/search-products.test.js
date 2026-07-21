import { describe, expect, it } from 'vitest';

import {
  normalizeSearchText,
  rankProductResults,
} from '../../features/Search/server';

const product = (id, productName, category = 'Recetas completas') => ({
  productName,
  category,
  urlSlug: productName.toLowerCase().replaceAll(' ', '-'),
  imageCollection: {
    items: [{ title: productName, url: `/images/${id}.jpg` }],
  },
  sys: { id },
});

describe('product search', () => {
  it('normalizes accents and ranks exact and prefix matches first', () => {
    const results = rankProductResults(
      [
        product('category', 'Snack de pollo', 'Proteína de pollo'),
        product('prefix', 'Pollo y caballo'),
        product('exact', 'Pollo'),
      ],
      'PÓLLO'
    );

    expect(normalizeSearchText('  PÓLLO  ')).toBe('pollo');
    expect(results.map(({ id }) => id)).toEqual([
      'exact',
      'prefix',
      'category',
    ]);
  });

  it('matches every query term and returns the extensible result contract', () => {
    const results = rankProductResults(
      [product('match', 'Receta de pollo y caballo'), product('miss', 'Pollo')],
      'caballo pollo'
    );

    expect(results).toEqual([
      expect.objectContaining({
        id: 'match',
        type: 'product',
        title: 'Receta de pollo y caballo',
        subtitle: 'Recetas completas',
        href: '/productos/receta-de-pollo-y-caballo',
        image: {
          alt: 'Receta de pollo y caballo',
          url: '/images/match.jpg',
        },
      }),
    ]);
  });
});
