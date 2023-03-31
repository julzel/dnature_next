import React, { useState, useCallback, useEffect } from "react";

// local imports
// components
import Catalog from "./Catalog";

const defaultCategory = {
  label: "Todos los productos",
  id: "all",
};

const CatalogContainer = ({ queryCategory, products }) => {
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    queryCategory ? queryCategory : defaultCategory
  );
  const [filterOptions, setFilterOptions] = useState([]);

  const handleSelectedCategoryChange = useCallback(
    (categoryId) => {
      if (categoryId !== "all") {
        setSelectedCategory(categoriesList.find((c) => c.id === categoryId));
      } else {
        setSelectedCategory(defaultCategory);
      }
    },
    [categoriesList]
  );

  useEffect(() => {
    const categories = Object.values(products).sort(
      (a, b) => a.index - b.index
    );
    setCategoriesList(categories);
    setFilterOptions([
      defaultCategory,
      ...categories.map(({ label, id }) => ({ label, id })),
    ]);
  }, [products]);

  useEffect(() => {
    if (queryCategory) {
      handleSelectedCategoryChange(queryCategory);
    }
  }, [queryCategory, handleSelectedCategoryChange]);

  return (
    <Catalog
      filterOptions={filterOptions}
      handleSelectedCategoryChange={handleSelectedCategoryChange}
      selectedCategory={selectedCategory}
      categoriesList={categoriesList}
    />
  );
};

export default CatalogContainer;
