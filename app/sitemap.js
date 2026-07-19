import { getProducts } from '../services/products';
import { absoluteUrl } from '../constants/seo';
import { getProductPath } from '../util/product-url';

export const revalidate = 3600;

const staticRoutes = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/productos', priority: 0.9, changeFrequency: 'daily' },
  { path: '/calculadora', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/plan-dnature', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/preguntas-frecuentes', priority: 0.5, changeFrequency: 'monthly' },
];

const sitemap = async () => {
  const catalog = await getProducts();
  const productPaths = new Set(
    Object.values(catalog)
      .flatMap(({ products }) => products)
      .map(({ urlSlug }) => getProductPath(urlSlug))
      .filter(Boolean)
  );

  return [
    ...staticRoutes.map(({ path, ...metadata }) => ({
      url: absoluteUrl(path),
      ...metadata,
    })),
    ...[...productPaths].map((path) => ({
      url: absoluteUrl(path),
      priority: 0.8,
      changeFrequency: 'weekly',
    })),
  ];
};

export default sitemap;
