import React from 'react';
import Page from '../../components/Page';
import Blog from '../../features/Blog';
import { getPosts } from '../../services/posts';

export const metadata = {
  title: 'DNAture - Blog',
  description: 'Blog DNAture',
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <Page title="DNAture - Blog">
      <Blog posts={posts} />
    </Page>
  );
}
