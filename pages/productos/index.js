// local imports
import Page from "../../components/Page";
import Products from "../../features/Products";
import { getProducts } from "../../services/products";

export async function getStaticProps() {
  try {
    const products = await getProducts();

    return {
      props: {
        products,
      },
      revalidate: 120,
    };
  } catch (error) {
    console.error('Unable to load products from Contentful:', error);

    return {
      props: { products: {} },
      revalidate: 60,
    };
  }
}

export default function ProductsPage({ products }) {
  return (
    <Page title="DNAture - Nuestros productos">
      <Products products={products} />
    </Page>
  );
}
