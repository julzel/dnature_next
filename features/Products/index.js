'use client';

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

// local imports
// components
import CatalogContainer from "./Catalog";

const ProductsContent = ({ products }) => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");

  return <CatalogContainer queryCategory={category} products={products} />;
};

const ProductsLoading = () => <div aria-busy="true">Cargando productos…</div>;

const Productos = ({ products }) => (
  <Suspense fallback={<ProductsLoading />}>
    <ProductsContent products={products} />
  </Suspense>
);

export default Productos;
