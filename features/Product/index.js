'use client';

import React, { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/compat/router";
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

const ProductItemContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams?.get("id") || router?.query?.id;

  // state
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // functions
  const fetchProduct = useCallback(async () => {
    if (productId) {
      const product = await getProduct(productId);
      product.description = formatDescription(product.description);
      setProductDetail(product);
      setLoading(false);
    }
  }, [productId]);

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

const ProductItemContainer = () => (
  <Suspense fallback={<Loading />}>
    <ProductItemContent />
  </Suspense>
);

export default ProductItemContainer;
