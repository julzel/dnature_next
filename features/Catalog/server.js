import 'server-only';

import { listAvifyProducts } from '../../services/avify';
import { getProductBySlug, getProducts } from './api/products';
import {
  addDevelopmentPriceComparison,
  getCatalogAvifySkus,
} from './lib/dev-price-comparison';

const shouldLoadDevelopmentPrices = () =>
  process.env.NODE_ENV === 'development' &&
  process.env.E2E_USE_FIXTURES !== '1';

const getProductsWithDevelopmentPrices = async () => {
  const loadDevelopmentPrices = shouldLoadDevelopmentPrices();
  const products = await getProducts({ fresh: loadDevelopmentPrices });

  if (!loadDevelopmentPrices) {
    return products;
  }

  const skus = getCatalogAvifySkus(products);

  if (!skus.length) {
    return addDevelopmentPriceComparison(products);
  }

  const avifyResult = await listAvifyProducts({
    pageNum: 1,
    pageSize: skus.length,
    skus,
  });

  if (!avifyResult.success) {
    console.warn(
      `[Catalog] Avify development prices unavailable: ${avifyResult.code}`
    );
  }

  return addDevelopmentPriceComparison(
    products,
    avifyResult.success ? avifyResult.products : []
  );
};

export {
  getProductBySlug,
  getProducts,
  getProductsWithDevelopmentPrices,
  shouldLoadDevelopmentPrices,
};
export {
  getProductPath,
  normalizeProductSlug,
} from './lib/product-url';
