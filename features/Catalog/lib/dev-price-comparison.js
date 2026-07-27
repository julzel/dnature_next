const addDevelopmentPriceComparison = (
  categories,
  avifyProducts = []
) => {
  const avifyPricesBySku = new Map(
    avifyProducts
      .filter(
        (product) =>
          typeof product?.sku === 'string' &&
          Number.isFinite(product?.price)
      )
      .map((product) => [product.sku.trim(), product.price])
  );

  return Object.fromEntries(
    Object.entries(categories || {}).map(([categoryId, category]) => [
      categoryId,
      {
        ...category,
        products: (category.products || []).map((product) => ({
          ...product,
          developmentPriceComparison: {
            avifyPrice:
              avifyPricesBySku.get(product.avifySku?.trim()) ?? null,
          },
        })),
      },
    ])
  );
};

const getCatalogAvifySkus = (categories) => [
  ...new Set(
    Object.values(categories || {})
      .flatMap((category) => category.products || [])
      .map((product) => product.avifySku?.trim())
      .filter(Boolean)
  ),
];

export { addDevelopmentPriceComparison, getCatalogAvifySkus };
