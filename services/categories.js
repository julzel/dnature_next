import { fetchFromContentful } from "./util";

const categoriesQuery = `
{
    categoryCollection {
        items {
            label
            image {
                title
                url
            }
            slug
        }
    }
}
`;

const getCategories = async () => {
  const data = await fetchFromContentful(categoriesQuery);
  return data.categoryCollection.items;
};

export { getCategories };
