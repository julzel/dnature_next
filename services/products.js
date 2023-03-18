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

// const formatImageCollection = (imageCollection) => imageCollection.items;

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
