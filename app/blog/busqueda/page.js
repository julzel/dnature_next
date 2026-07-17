import PostQueryResult from '../../../features/Blog/PostQueryResult';
import { getPostsByField } from '../../../services/posts';

export const revalidate = 120;

export const metadata = {
  title: 'Resultados de búsqueda',
  description: 'Resultados de búsqueda del blog de DNAture.',
  alternates: { canonical: '/blog/busqueda' },
  robots: { index: false, follow: true },
};

const SEARCH_FIELDS = new Set(['category', 'hashtags_contains_some']);

const readSearchQuery = (searchParams) => {
  const field = typeof searchParams.field === 'string' ? searchParams.field : '';
  const value = typeof searchParams.value === 'string' ? searchParams.value.trim() : '';

  return SEARCH_FIELDS.has(field) && value ? { field, value } : {};
};

const BlogSearchPage = async ({ searchParams }) => {
  const query = readSearchQuery(await searchParams);
  let posts = [];

  if (query.field) {
    try {
      posts = await getPostsByField(query.field, query.value);
    } catch (error) {
      console.error('Unable to search blog posts in Contentful:', error);
    }
  }

  return <PostQueryResult posts={posts} query={query} />;
};

export default BlogSearchPage;
