'use client';

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// local imports
// services
import { getProduct } from "../../services/products";

// components
import Loading from "../../components/Loading";
import ProductItem from "./ProductItem/ProductItem";

const NEW_LINE = "<br />";
const SPAN = "</span>";

const formatDescription = (description) => {
  if (description) {
    return description
      .replaceAll("-", `${NEW_LINE}- `)
      .replaceAll("_", "<span>")
      .replaceAll("%", `%${SPAN}${NEW_LINE}`)
      .replace("@", `${NEW_LINE}${NEW_LINE}<div>`)
      .replace("@", "<div>");
  }
  return "";
};

const ProductItemContainer = () => {
  const searchParams = useSearchParams();

  // state
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // functions
  const fetchProduct = useCallback(async () => {
    const id = searchParams.get('id');
    if (id) {
      const product = await getProduct(id);
      product.description = formatDescription(product.description);
      setProductDetail(product);
      setLoading(false);
    }
  }, [searchParams]);

  // state updates
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return <Loading />;
  }
  return (
    <ProductItem productDetail={productDetail} />
  );
};

export default function Product() {
  return (
    <Suspense fallback={<Loading />}>
      <ProductItemContainer />
    </Suspense>
  );
}
