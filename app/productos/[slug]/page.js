import { notFound } from 'next/navigation';

import Product from '../../../features/Product';
import formatProductDescription from '../../../features/Product/formatDescription';
import { getProductBySlug } from '../../../services/products';

export const revalidate = 120;

const getProduct = async (slug) => {
  const product = await getProductBySlug(slug);

  if (!product) {
    return null;
  }

  return {
    ...product,
    description: formatProductDescription(product.description),
  };
};

export const generateMetadata = async ({ params }) => {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {};
  }

  return {
    title: product.productName,
    description: product.ingredientes || `Conoce ${product.productName} de DNAture.`,
    openGraph: {
      images: product.images?.[0]
        ? [{ url: product.images[0].url, alt: product.images[0].title }]
        : [],
    },
  };
};

const ProductPage = async ({ params }) => {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return <Product productDetail={product} />;
};

export default ProductPage;
