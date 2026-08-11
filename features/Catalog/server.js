import 'server-only';

import { unstable_cache } from 'next/cache';

import {
  getAvifyLocationId,
  listAvifyProductsBySkus,
} from '../../services/avify';
import {
  getProductBySlug as getContentfulProductBySlug,
  getProducts,
} from './api/products';
import {
  enrichCatalogWithAvify,
  enrichProductWithAvify,
  getCatalogAvifySkus,
} from './lib/avify-commerce';

const shouldLoadAvifyCommerce = () =>
  process.env.E2E_USE_FIXTURES !== '1' &&
  Boolean(process.env.AVIFY_API_KEY?.trim());

const getCachedAvifyProductsBySkus = unstable_cache(
  async (skus, locationId) =>
    listAvifyProductsBySkus(skus, { locationId }),
  ['avify-storefront-products'],
  {
    revalidate: 60,
    tags: ['avify-products'],
  }
);

const loadAvifyProducts = async (skus, { fresh = false } = {}) => {
  if (!shouldLoadAvifyCommerce() || !skus.length) {
    return {
      success: false,
      code: 'AVIFY_NOT_CONFIGURED',
      products: [],
    };
  }

  const locationId = getAvifyLocationId();
  return fresh
    ? listAvifyProductsBySkus(skus, { locationId })
    : getCachedAvifyProductsBySkus(skus, locationId);
};

const enrichCatalog = async (products, { freshAvify = false } = {}) => {
  const skus = getCatalogAvifySkus(products);
  const result = await loadAvifyProducts(skus, { fresh: freshAvify });

  if (!result.success) {
    console.warn(`[Catalog] Avify commerce data unavailable: ${result.code}`);
  } else if (result.missingSkus?.length) {
    console.warn(
      `[Catalog] ${result.missingSkus.length} mapped Avify SKUs were not returned.`
    );
  }

  return enrichCatalogWithAvify(products, result.products || [], {
    integrationAvailable: result.success,
  });
};

const getProductsWithCommerceData = async ({ freshAvify = false } = {}) => {
  const products = await getProducts({ fresh: freshAvify });

  if (process.env.E2E_USE_FIXTURES === '1') return products;
  return enrichCatalog(products, { freshAvify });
};

const getProductBySlug = async (slug) => {
  const product = await getContentfulProductBySlug(slug);
  if (!product || process.env.E2E_USE_FIXTURES === '1') return product;

  const sku = product.avifySku?.trim();
  if (!sku) {
    return enrichProductWithAvify(product, null, {
      integrationAvailable: shouldLoadAvifyCommerce(),
    });
  }

  const result = await loadAvifyProducts([sku]);

  if (!result.success) {
    console.warn(`[Catalog] Avify product data unavailable: ${result.code}`);
  }

  return enrichProductWithAvify(product, result.products?.[0] || null, {
    integrationAvailable: result.success,
  });
};

export {
  getProductBySlug,
  getProducts,
  getProductsWithCommerceData,
  shouldLoadAvifyCommerce,
};
export {
  getProductPath,
  normalizeProductSlug,
} from './lib/product-url';
