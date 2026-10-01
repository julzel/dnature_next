import { fetchFromContentful } from './util';

const pricesQuery = `
  query getProductPrices($skip: Int!) {
    productCollection(limit: 1000, skip: $skip) {
      total
      items {
        sys { id }
        precio
        preciosPorUnidad
      }
    }
  }
`;

export const getProductPrices = async () => {
  const products = [];
  let skip = 0;
  let total;
  do {
    const { productCollection } = await fetchFromContentful(
      pricesQuery,
      { skip },
      { revalidate: 0 }
    );
    total = productCollection.total;
    if (!productCollection.items.length && skip < total) {
      throw new Error('Incomplete product prices.');
    }
    products.push(...productCollection.items.filter(Boolean));
    skip += productCollection.items.length;
  } while (skip < total);
  return products;
};
