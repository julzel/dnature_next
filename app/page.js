import Home from '../features/Home';
import { fallbackCategories, getCategories } from '../services/categories';

export const revalidate = 3600;

const HomePage = async () => {
  let categories = fallbackCategories;

  try {
    categories = await getCategories();
  } catch (error) {
    console.error('Unable to load home categories from Contentful:', error);
  }

  return <Home categories={categories} />;
};

export default HomePage;
