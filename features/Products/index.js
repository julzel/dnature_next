'use client';

import React, { Suspense } from "react";
import { useRouter } from "next/compat/router";
import { useSearchParams } from "next/navigation";

// local imports
// components
import CatalogContainer from "./Catalog";

const ProductsContent = ({ products }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams?.get("category") || router?.query?.category;

  return <CatalogContainer queryCategory={category} products={products} />;
};

const ProductsLoading = () => <div aria-busy="true">Cargando productos…</div>;

const Productos = ({ products }) => (
  <Suspense fallback={<ProductsLoading />}>
    <ProductsContent products={products} />
  </Suspense>
);

export default Productos;
