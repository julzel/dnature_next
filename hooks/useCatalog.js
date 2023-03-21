// hooks/useCatalog.js
import { useState, useEffect, useCallback } from "react";
import { getProducts } from "../services/products";

const defaultOption = {
  label: "Todos los productos",
  id: "all",
};

export const useCatalog = () => {
  const [loading, setLoading] = useState(true);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterOptions, setFilterOptions] = useState([]);

  const handleSelectedCategoryChange = useCallback(
    (category) => {
      if (category !== "all") {
        setSelectedCategory(categoriesList.find((c) => c.id === category));
      } else {
        setSelectedCategory(category);
      }
    },
    [categoriesList]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const catalogData = await getProducts();
        const categories = Object.values(catalogData).sort(
          (a, b) => a.index - b.index
        );
        setCategoriesList(categories);
        setFilterOptions([
          defaultOption,
          ...categories.map(({ label, id }) => ({ label, id })),
        ]);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return {
    loading,
    categoriesList,
    selectedCategory,
    filterOptions,
    handleSelectedCategoryChange,
  };
};

export default useCatalog;
