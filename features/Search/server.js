import 'server-only';

import { fetchFromContentful } from '../../services/contentful';
import { fixtureProducts } from '../../test-support/contentful-fixtures';
import { getProductPath, normalizeProductSlug } from '../Catalog/server';

const MAX_RESULTS = 6;
const useFixtures = process.env.E2E_USE_FIXTURES === '1';

const productSearchIndexQuery = `
  query getProductSearchIndex {
    productCollection(limit: 100) {
      items {
        productName
        category
        urlSlug
        imageCollection(limit: 1) {
          items {
            title
            url
          }
        }
        sys {
          id
        }
      }
    }
  }
`;

const normalizeSearchText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es')
    .trim();

const fixtureProductList = () =>
  Object.values(fixtureProducts).flatMap(({ products }) => products);

const formatProductResult = (product) => {
  const slug = normalizeProductSlug(product?.urlSlug);
  const href = getProductPath(slug);

  if (!product?.productName || !href) {
    return null;
  }

  const image = product.images?.[0] || product.imageCollection?.items?.[0];

  return {
    id: product.sys?.id || `product:${slug}`,
    type: 'product',
    title: product.productName,
    subtitle: product.category || 'Producto',
    href,
    image: image
      ? {
          url: image.url,
          alt: image.title || product.productName,
        }
      : null,
  };
};

const rankProductResults = (products, query, limit = MAX_RESULTS) => {
  const normalizedQuery = normalizeSearchText(query);
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  if (!terms.length) {
    return [];
  }

  return products
    .map((product, index) => {
      const title = normalizeSearchText(product?.productName);
      const category = normalizeSearchText(product?.category);
      const searchableText = `${title} ${category}`;

      if (!terms.every((term) => searchableText.includes(term))) {
        return null;
      }

      const score =
        title === normalizedQuery
          ? 0
          : title.startsWith(normalizedQuery)
            ? 1
            : terms.every((term) => title.includes(term))
              ? 2
              : 3;

      return { product, index, score };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score || a.index - b.index)
    .slice(0, limit)
    .map(({ product }) => formatProductResult(product))
    .filter(Boolean);
};

const getProductSearchIndex = async () => {
  if (useFixtures) {
    return fixtureProductList();
  }

  const data = await fetchFromContentful(productSearchIndexQuery, undefined, {
    revalidate: 120,
    tags: ['products', 'product-search'],
  });

  return data?.productCollection?.items || [];
};

const searchSite = async (query) => {
  const products = await getProductSearchIndex();

  return rankProductResults(products, query);
};

export {
  normalizeSearchText,
  productSearchIndexQuery,
  rankProductResults,
  searchSite,
};
