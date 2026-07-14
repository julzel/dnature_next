// local imports
import Page from "../components/Page";
import Home from "../features/Home";
import { fallbackCategories, getCategories } from "../services/categories";

export async function getStaticProps() {
  try {
    const categories = await getCategories();

    return {
      props: {
        categories,
      },
      revalidate: 120,
    };
  } catch (error) {
    console.error('Unable to load home categories from Contentful:', error);

    return {
      props: { categories: fallbackCategories },
      revalidate: 60,
    };
  }
}

export default function HomePage({ categories = [] }) {
  return (
    <Page>
      <Home categories={categories} />
    </Page>
  );
}
