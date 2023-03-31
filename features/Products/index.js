import React from "react";
import { useRouter } from "next/router";

// local imports
// components
import Catalog from "./Catalog";

const Productos = ({ products }) => {
  const router = useRouter();
  const { category } = router.query;

  return <Catalog queryCategory={category} products={products} />;
};

export default Productos;
