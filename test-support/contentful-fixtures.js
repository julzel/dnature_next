const fixtureCategories = [
  {
    label: 'Recetas completas',
    slug: 'recetas',
    image: {
      title: 'Receta completa DNAture',
      url: '/images/category-diet.jpg',
    },
  },
  {
    label: 'Snacks',
    slug: 'snacks',
    image: {
      title: 'Snack natural DNAture',
      url: '/images/category-snack.jpg',
    },
  },
];

const fixtureProducts = {
  recetas: {
    label: 'Recetas completas',
    id: 'recetas',
    index: 1,
    products: [
      {
        productName: 'Receta de prueba',
        avifySku: 'AVIFY-RECETA-TEST',
        category: 'Recetas completas',
        categorySlug: 'recetas',
        urlSlug: 'receta-de-prueba',
        medida: '1 kg',
        precio: 5000,
        preciosPorUnidad: null,
        rating: 1,
        description: 'Una receta completa para probar el recorrido de compra.',
        ingredientes: 'Proteína, vegetales y suplemento natural de calcio.',
        images: [
          {
            title: 'Receta completa DNAture',
            url: '/images/category-diet.jpg',
          },
        ],
        iconos: [],
        sys: { id: 'fixture-recipe' },
      },
    ],
  },
  snacks: {
    label: 'Snacks',
    id: 'snacks',
    index: 0,
    products: [
      {
        productName: 'Snack de prueba',
        avifySku: 'AVIFY-SNACK-TEST',
        category: 'Snacks',
        categorySlug: 'snacks',
        urlSlug: 'snack-de-prueba',
        medida: '100 g',
        precio: 2500,
        preciosPorUnidad: null,
        rating: 1,
        description: 'Un snack natural para probar el filtro del catálogo.',
        ingredientes: 'Proteína deshidratada.',
        images: [
          {
            title: 'Snack natural DNAture',
            url: '/images/category-snack.jpg',
          },
        ],
        iconos: [],
        sys: { id: 'fixture-snack' },
      },
    ],
  },
};

const fixtureProductList = Object.values(fixtureProducts).flatMap(
  ({ products }) => products
);

const getFixtureProductBySlug = (slug) =>
  fixtureProductList.find((product) => product.urlSlug === slug) || null;

export { fixtureCategories, fixtureProducts, getFixtureProductBySlug };
