import React from 'react';
import Page from '../../Page';
import Post from '../../../features/Blog/Post';
import { getPost } from '../../../services/posts';

export const metadata = {
  title: 'DNAture - Blog Post',
  description: 'Blog post DNAture',
};

export default async function PostPage({ searchParams }) {
  const id = searchParams.id;
  const post = await getPost(id);

  return (
    <Page>
      <Post post={post} />
    </Page>
  );
}
