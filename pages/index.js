// local imports
import Page from "../components/Page";
import Home from "../features/Home";
import { getCategories } from "../services/categories";

export async function getStaticProps() {
  const categories = await getCategories();

  return {
    props: {
      categories,
    },
    revalidate: 120, // Optional: Time (in seconds) to re-generate the page in the background
  };
}

export default function HomePage({ categories }) {
  return (
    <Page>
      <Home categories={categories} />
    </Page>
  );
}
