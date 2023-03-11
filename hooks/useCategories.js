import { useState, useEffect } from "react";
import { getCategories } from "../services/categories";

const useCategories = () => {
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getCategories();
        setCategories(categories);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return { categories, loading };
};

export default useCategories;
