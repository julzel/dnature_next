import Blog from '../../features/Blog';
import { getPosts } from '../../services/posts';

export const revalidate = 120;

export const metadata = {
  title: 'Blog | Nutrición con conciencia',
  description:
    'Blog de DNAture: tips de nutrición, tenencia responsable y alimentación natural para mascotas.',
};

const BlogPage = async () => {
  let posts = [];

  try {
    posts = await getPosts();
  } catch (error) {
    console.error('Unable to load blog posts from Contentful:', error);
  }

  return <Blog posts={posts} />;
};

export default BlogPage;
