import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";

// local imports
// services
import { getProduct } from "../../services/products";

// contexts
import { useShoppingCartContext } from "../../contexts/shopping-cart-context";

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

  // cart context
  const { cart, updateCart } = useShoppingCartContext();

  // state
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // handlers
  const handleBuyItem = (item, qty, presentation) => {
    console.log({presentation})
    // Create a new item object with the properties we need
    const newItem = {
      id: item.sys.id,
      quantity: +qty,
      price: item.precio,
      productName: item.productName,
      containers: presentation
        ? [{
            description: presentation.label,
            quantity: (qty * 1000) / presentation.value,
          }]
        : null,
    };

    // Find the index of the existing item with the same ID in the items array, or -1
    // if it doesn't exist.
    const itemIndex = cart.items.findIndex(
      (cartItem) => cartItem.id === newItem.id
    );

    // If an existing item was found, create a new array that replaces it
    // with a new item that has the same properties, except for the updated
    // quantity value. Else, add the new item to the end of the items array.
    const updatedItems =
      itemIndex !== -1
        ? [
            ...cart.items.slice(0, itemIndex),
            {
              ...cart.items[itemIndex],
              quantity: cart.items[itemIndex].quantity + newItem.quantity,
              containers: [...cart.items[itemIndex].containers, ...newItem.containers]
            },
            ...cart.items.slice(itemIndex + 1),
          ]
        : [...cart.items, newItem];

    // Update the cart state with a new object that has the updated items array.
    updateCart({
      ...cart,
      items: updatedItems,
    });
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
    <ProductItem productDetail={productDetail} onBuyItem={handleBuyItem} />
  );
};

export default ProductItemContainer;
