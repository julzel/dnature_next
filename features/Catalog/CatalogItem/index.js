// Import statements
import Image from 'next/image';
import Link from 'next/link';
import {
  ShoppingCartItem,
  useCartContext,
} from '../../Cart/state'; // Feature API
import styles from './CatalogItem.module.scss'; // Styles
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
  } = product;
  const hasPriceByUnit = !!preciosPorUnidad;
  const { addOneItem, getItemsInCart } = useCartContext();
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
    const newItem = new ShoppingCartItem(id, 1, precio, productName, null);
    addOneItem(newItem);
  };

  const itemsInCart = getItemsInCart(id);

  const productPath = getProductPath(urlSlug);

  if (!productPath) {
    return null;
  }

  return (
    <article className={styles.catalogItem}>
      <Link href={productPath} className={styles.imageLink} aria-label={`Ver ${productName}`}>
        {itemImage && (
          <span className={styles.catalogItemImages}>
            <Image
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
        <p className={styles.price}>
          {hasPriceByUnit && lowestPresentationPrice !== null ? 'Desde ' : ''}
          <CurrencyText value={displayPrice} />
        </p>
        <p className={styles.presentation}>
          {hasPriceByUnit ? 'Elige una presentación' : medida || 'Presentación disponible'}
        </p>
        <div className={styles.cardFooter}>
          {hasPriceByUnit ? (
            <Link href={productPath} className={styles.optionsLink}>
              Ver opciones
            </Link>
          ) : (
            <button type='button' className={styles.addButton} onClick={addItemToCart}>
              Agregar
            </button>
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
