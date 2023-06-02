import React from "react";
import Image from "next/image";
import Link from "next/link";
import { faCirclePlus, faCircleMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// local imports
import { ShoppingCartItem } from "../../../models/shopping-cart";
// styles
import styles from "./CatalogItem.module.scss";

// context
import { useCartContext } from "../../../contexts/shopping-cart-context";

const CatalogItem = ({ product }) => {
  const { images } = product;
  const itemImage = images[0];
  const { addOneItem, removeOneItem, cart } = useCartContext();

  const getItemsInCart = (cart) => {
    const itemInCart = cart.items.find((item) => item.id === product.sys.id);
    return itemInCart ? itemInCart.quantity : "";
  };

  const addItemToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newItem = new ShoppingCartItem(
      product.sys.id,
      1,
      product.precio,
      product.productName,
      null
    );
    addOneItem(newItem);
  };

  const removeOneItemFromCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const item = new ShoppingCartItem(
      product.sys.id,
      1,
      product.precio,
      product.productName,
      null
    );
    removeOneItem(item);
  };

  const itemsInCart = getItemsInCart(cart);

  return (
    <Link
      passHref
      href={{
        pathname: `/productos/${product.urlSlug}`,
        query: { id: product.sys.id },
      }}
    >
      <span className={styles.catalogItem}>
        <span className={styles.catalogItemImages}>
          <Image
            src={itemImage.url}
            alt={itemImage.title}
            width="100%"
            height="100%"
            layout="responsive"
            objectFit="contain"
          />
        </span>
        <span className={styles.catalogItemDetails}>
          <h3>{product.productName}</h3>
          <p>
            ₡{product.precio}{" "}
            {product.medida && <span> | {product.medida}</span>}
          </p>
          <div className={styles.quickAdd}>
            {itemsInCart > 0 && (
              <>
                <button
                  className={styles.light}
                  onClick={removeOneItemFromCart}
                >
                  <FontAwesomeIcon icon={faCircleMinus} />
                </button>
                <span className={styles.badge}>{itemsInCart}</span>
              </>
            )}
            <button onClick={addItemToCart}>
              <FontAwesomeIcon icon={faCirclePlus} />
            </button>
          </div>
        </span>
      </span>
    </Link>
  );
};

export default CatalogItem;
