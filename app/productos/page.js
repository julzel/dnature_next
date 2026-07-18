import Products from '../../features/Products';
import { getProducts } from '../../services/products';

export const revalidate = 120;

export const metadata = {
  title: 'Nuestros productos',
  description:
    'Explora los productos naturales DNAture para la alimentación de tu mascota.',
  alternates: { canonical: '/productos' },
};

const ProductsPage = async ({ searchParams }) => {
  const products = await getProducts();
  const { category } = await searchParams;

  return <Products products={products} queryCategory={category} />;
};

export default ProductsPage;
