'use client';

import React from "react";
import { useSearchParams } from "next/navigation";

// local imports
// components
import CatalogContainer from "./Catalog";

const Productos = ({ products }) => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  return <CatalogContainer queryCategory={category} products={products} />;
};

export default Productos;
