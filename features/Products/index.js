import React from "react";
import { useRouter } from "next/router";

// local imports
// components
import CatalogContainer from "./Catalog";

const Productos = ({ products }) => {
  const router = useRouter();
  const { category } = router.query;

  return <CatalogContainer queryCategory={category} products={products} />;
};

export default Productos;
