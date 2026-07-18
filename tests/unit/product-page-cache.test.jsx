import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getProductBySlug: vi.fn(),
}));

vi.mock('next/cache', () => ({
  unstable_cache: (load) => {
    const values = new Map();

    return (...args) => {
      const key = JSON.stringify(args);

      if (!values.has(key)) {
        values.set(key, load(...args));
      }

      return values.get(key);
    };
  },
}));

vi.mock('next/navigation', () => ({
  notFound: vi.fn(),
  permanentRedirect: vi.fn(),
}));

vi.mock('../../features/Product', () => ({
  default: () => null,
}));

vi.mock('../../features/Product/formatDescription', () => ({
  default: (description) => description,
}));

vi.mock('../../services/products', () => ({
  getProductBySlug: mocks.getProductBySlug,
}));

import ProductPage, {
  generateMetadata,
} from '../../app/productos/[slug]/page';

describe('product page data loading', () => {
  beforeEach(() => {
    mocks.getProductBySlug.mockReset();
  });

  it('shares one keyed load between metadata and page rendering', async () => {
    mocks.getProductBySlug.mockResolvedValue({
      productName: 'Producto cacheado',
      urlSlug: 'producto-cacheado',
      description: 'Descripción',
      ingredientes: 'Ingredientes',
      images: [],
    });

    await generateMetadata({
      params: Promise.resolve({ slug: 'producto-cacheado' }),
    });
    await ProductPage({
      params: Promise.resolve({ slug: 'producto-cacheado' }),
    });

    expect(mocks.getProductBySlug).toHaveBeenCalledTimes(1);
    expect(mocks.getProductBySlug).toHaveBeenCalledWith('producto-cacheado');
  });
});
