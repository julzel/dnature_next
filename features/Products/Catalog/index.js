import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

// local imports
// components
import Catalog from "./Catalog";

const defaultCategory = {
  label: "Todos los productos",
  id: "all",
};

const CatalogContainer = ({ queryCategory, products }) => {
  const router = useRouter();
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(
    queryCategory ? queryCategory : defaultCategory
  );
  const [filterOptions, setFilterOptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  const handleSuggestionSelect = useCallback(
    (product) => {
      setSearchQuery("");
      router.push({
        pathname: `/productos/${product.urlSlug}`,
        query: { id: product.sys.id },
      });
    },
    [router]
  );

  return (
    <Catalog
      filterOptions={filterOptions}
      selectedCategory={selectedCategory}
      categoriesList={categoriesList}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      suggestions={suggestions}
      onSuggestionSelect={handleSuggestionSelect}
    />
  );
};

export default CatalogContainer;
