import 'server-only';

import { listAllAvifyProducts } from '../../services/avify';
import { fetchFromContentful } from '../../services/contentful';
import { buildCatalogReconciliation } from './reconciliation';
import { buildContentfulEntryUrl } from './review-export';

const CONTENTFUL_PAGE_SIZE = 100;

const contentfulReconciliationQuery = `
  query CatalogReconciliation($limit: Int!, $skip: Int!) {
    productCollection(limit: $limit, skip: $skip) {
      total
      items {
        productName
        category
        categorySlug
        urlSlug
        medida
        precio
        preciosPorUnidad
        description
        ingredientes
        imageCollection(limit: 1) {
          items {
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

const toContentfulSummary = (product) => ({
  id: product?.sys?.id || null,
  name: typeof product?.productName === 'string' ? product.productName : null,
  slug: typeof product?.urlSlug === 'string' ? product.urlSlug : null,
  category: typeof product?.category === 'string' ? product.category : null,
  categorySlug:
    typeof product?.categorySlug === 'string' ? product.categorySlug : null,
  measure: typeof product?.medida === 'string' ? product.medida : null,
  price: typeof product?.precio === 'number' ? product.precio : null,
  unitPrices:
    product?.preciosPorUnidad &&
    typeof product.preciosPorUnidad === 'object' &&
    !Array.isArray(product.preciosPorUnidad)
      ? product.preciosPorUnidad
      : null,
  hasImage: Boolean(product?.imageCollection?.items?.[0]?.url),
  hasDescription: Boolean(product?.description),
  hasIngredients: Boolean(product?.ingredientes),
});

const listAllContentfulProducts = async () => {
  const products = [];
  let total = 1;

  while (products.length < total) {
    const data = await fetchFromContentful(
      contentfulReconciliationQuery,
      {
        limit: CONTENTFUL_PAGE_SIZE,
        skip: products.length,
      },
      { revalidate: 0 }
    );
    const collection = data?.productCollection;
    const page = Array.isArray(collection?.items)
      ? collection.items.filter(Boolean)
      : [];

    total =
      typeof collection?.total === 'number'
        ? collection.total
        : products.length + page.length;
    products.push(...page.map(toContentfulSummary));

    if (!page.length) {
      break;
    }
  }

  return products;
};

const getCatalogReconciliation = async () => {
  try {
    const [contentfulProducts, avifyResult] = await Promise.all([
      listAllContentfulProducts(),
      listAllAvifyProducts(),
    ]);

    if (!avifyResult.success) {
      return avifyResult;
    }

    const report = buildCatalogReconciliation(
      contentfulProducts,
      avifyResult.products
    );
    const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID;

    return {
      success: true,
      code: 'CATALOG_RECONCILIATION_READY',
      message: 'La conciliación de catálogos se generó correctamente.',
      report: {
        ...report,
        reviewItems: report.reviewItems.map((item) => ({
          ...item,
          contentfulUrl: buildContentfulEntryUrl(
            contentfulSpaceId,
            item.contentfulId
          ),
        })),
      },
    };
  } catch (error) {
    return {
      success: false,
      code: 'CATALOG_RECONCILIATION_UNAVAILABLE',
      message: 'No se pudieron comparar los catálogos.',
      ...(process.env.NODE_ENV !== 'production'
        ? { developmentDetails: error.message }
        : {}),
    };
  }
};

export {
  contentfulReconciliationQuery,
  getCatalogReconciliation,
  listAllContentfulProducts,
  toContentfulSummary,
};
