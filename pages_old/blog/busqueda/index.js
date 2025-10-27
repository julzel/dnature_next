import Page from '../../../components/Page';
import PostQueryResult from '../../../features/Blog/PostQueryResult';

import { getPostsByField } from '../../../services/posts';

export async function getServerSideProps({ query }) {
  const posts = await getPostsByField(query.field, query.value);
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
