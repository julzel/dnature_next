import { fetchFromContentful } from "./util";

const categoriesPriority = [
  "snacks",
  "recetas",
  "suplementos",
  "proteinas",
  "organos",
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

const formatProductsData = (productItems) => {
  const catalog = {};
  productItems.forEach((item) => {
    const { categorySlug, category, imageCollection } = item;
    item.images = imageCollection.items;
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
      const aRating =  a.rating || 100;
      const bRating =  b.rating || 100;
      return aRating - bRating; // Sort in descending order. Swap 'aRating' and 'bRating' for ascending order.
    });
  }

  return catalog;
};

const getProducts = async () => {
  const data = await fetchFromContentful(productsQuery());
  return formatProductsData(data.productCollection.items);
};

const formatProductData = (product) => {
  product.images = product.imageCollection.items;
  delete product.imageCollection;

  product.iconos = product.iconosCollection.items;
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

export { getProducts, getProduct };
