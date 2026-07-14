import Page from '../../../components/Page';
import PostQueryResult from '../../../features/Blog/PostQueryResult';

import { getPostsByField } from '../../../services/posts';

export async function getServerSideProps({ query }) {
  let posts = [];

  try {
    posts = await getPostsByField(query.field, query.value);
  } catch (error) {
    console.error('Unable to search blog posts in Contentful:', error);
  }

  return {
    props: { 
      posts,
      query,
    },
  };
}

const PostPage = ({ posts, query }) => {
  return (
    <Page>
      <PostQueryResult posts={posts} query={query} />
    </Page>
  );
};

export default PostPage;
