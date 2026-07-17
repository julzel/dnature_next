import Products from '../../features/Products';
import { getProducts } from '../../services/products';

export const revalidate = 120;

export const metadata = {
  title: 'Nuestros productos',
  description:
    'Explora los productos naturales DNAture para la alimentación de tu mascota.',
  alternates: { canonical: '/productos' },
};

const ProductsPage = async () => {
  let products = {};

  try {
    products = await getProducts();
  } catch (error) {
    console.error('Unable to load products from Contentful:', error);
  }

  return <Products products={products} />;
};

export default ProductsPage;
