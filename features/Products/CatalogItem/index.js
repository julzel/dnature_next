import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// local imports
import { ShoppingCartItem } from '../../../models/shopping-cart';
// styles
import styles from './CatalogItem.module.scss';

// context
import { useCartContext } from '../../../contexts/shopping-cart-context';
import QuickAdd from '../../../components/QuickAdd';

const CatalogItem = ({ product }) => {
  const { images } = product;
  const itemImage = images[0];
  const { addOneItem, removeOneItem, getItemsInCart } = useCartContext();

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
    removeOneItem(product.sys.id);
  };

  const itemsInCart = getItemsInCart(product.sys.id);

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
            width='100%'
            height='100%'
            layout='responsive'
            objectFit='contain'
          />
        </span>
        <span className={styles.catalogItemDetails}>
          <h3>{product.productName}</h3>
          <p>
            ₡{product.precio}{' '}
            {product.medida && <span> | {product.medida}</span>}
          </p>
          <QuickAdd
            removeOneItemFromCart={removeOneItemFromCart}
            addItemToCart={addItemToCart}
            itemsInCart={itemsInCart}
          />
        </span>
      </span>
    </Link>
  );
};

export default CatalogItem;
