import { fetchFromContentful } from '../../../services/contentful';
import { normalizeProductSlug } from '../lib/product-url';
import {
  fixtureProducts,
  getFixtureProductBySlug,
} from '../../../test-support/contentful-fixtures';
import { optimizeContentfulImage } from '../../../services/contentful-images';

const useFixtures = process.env.E2E_USE_FIXTURES === '1';

const categoriesPriority = [
  'snacks',
  'recetas',
  'suplementos',
  'proteinas',
  'organos',
];

const productsQuery = () => `
{
    productCollection(limit: 100) {
        items {
            productName
            avifySku
            category
            categorySlug
            urlSlug
            medida
            precio
            preciosPorUnidad
            rating
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

const productSlugIndexQuery = `
  query getProductSlugIndex {
    productCollection(limit: 100) {
      items {
        urlSlug
        sys {
          id
        }
      }
    }
  }
`;

const productBySlugQuery = `
  query getProductBySlug($slug: String!) {
    productCollection(where: { urlSlug: $slug }, limit: 1) {
      items {
        productName
        urlSlug
        description
        category
        medida
        precio
        preciosPorUnidad
        ingredientes
        imageCollection(limit: 20) {
          items {
            title
            url
          }
        }
        iconosCollection(limit: 20) {
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

const formatProduct = (
  product,
  { imageWidth = 1600, imageQuality = 78 } = {}
) => {
  const normalizedSlug = normalizeProductSlug(product?.urlSlug);

  if (!normalizedSlug) {
    console.warn(`Skipping product with invalid urlSlug: ${product?.sys?.id || 'unknown'}`);
    return null;
  }

  return {
    ...product,
    urlSlug: normalizedSlug,
    images: (product.imageCollection?.items || []).map((image) =>
      optimizeContentfulImage(image, {
        width: imageWidth,
        quality: imageQuality,
      })
    ),
    iconos: (product.iconosCollection?.items || []).map((icon) =>
      optimizeContentfulImage(icon, {
        width: 96,
        quality: 80,
      })
    ),
  };
};

const formatProductsData = (productItems) => {
  const catalog = {};
  const formattedItems = productItems
    .map((product) =>
      formatProduct(product, {
        imageWidth: 1000,
        imageQuality: 72,
      })
    )
    .filter(Boolean);
  const slugCounts = formattedItems.reduce((counts, item) => {
    counts.set(item.urlSlug, (counts.get(item.urlSlug) || 0) + 1);
    return counts;
  }, new Map());
  const reportedCollisions = new Set();

  formattedItems.forEach((item) => {
    if (slugCounts.get(item.urlSlug) > 1) {
      if (!reportedCollisions.has(item.urlSlug)) {
        console.warn(`Skipping products with colliding urlSlug: ${item.urlSlug}`);
        reportedCollisions.add(item.urlSlug);
      }
      return;
    }

    const { categorySlug, category } = item;

    if (catalog.hasOwnProperty(categorySlug)) {
      catalog[categorySlug].products.push(item);
    } else {
      catalog[categorySlug] = {
        label: category,
        id: categorySlug,
        products: [item],
        index: categoriesPriority.indexOf(categorySlug),
      };
    }
  });

  // Sort the products by rating, if the rating exists and is a number.
  for (let category in catalog) {
    catalog[category].products.sort((a, b) => {
      const aRating = a.rating || 100;
      const bRating = b.rating || 100;
      return aRating - bRating; // Sort in descending order. Swap 'aRating' and 'bRating' for ascending order.
    });
  }

  return catalog;
};

const getProducts = async ({ fresh = false } = {}) => {
  if (useFixtures) {
    return fixtureProducts;
  }

  const data = await fetchFromContentful(productsQuery(), undefined, {
    revalidate: fresh ? 0 : 120,
    ...(fresh ? {} : { tags: ['products'] }),
  });
  return formatProductsData(data.productCollection.items);
};

const formatProductData = (product) =>
  formatProduct(product, {
    imageWidth: 1600,
    imageQuality: 78,
  });

const findPersistedProductSlugs = (products, normalizedSlug) =>
  (Array.isArray(products) ? products : [])
    .filter(
      (product) => normalizeProductSlug(product?.urlSlug) === normalizedSlug
    )
    .map((product) => product.urlSlug);

const getProductBySlug = async (slug) => {
  const normalizedSlug = normalizeProductSlug(slug);

  if (!normalizedSlug) {
    return null;
  }

  if (useFixtures) {
    if (normalizedSlug === 'fixture-error') {
      throw new Error('Intentional fixture error for error-boundary coverage');
    }

    return getFixtureProductBySlug(normalizedSlug);
  }

  const slugIndexData = await fetchFromContentful(
    productSlugIndexQuery,
    undefined,
    {
      revalidate: 120,
      tags: ['products'],
    }
  );
  const matchingPersistedSlugs = findPersistedProductSlugs(
    slugIndexData?.productCollection?.items,
    normalizedSlug
  );

  if (matchingPersistedSlugs.length !== 1) {
    if (matchingPersistedSlugs.length > 1) {
      console.warn(`Unable to resolve colliding Contentful urlSlug: ${normalizedSlug}`);
    }
    return null;
  }

  const persistedSlug = matchingPersistedSlugs[0];
  const data = await fetchFromContentful(productBySlugQuery, { slug: persistedSlug }, {
    revalidate: 120,
    tags: ['products', `product:${normalizedSlug}`],
  });
  const product = data?.productCollection?.items?.[0];

  return product ? formatProductData(product) : null;
};

export {
  formatProductData,
  formatProductsData,
  findPersistedProductSlugs,
  getProducts,
  getProductBySlug,
  productBySlugQuery,
  productSlugIndexQuery,
  productsQuery,
};
