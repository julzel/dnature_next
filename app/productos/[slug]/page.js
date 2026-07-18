import { notFound, permanentRedirect } from 'next/navigation';

import Product from '../../../features/Product';
import formatProductDescription from '../../../features/Product/formatDescription';
import { getProductBySlug } from '../../../services/products';
import { getProductPath, normalizeProductSlug } from '../../../util/product-url';

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
  const { slug: rawSlug } = await params;
  const slug = normalizeProductSlug(rawSlug);

  if (!slug) {
    return {};
  }

  const product = await getProduct(slug);

  if (!product) {
    return {};
  }

  return {
    title: product.productName,
    description: product.ingredientes || `Conoce ${product.productName} de DNAture.`,
    alternates: { canonical: getProductPath(slug) },
    openGraph: {
      url: getProductPath(slug),
      images: product.images?.[0]
        ? [{ url: product.images[0].url, alt: product.images[0].title }]
        : [],
    },
  };
};

const ProductPage = async ({ params }) => {
  const { slug: rawSlug } = await params;
  const slug = normalizeProductSlug(rawSlug);

  if (!slug) {
    notFound();
  }

  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  if (rawSlug !== slug) {
    permanentRedirect(getProductPath(slug));
  }

  return <Product productDetail={product} />;
};

export default ProductPage;
