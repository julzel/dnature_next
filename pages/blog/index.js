// local imports

// components
import Page from "../../components/Page";
import Blog from "../../features/Blog";
import { getPosts } from "../../services/posts";

export async function getStaticProps() {
  try {
    const posts = await getPosts();

    return {
      props: {
        posts,
      },
      revalidate: 120,
    };
  } catch (error) {
    console.error('Unable to load blog posts from Contentful:', error);

    return {
      props: { posts: [] },
      revalidate: 60,
    };
  }
}

export default function App({ posts }) {
  return (
    <Page title="DNAture - Blog">
      <Blog posts={posts} />
    </Page>
  );
}
