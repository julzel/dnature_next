import Page from '../../../../components/Page';
import PostListByTag from '../../../../features/Blog/Tags';

import { getPostsByHashtag } from '../../../../services/posts';

export async function getServerSideProps({ params }) {
  const posts = await getPostsByHashtag(params.tag);
  return {
    props: { 
      posts,
      tag: params.tag,
    },
  };
}

const PostPage = ({ posts, tag }) => {
  return (
    <Page>
      <PostListByTag posts={posts} tag={tag} />
    </Page>
  );
};

export default PostPage;
