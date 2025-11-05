import React from 'react';
import Page from '../../../components/Page';
import PostQueryResult from '../../../features/Blog/PostQueryResult';
import { getPostsByField } from '../../../services/posts';

export const metadata = {
  title: 'DNAture - Búsqueda de posts',
  description: 'Búsqueda de posts DNAture',
};

export default async function BusquedaPage({ searchParams }) {
  const params = await searchParams;
  const { field, value } = params;
  const posts = await getPostsByField(field, value);
  const query = { field, value };

  return (
    <Page>
      <PostQueryResult posts={posts} query={query} />
    </Page>
  );
}
