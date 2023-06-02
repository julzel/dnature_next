import React from "react";
import Image from "next/image";
import Link from "next/link";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
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
  const { addOneItem, cart } = useCartContext();

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
            <button onClick={addItemToCart}>
              <FontAwesomeIcon icon={faCirclePlus} />
            </button>
            {itemsInCart > 0 && (
              <Link passHref href="/cart">
                <a className={styles.badge}>{itemsInCart}</a>
              </Link>
            )}
          </div>
        </span>
      </span>
    </Link>
  );
};

export default CatalogItem;
