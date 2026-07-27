// Import statements
import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import {
  ShoppingCartItem,
  useCartContext,
} from '../../Cart/state'; // Feature API
import styles from './CatalogItem.module.scss'; // Styles
import ContentfulImage from '../../../components/ContentfulImage';
import CurrencyText from '../../../components/Currency';
import { getProductPath } from '../lib/product-url';

const CatalogItem = ({ product }) => {
  const {
    sys: { id },
    images,
    preciosPorUnidad,
    precio,
    productName,
    avifySku,
    urlSlug,
    medida,
    category,
    developmentPriceComparison,
  } = product;
  const hasPriceByUnit = !!preciosPorUnidad;
  const [quantity, setQuantity] = useState(1);
  const { addItems, getItemsInCart } = useCartContext();
  const itemImage = images[0];
  const presentationPrices = Object.values(preciosPorUnidad || {})
    .map(Number)
    .filter(Number.isFinite);
  const lowestPresentationPrice = presentationPrices.length
    ? Math.min(...presentationPrices)
    : null;
  const displayPrice =
    hasPriceByUnit && lowestPresentationPrice !== null
      ? lowestPresentationPrice
      : precio;

  const addItemToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const newItem = new ShoppingCartItem(
      id,
      quantity,
      precio,
      productName
    );
    addItems(newItem);
    setQuantity(1);
  };

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const increaseQuantity = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
  };

  const itemsInCart = getItemsInCart(id);

  const productPath = getProductPath(urlSlug);

  if (!productPath) {
    return null;
  }

  return (
    <article className={styles.catalogItem}>
      <Link
        href={productPath}
        className={styles.imageLink}
        aria-label={`Ver ${productName}`}
      >
        {itemImage && (
          <span className={styles.catalogItemImages}>
            <ContentfulImage
              src={itemImage.url}
              alt={itemImage.title}
              width={100}
              height={100}
              sizes='(min-width: 1024px) 25vw, (min-width: 600px) 50vw, 100vw'
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </span>
        )}
      </Link>
      <div className={styles.catalogItemDetails}>
        <p className={styles.category}>{category}</p>
        <Link href={productPath} className={styles.productName}>
          {productName}
        </Link>
        {avifySku && <p className={styles.sku}>SKU: {avifySku}</p>}
        {developmentPriceComparison ? (
          <p className={styles.price} aria-label={`Precio de ${productName}`}>
            {Number.isFinite(developmentPriceComparison.avifyPrice) ? (
              <CurrencyText value={developmentPriceComparison.avifyPrice} />
            ) : (
              <span className={styles.priceUnavailable}>No disponible</span>
            )}
          </p>
        ) : (
          <p className={styles.price}>
            {hasPriceByUnit && lowestPresentationPrice !== null ? 'Desde ' : ''}
            <CurrencyText value={displayPrice} />
          </p>
        )}
        <p className={styles.presentation}>
          {hasPriceByUnit
            ? 'Elige una presentación'
            : medida || 'Presentación disponible'}
        </p>
        <div className={styles.cardFooter}>
          {hasPriceByUnit ? (
            <Link href={productPath} className={styles.optionsLink}>
              Ver opciones
            </Link>
          ) : (
            <>
              <div className={styles.quantityControl}>
                <button
                  type='button'
                  aria-label={`Disminuir cantidad de ${productName}`}
                  disabled={quantity === 1}
                  onClick={decreaseQuantity}
                >
                  <Minus aria-hidden='true' size={18} strokeWidth={2.2} />
                </button>
                <output
                  role='status'
                  aria-label={`Cantidad de ${productName}`}
                  aria-live='polite'
                >
                  {quantity}
                </output>
                <button
                  type='button'
                  aria-label={`Aumentar cantidad de ${productName}`}
                  onClick={increaseQuantity}
                >
                  <Plus aria-hidden='true' size={19} strokeWidth={2.2} />
                </button>
              </div>
              <button
                type='button'
                className={styles.addButton}
                aria-label={`Agregar ${quantity} ${
                  quantity === 1 ? 'unidad' : 'unidades'
                } de ${productName} al carrito`}
                onClick={addItemToCart}
              >
                <ShoppingBag aria-hidden='true' size={19} strokeWidth={2} />
                <span>Agregar al carrito</span>
              </button>
            </>
          )}
          {itemsInCart > 0 && (
            <span className={styles.inCart}>{itemsInCart} en carrito</span>
          )}
        </div>
      </div>
    </article>
  );
};

export default CatalogItem;
