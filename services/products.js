import { fetchFromContentful } from './util';
import { optimizeContentfulImage } from './contentful-images';

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

const productQuery = (productId) => `
        {
            product(id:"${productId}") {
                productName
                description
                category
                medida
                precio
                preciosPorUnidad
                ingredientes
                imageCollection(limit: 10) {
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
        imageCollection(limit: 10) {
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

const formatProductsData = (productItems) => {
  const catalog = {};
  productItems.forEach((item) => {
    const { categorySlug, category, imageCollection } = item;
    item.images = (imageCollection?.items || []).map((image) =>
      optimizeContentfulImage(image, {
        width: 1000,
        quality: 72,
      })
    );
    delete item.imageCollection;

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

const formatProductData = (product) => {
  product.images = (product.imageCollection?.items || []).map((image) =>
    optimizeContentfulImage(image, {
      width: 1600,
      quality: 78,
    })
  );
  delete product.imageCollection;

  product.iconos = (product.iconosCollection?.items || []).map((image) =>
    optimizeContentfulImage(image, {
      width: 96,
      quality: 80,
    })
  );
  delete product.iconosCollection;
  return product;
};

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
  const data = await fetchFromContentful(
    productBySlugQuery,
    { slug },
    {
      revalidate: 120,
      tags: ['products', `product:${slug}`],
    }
  );
  const product = data?.productCollection?.items?.[0];

  return product ? formatProductData(product) : null;
};

export { getProducts, getProduct, getProductBySlug };
