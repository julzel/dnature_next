'use client';

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

// local imports
// components
import CatalogContainer from "./Catalog";
import Loading from "../../components/Loading";

const ProductosContent = ({ products }) => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');

  return <CatalogContainer queryCategory={category} products={products} />;
};

const Productos = ({ products }) => {
  return (
    <Suspense fallback={<Loading />}>
      <ProductosContent products={products} />
    </Suspense>
  );
};

export default Productos;
