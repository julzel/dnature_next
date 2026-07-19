import Home from '../features/Home';
import { fallbackCategories, getCategories } from '../services/categories';
import { reportServerError } from '../services/monitoring';

export const revalidate = 3600;

const HomePage = async () => {
  let categories = fallbackCategories;

  try {
    categories = await getCategories();
  } catch (error) {
    await reportServerError(error, { source: 'home-categories' });
  }

  return <Home categories={categories} />;
};

export default HomePage;
