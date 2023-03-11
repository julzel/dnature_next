import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

// local imports
// services
import { getProduct } from "../../services/products";

// contexts
import { useCartContext } from "../../contexts/shopping-cart-context";

// components
import Loading from "../../components/Loading";
import ProductItem from "./ProductItem/ProductItem";
import { ShoppingCartItem } from "../../models/shopping-cart";

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

  // cart context
  const { addItem } = useCartContext();

  // state
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // handlers
  const handleAddToCart = (item, quantity, presentation) => {
    // Create a new item object with the properties we need
    const newItem = new ShoppingCartItem(
      item.sys.id,
      +quantity,
      item.precio,
      item.productName,
      presentation
        ? [{
            description: presentation.label,
            quantity: (quantity * 1000) / presentation.value,
          }]
        : null,
    );

    addItem(newItem);
  };

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
    <ProductItem productDetail={productDetail} addToCart={handleAddToCart} />
  );
};

export default ProductItemContainer;
