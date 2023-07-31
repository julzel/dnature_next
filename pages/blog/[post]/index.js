import Page from '../../../components/Page';
import Post from '../../../features/Blog/Post';

import { getPost } from '../../../services/posts';

export async function getServerSideProps({ query }) {
  const post = await getPost(query.id);
  return {
    props: { post },
  };
}

const PostPage = ({ post }) => {
  return (
    <Page>
      <Post post={post} />
    </Page>
  );
};

export default PostPage;
