import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// local imports
import { ShoppingCartItem } from '../../../models/shopping-cart';
// styles
import styles from './CatalogItem.module.scss';

// context
import { useCartContext } from '../../../contexts/shopping-cart-context';
import QuickAdd from '../../../components/QuickAdd';

const PresentationSelector = ({ presentations, handlePresentationSelect }) => (
  <select
    name="presentation"
    id="presentation-select"
    onChange={handlePresentationSelect} // Changed from onClick to onChange
    onClick={(e) => e.stopPropagation()}
  >
    {Object.entries(presentations).map(([size, price]) => (
      <option value={price} key={size}>{`${size} - $${price}`}</option>
    ))}
  </select>
);

const CatalogItem = ({ product }) => {
  const { sys: { id }, images, preciosPorUnidad, precio, productName, urlSlug, medida } = product; // Destructured for better readability
  const hasPriceByUnit = !!preciosPorUnidad;
  const [selectedPresentation, setSelectedPresentation] = useState(hasPriceByUnit ? preciosPorUnidad['1kg'] * 1 : null);
  const { addOneItem, removeOneItem, getItemsInCart } = useCartContext();
  const itemImage = images[0];

  const addItemToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newItem = new ShoppingCartItem(
      id,
      1,
      precio,
      productName,
      null
    );

    if (hasPriceByUnit) {
      newItem.price = selectedPresentation;
      newItem.id = `${id}-${selectedPresentation}`;
    }

    addOneItem(newItem);
  };

  const removeOneItemFromCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeOneItem(product.sys.id);
  };

  const handlePresentationSelect = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPresentation(e.target.value * 1); // Ensures the value is a number
  };

  const itemsInCart = getItemsInCart(id);

  return (
    <Link
      key={product.sys.id}
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
          {hasPriceByUnit && (
            <div>
              <PresentationSelector
                presentations={preciosPorUnidad}
                handlePresentationSelect={handlePresentationSelect}
              />
            </div>
          )}
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
