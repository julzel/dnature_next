'use client';

import { useMemo, useState } from "react";

// local imports
// components
import Catalog from "./Catalog";

const defaultCategory = {
  label: "Todos los productos",
  id: "all",
};

const CatalogContainer = ({ queryCategory, products }) => {
  const [searchQuery, setSearchQuery] = useState("");

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

  const allProducts = useMemo(() => {
    return Object.values(products || {}).reduce((acc, category) => {
      if (category?.products?.length) {
        return acc.concat(category.products);
      }
      return acc;
    }, []);
  }, [products]);

  const suggestions = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) {
      return [];
    }

    return allProducts
      .filter((product) =>
        product.productName.toLowerCase().includes(trimmedQuery)
      )
      .slice(0, 8);
  }, [allProducts, searchQuery]);

  return (
    <Catalog
      filterOptions={filterOptions}
      selectedCategory={selectedCategory}
      categoriesList={categoriesList}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      suggestions={suggestions}
    />
  );
};

export default CatalogContainer;
