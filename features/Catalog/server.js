import 'server-only';

export { getProductBySlug, getProducts } from './api/products';
export {
  getProductPath,
  normalizeProductSlug,
} from './lib/product-url';
