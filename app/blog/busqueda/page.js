import React from 'react';
import Page from '../../../components/Page';
import PostQueryResult from '../../../features/Blog/PostQueryResult';
import { getPostsByField } from '../../../services/posts';
import JsonLd from '../../../components/JsonLd';
import { generateBreadcrumbSchema } from '../../../lib/seo';

export const metadata = {
  title: 'Búsqueda de artículos',
  description: 'Explora nuestros artículos sobre nutrición natural, cuidado y bienestar para mascotas.',
  openGraph: {
    title: 'Blog DNAture - Búsqueda de artículos',
    description: 'Artículos sobre nutrición natural y cuidado de mascotas',
    images: [
      {
        url: '/images/blog/hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog DNAture',
      },
    ],
  },
  alternates: {
    canonical: '/blog/busqueda',
  },
};

export default async function BusquedaPage({ searchParams }) {
  const params = await searchParams;
  const { field, value } = params;
  const posts = await getPostsByField(field, value);
  const query = { field, value };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: 'Búsqueda', url: '/blog/busqueda' },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} id="breadcrumb-schema" />
      <Page>
        <PostQueryResult posts={posts} query={query} />
      </Page>
    </>
  );
}
