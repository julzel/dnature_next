import React from 'react';
import Page from '../../../components/Page';
import Product from '../../../features/Product';
import { getProduct } from '../../../services/products';
import JsonLd from '../../../components/JsonLd';
import { generateProductSchema, generateBreadcrumbSchema } from '../../../lib/seo';

export async function generateMetadata({ params, searchParams }) {
  const { product: productSlug } = params;
  const resolvedSearchParams = await searchParams;
  const productId = resolvedSearchParams?.id;
  
  // Fetch product data for metadata
  let product = null;
  if (productId) {
    try {
      product = await getProduct(productId);
    } catch (error) {
      console.error('Error fetching product for metadata:', error);
    }
  }

  const title = product?.productName || 'Detalle del producto';
  const description = product?.description?.replace(/<[^>]*>/g, '').substring(0, 160) || 
    'Descubre los detalles de nuestros productos de nutrición personalizada para mascotas.';
  const image = product?.images?.[0]?.url || '/images/dnatureproducts.jpg';

  return {
    title,
    description,
    openGraph: {
      title: `${title} | DNAture`,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | DNAture`,
      description,
      images: [image],
    },
    alternates: {
      canonical: `/productos/${productSlug}`,
    },
  };
}

export default async function ProductDetailPage({ params, searchParams }) {
  const { product: productSlug } = params;
  const resolvedSearchParams = await searchParams;
  const productId = resolvedSearchParams?.id;

  // Fetch product for structured data
  let product = null;
  let productSchema = null;
  if (productId) {
    try {
      product = await getProduct(productId);
      if (product) {
        productSchema = generateProductSchema(product);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: 'Productos', url: '/productos' },
    { name: product?.productName || 'Producto', url: `/productos/${productSlug}` },
  ]);

  return (
    <>
      {productSchema && (
        <JsonLd data={productSchema} id="product-schema" />
      )}
      <JsonLd data={breadcrumbSchema} id="breadcrumb-schema" />
      <Page title="DNAture - Detalle">
        <Product />
      </Page>
    </>
  );
}
