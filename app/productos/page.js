import Products from '../../features/Catalog';
import { getProductsWithDevelopmentPrices } from '../../features/Catalog/server';
import { createPageMetadata } from '../../constants/seo';

export const revalidate = 120;

export const metadata = createPageMetadata({
  title: 'Nuestros productos',
  description:
    'Explora los productos naturales DNAture para la alimentación de tu mascota.',
  path: '/productos',
});

const ProductsPage = async ({ searchParams }) => {
  const products = await getProductsWithDevelopmentPrices();
  const { category } = await searchParams;

  return <Products products={products} queryCategory={category} />;
};

export default ProductsPage;
