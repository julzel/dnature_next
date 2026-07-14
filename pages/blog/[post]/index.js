import Page from '../../../components/Page';
import Post from '../../../features/Blog/Post';

import { getPost } from '../../../services/posts';

export async function getServerSideProps({ query }) {
  try {
    const post = await getPost(query.id);

    if (!post) {
      return { notFound: true };
    }

    return {
      props: { post },
    };
  } catch (error) {
    console.error('Unable to load blog post from Contentful:', error);

    return { notFound: true };
  }

}

const PostPage = ({ post }) => {
  return (
    <Page>
      <Post post={post} />
    </Page>
  );
};

export default PostPage;
