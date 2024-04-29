// Import statements
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Box } from '@mui/material';
import { ShoppingCartItem } from '../../../models/shopping-cart'; // Local imports
import styles from './CatalogItem.module.scss'; // Styles
import { useCartContext } from '../../../contexts/shopping-cart-context'; // Context
import QuickAdd from '../../../components/QuickAdd'; // Components
import PresentationSelector, {
  convertObjectToArray,
} from '../../../components/PresentationSelector'; // Components

const DEFAULT_SIZE = '1kg';

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
  const [selectedPresentation, setSelectedPresentation] = useState(null);
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

  useEffect(() => {
    if (hasPriceByUnit) {
      const presentationArray = convertObjectToArray(preciosPorUnidad);
      setSelectedPresentation(
        presentationArray.find((p) => p.size === DEFAULT_SIZE)
      );
    }
  }, [hasPriceByUnit, preciosPorUnidad]);

  const itemsInCart = hasPriceByUnit && selectedPresentation ? getItemsInCart(`${id}-${selectedPresentation.size}`) : getItemsInCart(id);

  return (
    <Link
      key={id}
      passHref
      href={{ pathname: `/productos/${urlSlug}`, query: { id } }}
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
          <h3>{productName}</h3>
          {hasPriceByUnit ? (
            <p>
              ₡{selectedPresentation ? selectedPresentation.price : ''}{' '}
              {selectedPresentation && (
                <span> | {selectedPresentation.size}</span>
              )}
            </p>
          ) : (
            <p>
              ₡{precio} {medida && <span> | {medida}</span>}
            </p>
          )}

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
        </span>
      </span>
    </Link>
  );
};

export default CatalogItem;
