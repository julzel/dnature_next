'use client';

import { useMemo } from 'react';

// local imports
// components
import Catalog from "./Catalog";

const defaultCategory = {
  label: 'Todos los productos',
  id: 'all',
};

const CatalogContainer = ({ queryCategory, products }) => {
  const categoriesList = useMemo(
    () => Object.values(products || {}).sort((a, b) => a.index - b.index),
    [products]
  );

  const filterOptions = useMemo(
    () => [
      defaultCategory,
      ...categoriesList.map(({ label, id }) => ({ label, id })),
    ],
    [categoriesList]
  );

  const selectedCategory = useMemo(() => {
    if (!queryCategory) {
      return defaultCategory;
    }

    return categoriesList.find((category) => category.id === queryCategory) || defaultCategory;
  }, [categoriesList, queryCategory]);

  const allProducts = useMemo(
    () => categoriesList.flatMap((category) => category.products || []),
    [categoriesList]
  );

  const visibleProducts = useMemo(() => {
    if (selectedCategory.id === defaultCategory.id) {
      return allProducts;
    }

    return selectedCategory.products || [];
  }, [allProducts, selectedCategory]);

  return (
    <Catalog
      filterOptions={filterOptions}
      selectedCategory={selectedCategory}
      products={visibleProducts}
      totalCount={visibleProducts.length}
    />
  );
};

export default CatalogContainer;
