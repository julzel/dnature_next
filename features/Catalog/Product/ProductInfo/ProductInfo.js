import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Slider from 'react-slick';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import styles from './ProductInfo.module.scss';
import CurrencyText from '../../../../components/Currency';
import PresentationSelector from '../../PresentationSelector';

const ProductInfo = ({
  productDetail,
  hasPriceByUnit,
  selectedPresentation,
  handlePresentationSelect,
  onAddToCart,
  cartTotalItems,
  itemsInCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const images = productDetail.images || [];
  const isUnavailable = productDetail.availability === 'unavailable';
  const displayedPrice = hasPriceByUnit
    ? selectedPresentation?.price
    : productDetail.precio;
  const displayedMeasure = hasPriceByUnit
    ? selectedPresentation?.size
    : productDetail.medida;
  const sliderSettings = {
    adaptiveHeight: false,
    arrows: images.length > 1,
    dots: images.length > 1,
    infinite: images.length > 1,
    slidesToScroll: 1,
    slidesToShow: 1,
    speed: 320,
    swipeToSlide: true,
  };

  const addToCart = () => onAddToCart(quantity);

  return (
    <div className={styles.productInfo}>
      <div className={styles.gallery}>
        {images.length ? (
          <Slider {...sliderSettings}>
            {images.map((image, index) => (
              <div key={`${image.url}-${index}`} className={styles.slide}>
                <Image
                  src={image.url}
                  alt={image.title || productDetail.productName}
                  width={900}
                  height={675}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  sizes='(min-width: 1024px) 52vw, 100vw'
                />
              </div>
            ))}
          </Slider>
        ) : (
          <div className={styles.imageFallback} role='img' aria-label='Imagen no disponible'>
            <span>DN</span>
            <p>Imagen próximamente</p>
          </div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.infoHeader}>
          {productDetail.category && (
            <p className={styles.category}>{productDetail.category}</p>
          )}
          <h1>{productDetail.productName}</h1>
          <p className={styles.price}>
            <CurrencyText value={displayedPrice} />
            {displayedMeasure && <span>/ {displayedMeasure}</span>}
          </p>
        </div>

        {hasPriceByUnit && (
          <div className={styles.presentation}>
            <PresentationSelector
              presentations={productDetail.preciosPorUnidad}
              selectedPresentation={selectedPresentation}
              onPresentationSelect={handlePresentationSelect}
            />
          </div>
        )}

        <div className={styles.quantity}>
          <span id='quantity-label'>Cantidad</span>
          <div role='group' aria-labelledby='quantity-label'>
            <button
              type='button'
              aria-label='Reducir cantidad'
              disabled={quantity === 1}
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            >
              <FontAwesomeIcon icon={faMinus} />
            </button>
            <output aria-live='polite'>{quantity}</output>
            <button
              type='button'
              aria-label='Aumentar cantidad'
              onClick={() => setQuantity((current) => current + 1)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        </div>

        {isUnavailable ? (
          <p className={styles.unavailable}>Temporalmente agotado</p>
        ) : (
          <>
            <div className={styles.desktopPurchase}>
              <button type='button' className={styles.addButton} onClick={addToCart}>
                Agregar al carrito
              </button>
              {itemsInCart > 0 && <p>{itemsInCart} en tu carrito</p>}
              {cartTotalItems > 0 && (
                <Link href='/cart'>Ver carrito ({cartTotalItems})</Link>
              )}
            </div>
            <div className={styles.mobilePurchase}>
              <p>
                <CurrencyText value={displayedPrice} />
                {displayedMeasure && <span>/ {displayedMeasure}</span>}
              </p>
              <button type='button' onClick={addToCart}>
                Agregar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
