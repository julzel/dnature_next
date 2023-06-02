import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

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
  const router = useRouter();

  // state
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // functions
  const fetchProduct = useCallback(async () => {
    const { query } = router;
    if (query.id) {
      const product = await getProduct(query.id);
      product.description = formatDescription(product.description);
      setProductDetail(product);
      setLoading(false);
    }
  }, [router]);

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

export default ProductItemContainer;
