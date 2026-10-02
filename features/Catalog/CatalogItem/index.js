// Import statements
import Link from 'next/link';
import { Minus, Plus } from "../../../components/Icon";
import {
  ShoppingCartItem,
  useCartContext,
} from '../../Cart/state'; // Feature API

import ContentfulImage from '../../../components/ContentfulImage';
import CurrencyText from '../../../components/Currency';
import { getAvailabilityUi } from '../lib/avify-commerce';
import { getProductPath } from '../lib/product-url';

const CatalogItem = ({ product, imageLoading = 'lazy' }) => {
  const {
    sys: { id },
    images,
    preciosPorUnidad,
    precio,
    productName,
    urlSlug,
    medida,
    category,
    avifySku,
    commerce,
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
  const availability = commerce?.availability || 'unknown';
  const availabilityUi = getAvailabilityUi({
    availability,
    availableQuantity: commerce?.availableQuantity,
    onDemand: commerce?.onDemand,
  });
  const canAddToCart = !commerce || availabilityUi.canPurchase;

  const addItemToCart = () => {
    if (!canAddToCart) return;

    const item = new ShoppingCartItem(
      id,
      1,
      precio,
      productName,
      itemImage?.url,
      medida,
      avifySku,
      id
    );

    if (commerce?.mapped) {
      item.parentSku = commerce.parentSku;
      item.avifyProductId = commerce.productId;
    }

    addOneItem(item);
  };

  const removeItemFromCart = () => {
    removeOneItem(id);
  };

  const itemsInCart = getItemsInCart(id);
  const canIncreaseQuantity =
    canAddToCart &&
    (!Number.isFinite(commerce?.availableQuantity) ||
      itemsInCart < commerce.availableQuantity);

  const productPath = getProductPath(urlSlug);

  if (!productPath) {
    return null;
  }

  return (
    <article className='product-card'>
      <Link className='product-card-stage'
        href={productPath}
        aria-label={`Ver ${productName}`}
      >
        {itemImage && (
          <span>
            <ContentfulImage
              src={itemImage.url}
              alt={itemImage.title}
              width={100}
              height={100}
              loading={imageLoading}
              sizes='(min-width: 1024px) 25vw, (min-width: 600px) 50vw, 100vw'
            />
          </span>
        )}
      </Link>
      <div className='product-card-info'>
        <p>{category}</p>
        <Link className='product-card-title' href={productPath}>
          {productName}
        </Link>
        <p>
          {hasPriceByUnit && lowestPresentationPrice !== null ? 'Desde ' : ''}
          <CurrencyText value={displayPrice} />
        </p>
        <p>
          {hasPriceByUnit
            ? 'Elegí una presentación'
            : medida || 'Presentación disponible'}
        </p>
        {commerce && availabilityUi.copy && (
          <p
            role={!availabilityUi.canPurchase ? 'status' : undefined}
          >
            <span aria-hidden='true' />
            {availabilityUi.copy}
          </p>
        )}
        <div className='product-card-action'>
          {hasPriceByUnit ? (
            <Link href={productPath}>
              Ver opciones
            </Link>
          ) : itemsInCart > 0 ? (
            <div>
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
                aria-label={
                  canIncreaseQuantity
                    ? `Aumentar cantidad de ${productName}`
                    : `Existencia máxima agregada de ${productName}`
                }
                onClick={addItemToCart}
                disabled={!canIncreaseQuantity}
              >
                <Plus aria-hidden='true' size={20} strokeWidth={2.2} />
              </button>
            </div>
          ) : (
            <button
              type='button'
              aria-label={
                canAddToCart
                  ? `Agregar ${productName} al carrito`
                  : `${availabilityUi.disabledActionCopy}: ${productName}`
              }
              onClick={addItemToCart}
              disabled={!canAddToCart}
            >
              {canAddToCart && (
                <Plus aria-hidden='true' size={20} strokeWidth={2.2} />
              )}
              <span>
                {canAddToCart
                  ? 'Agregar al carrito'
                  : availabilityUi.disabledActionCopy}
              </span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default CatalogItem;
