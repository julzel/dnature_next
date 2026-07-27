// Import statements
import Link from 'next/link';
import { Minus, Plus } from 'lucide-react';
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
    urlSlug,
    medida,
    category,
    developmentPriceComparison,
  } = product;
  const hasPriceByUnit = !!preciosPorUnidad;
  const { addOneItem, getItemsInCart, removeOneItem } = useCartContext();
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

  const addItemToCart = () => {
    addOneItem(new ShoppingCartItem(id, 1, precio, productName));
  };

  const removeItemFromCart = () => {
    removeOneItem(id);
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
          ) : itemsInCart > 0 ? (
            <div className={styles.quantityControl}>
              <button
                type='button'
                aria-label={`Disminuir cantidad de ${productName}`}
                onClick={removeItemFromCart}
              >
                <Minus aria-hidden='true' size={20} strokeWidth={2.2} />
              </button>
              <output
                role='status'
                aria-label={`Cantidad de ${productName} en el carrito`}
                aria-live='polite'
              >
                {itemsInCart}
              </output>
              <button
                type='button'
                aria-label={`Aumentar cantidad de ${productName}`}
                onClick={addItemToCart}
              >
                <Plus aria-hidden='true' size={20} strokeWidth={2.2} />
              </button>
            </div>
          ) : (
            <button
              type='button'
              className={styles.addButton}
              aria-label={`Agregar ${productName} al carrito`}
              onClick={addItemToCart}
            >
              <Plus aria-hidden='true' size={20} strokeWidth={2.2} />
              <span>Agregar al carrito</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default CatalogItem;
