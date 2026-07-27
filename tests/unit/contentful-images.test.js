import { describe, expect, it } from 'vitest';

import contentfulLoader, {
  isContentfulImageUrl,
  normalizeImageSource,
} from '../../imageLoader';
import {
  getOptimizedContentfulImageUrl,
  optimizeContentfulImage,
} from '../../services/contentful-images';

describe('Contentful image optimization', () => {
  it('normalizes whitespace and protocol-relative sources once', () => {
    const source = '  //images.ctfassets.net/space/asset/product.jpg  ';

    expect(normalizeImageSource(source)).toBe(
      'https://images.ctfassets.net/space/asset/product.jpg'
    );
    expect(isContentfulImageUrl(source)).toBe(true);
  });

  it('uses the requested responsive width and preserves configured quality', () => {
    const result = contentfulLoader({
      src: '//images.ctfassets.net/space/asset/product.jpg?w=1000&q=72',
      width: 384,
    });
    const url = new URL(result);

    expect(url.searchParams.get('w')).toBe('384');
    expect(url.searchParams.get('q')).toBe('72');
    expect(url.searchParams.get('fm')).toBe('webp');
  });

  it('caps oversized requests and honors an explicit Next image quality', () => {
    const result = contentfulLoader({
      src: 'https://images.eu.ctfassets.net/space/asset/product.jpg',
      width: 2048,
      quality: 80,
    });
    const url = new URL(result);

    expect(url.searchParams.get('w')).toBe('1600');
    expect(url.searchParams.get('q')).toBe('80');
  });

  it('returns normalized non-Contentful sources without rewriting them', () => {
    expect(
      contentfulLoader({
        src: '  //cdn.example.com/product.jpg  ',
        width: 640,
      })
    ).toBe('https://cdn.example.com/product.jpg');
    expect(isContentfulImageUrl('/images/category-snack.jpg')).toBe(false);
  });

  it('adds bounded defaults for direct Contentful image consumers only', () => {
    const image = optimizeContentfulImage(
      {
        title: 'Producto',
        url: ' //images.ctfassets.net/space/asset/product.jpg ',
      },
      { width: 1000, quality: 72 }
    );
    const url = new URL(image.url);

    expect(url.searchParams.get('w')).toBe('1000');
    expect(url.searchParams.get('q')).toBe('72');
    expect(url.searchParams.get('fm')).toBe('webp');
    expect(
      getOptimizedContentfulImageUrl(' /images/category-snack.jpg ')
    ).toBe('/images/category-snack.jpg');
  });
});
