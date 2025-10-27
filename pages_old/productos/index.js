// local imports
import Page from "../../components/Page";
import Products from "../../features/Products";
import { getProducts } from "../../services/products";

export async function getStaticProps() {
  const products = await getProducts();

  return {
    props: {
      products,
    },
    revalidate: 120, // Optional: Time (in seconds) to re-generate the page in the background
  };
}

export default function ProductsPage({ products }) {
  return (
    <Page title="DNAture - Nuestros productos">
      <Products products={products} />
    </Page>
  );
}
