import Page from '../../../components/Page';
import Post from '../../../features/Blog/Post';

import { getPost } from '../../../services/posts';

export async function getServerSideProps({ params }) {
  const post = await getPost(params.post);
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
