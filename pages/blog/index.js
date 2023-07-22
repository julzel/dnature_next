// local imports

// components
import Page from "../../components/Page";
import Blog from "../../features/Blog";
import { getPosts } from "../../services/posts";

export async function getStaticProps() {
  const posts = await getPosts();
  console.log(posts);
  return {
    props: {
      posts,
    },
  };
}

export default function App({ posts }) {
  return (
    <Page title="Calcula la porción ideal de comida para tu mascota">
      <Blog posts={posts} />
    </Page>
  );
}
