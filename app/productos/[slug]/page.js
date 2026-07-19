import { unstable_cache } from 'next/cache';
import { notFound, permanentRedirect } from 'next/navigation';

import Product, {
  formatProductDescription,
} from '../../../features/Catalog/product-page';
import { createPageMetadata } from '../../../constants/seo';
import {
  getProductBySlug,
  getProductPath,
  normalizeProductSlug,
} from '../../../features/Catalog/server';

export const revalidate = 120;

const getProduct = unstable_cache(
  async (slug) => {
    const product = await getProductBySlug(slug);

    if (!product) {
      return null;
    }

    return {
      ...product,
      description: formatProductDescription(product.description),
    };
  },
  ['product-page'],
  {
    revalidate,
    tags: ['products'],
  }
);

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

  const image = product.images?.[0];

  return createPageMetadata({
    title: product.productName,
    description: product.ingredientes || `Conoce ${product.productName} de DNAture.`,
    path: getProductPath(slug),
    image: image?.url,
    imageAlt: image?.title || product.productName,
  });
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
