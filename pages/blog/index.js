// local imports

// components
import Page from "../../components/Page";
import Blog from "../../features/Blog";
import { getPosts } from "../../services/posts";

export async function getStaticProps() {
  const posts = await getPosts();
  return {
    props: {
      posts,
    },
  };
}

export default function App({ posts }) {
  return (
    <Page title="DNAture - Blog">
      <Blog posts={posts} />
    </Page>
  );
}
