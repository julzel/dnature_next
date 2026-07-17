import { fetchFromContentful } from "./util";

const fallbackCategories = [
  {
    label: "Recetas completas",
    image: {
      title: "Receta completa de carne cruda",
      url: "/images/category-diet.jpg",
    },
    slug: "recetas",
  },
  {
    label: "Proteínas",
    image: {
      title: "Trozos de carne",
      url: "/images/category-proteins.jpg",
    },
    slug: "proteinas",
  },
  {
    label: "Snacks",
    image: {
      title: "Snacks naturales para mascotas",
      url: "/images/category-snack.jpg",
    },
    slug: "snacks",
  },
  {
    label: "Suplementos",
    image: {
      title: "Suplementos naturales para mascotas",
      url: "/images/category-suplement.jpg",
    },
    slug: "suplementos",
  },
];

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

const normalizeCategories = (data) => {
  const items = data?.categoryCollection?.items;

  if (!Array.isArray(items)) {
    return [];
  }

  const categoriesBySlug = new Map();
  const cleanText = (value) =>
    typeof value === "string" ? value.trim() : "";

  items.forEach((category) => {
    const label = cleanText(category?.label);
    const slug = cleanText(category?.slug);
    const imageUrl = cleanText(category?.image?.url);

    if (!label || !slug || !imageUrl || categoriesBySlug.has(slug)) {
      return;
    }

    categoriesBySlug.set(slug, {
      label,
      slug,
      image: {
        title: cleanText(category.image.title) || label,
        url: imageUrl,
      },
    });
  });

  return Array.from(categoriesBySlug.values());
};

const withFallbackCategories = (data) => {
  const categories = normalizeCategories(data);
  const loadedSlugs = new Set(categories.map(({ slug }) => slug));

  return [
    ...categories,
    ...fallbackCategories.filter(({ slug }) => !loadedSlugs.has(slug)),
  ];
};

const getCategories = async () => {
  try {
    const data = await fetchFromContentful(categoriesQuery, undefined, {
      revalidate: 3600,
      tags: ['categories'],
    });
    const categories = normalizeCategories(data);

    return categories.length ? categories : fallbackCategories;
  } catch (error) {
    const partialData = error?.response?.data;

    console.error(
      "Unable to fully load home categories from Contentful; using available fallback content:",
      error
    );

    return withFallbackCategories(partialData);
  }
};

export { fallbackCategories, getCategories, normalizeCategories };
