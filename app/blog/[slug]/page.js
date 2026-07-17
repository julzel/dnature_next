import { notFound } from 'next/navigation';

import Post from '../../../features/Blog/Post';
import { getPostBySlug } from '../../../services/posts';

export const revalidate = 120;

const getPost = async (slug) => {
  try {
    return await getPostBySlug(slug);
  } catch (error) {
    console.error('Unable to load blog post from Contentful:', error);
    return null;
  }
};

export const generateMetadata = async ({ params }) => {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt || `Lee ${post.title} en el blog de DNAture.`,
    openGraph: {
      images: post.media?.url
        ? [{ url: post.media.url, alt: post.title }]
        : [],
    },
  };
};

const BlogPostPage = async ({ params }) => {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return <Post post={post} />;
};

export default BlogPostPage;
