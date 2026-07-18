import { fetchFromContentful } from './util';
import { normalizeProductSlug } from '../util/product-url';

const categoriesPriority = [
  'snacks',
  'recetas',
  'suplementos',
  'proteinas',
  'organos',
];

const productsQuery = () => `
{
    productCollection {
        items {
            productName
            category
            categorySlug
            urlSlug
            medida
            precio
            preciosPorUnidad
            rating
            imageCollection {
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

const productQuery = (productId) => `
        {
            product(id:"${productId}") {
            productName
            urlSlug
            description
                category
                medida
                precio
                preciosPorUnidad
                ingredientes
                imageCollection {
                    items {
                        title
                        url
                    }
                }
                iconosCollection {
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
        imageCollection {
          items {
            title
            url
          }
        }
        iconosCollection {
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

const formatProduct = (product) => {
  const normalizedSlug = normalizeProductSlug(product?.urlSlug);

  if (!normalizedSlug) {
    console.warn(`Skipping product with invalid urlSlug: ${product?.sys?.id || 'unknown'}`);
    return null;
  }

  return {
    ...product,
    urlSlug: normalizedSlug,
    images: product.imageCollection?.items || [],
    iconos: product.iconosCollection?.items || [],
  };
};

const formatProductsData = (productItems) => {
  const catalog = {};
  productItems.forEach((rawItem) => {
    const item = formatProduct(rawItem);

    if (!item) {
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

const getProducts = async () => {
  const data = await fetchFromContentful(productsQuery(), undefined, {
    revalidate: 120,
    tags: ['products'],
  });
  return formatProductsData(data.productCollection.items);
};

const formatProductData = formatProduct;

const getProduct = async (productId) => {
  try {
    const product = await fetchFromContentful(productQuery(productId));
    if (product.product) {
      return formatProductData(product.product);
    }
    return null;
  } catch (error) {
    console.log(error, error?.message);
  }
};

const getProductBySlug = async (slug) => {
  const normalizedSlug = normalizeProductSlug(slug);

  if (!normalizedSlug) {
    return null;
  }

  const data = await fetchFromContentful(
    productBySlugQuery,
    { slug: normalizedSlug },
    {
      revalidate: 120,
      tags: ['products', `product:${normalizedSlug}`],
    }
  );
  const product = data?.productCollection?.items?.[0];

  return product ? formatProductData(product) : null;
};

export { getProducts, getProduct, getProductBySlug };
