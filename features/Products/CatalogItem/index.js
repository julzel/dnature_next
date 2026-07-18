// Import statements
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box } from '@mui/material';
import { ShoppingCartItem } from '../../../models/shopping-cart'; // Local imports
import styles from './CatalogItem.module.scss'; // Styles
import { useCartContext } from '../../../contexts/shopping-cart-context'; // Context
import QuickAdd from '../../../components/QuickAdd'; // Components
import PresentationSelector, {
  getDefaultPresentation,
} from '../../../components/PresentationSelector'; // Components
import CurrencyText from '../../../components/Currency';
import { getProductPath } from '../../../util/product-url';

const CatalogItem = ({ product }) => {
  const {
    sys: { id },
    images,
    preciosPorUnidad,
    precio,
    productName,
    urlSlug,
    medida,
  } = product;
  const hasPriceByUnit = !!preciosPorUnidad;
  const [selectedPresentation, setSelectedPresentation] = useState(() =>
    getDefaultPresentation(preciosPorUnidad, productName)
  );
  const { addOneItem, removeOneItem, getItemsInCart } = useCartContext();
  const itemImage = images[0];

  const handlePresentationSelect = (selected) => {
    setSelectedPresentation(selected); // Now expects the whole selected object
  };

  const addItemToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newItem = new ShoppingCartItem(id, 1, precio, productName, null);
    if (hasPriceByUnit && selectedPresentation) {
      newItem.price = parseFloat(selectedPresentation.price);
      newItem.id = `${id}-${selectedPresentation.size}`;
      newItem.productName = `${productName} ${selectedPresentation.size}`;
    }
    addOneItem(newItem);
  };

  const removeOneItemFromCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasPriceByUnit && selectedPresentation) {
      removeOneItem(`${id}-${selectedPresentation.size}`);
    } else {
      removeOneItem(id);
    }
  };

  const itemsInCart =
    hasPriceByUnit && selectedPresentation
      ? getItemsInCart(`${id}-${selectedPresentation.size}`)
      : getItemsInCart(id);

  const productPath = getProductPath(urlSlug);

  if (!productPath) {
    return null;
  }

  return (
    <article className={styles.catalogItem}>
      <Link href={productPath} className={styles.productLink} aria-label={`Ver ${productName}`}>
        {itemImage && (
          <span className={styles.catalogItemImages}>
            <Image
              src={itemImage.url}
              alt={itemImage.title}
              width={100}
              height={100}
              sizes='(min-width: 1024px) 25vw, (min-width: 600px) 50vw, 100vw'
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </span>
        )}
        <span className={styles.catalogItemDetails}>
          <h3>{productName}</h3>
          {hasPriceByUnit ? (
            <p>
              {selectedPresentation ? (
                <CurrencyText value={selectedPresentation.price} />
              ) : (
                ''
              )}{' '}
              {selectedPresentation && (
                <span> | {selectedPresentation.size}</span>
              )}
            </p>
          ) : (
            <p>
              <CurrencyText value={precio} />{' '}
              {medida && <span> | {medida}</span>}
            </p>
          )}
        </span>
      </Link>
      {hasPriceByUnit && (
        <Box my={2} width='100%'>
          <PresentationSelector
            presentations={preciosPorUnidad}
            selectedPresentation={selectedPresentation}
            onPresentationSelect={handlePresentationSelect}
          />
        </Box>
      )}
      <QuickAdd
        removeOneItemFromCart={removeOneItemFromCart}
        addItemToCart={addItemToCart}
        itemsInCart={itemsInCart}
      />
    </article>
  );
};

export default CatalogItem;
