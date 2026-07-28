import Link from 'next/link';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Leaf,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useState } from 'react';

import ContentfulImage from '../../../../components/ContentfulImage';
import CurrencyText from '../../../../components/Currency';
import PresentationSelector from '../../PresentationSelector';
import styles from './ProductInfo.module.scss';

const ProductInfo = ({
  productDetail,
  hasPriceByUnit,
  selectedPresentation,
  handlePresentationSelect,
  onAddToCart,
  onRemoveOneItem,
  cartTotalItems,
  itemsInCart,
}) => {
  const images = productDetail.images || [];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const selectedImage = images[selectedImageIndex] || images[0] || null;
  const hasMultipleImages = images.length > 1;

  const selectPreviousImage = () => {
    setSelectedImageIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1
    );
  };

  const selectNextImage = () => {
    setSelectedImageIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1
    );
  };

  return (
    <div className={styles.productInfo}>
      <div
        className={`${styles.gallery} ${
          hasMultipleImages ? '' : styles.singleImageGallery
        }`}
      >
        {hasMultipleImages && (
          <div
            className={styles.thumbnails}
            aria-label={`Imágenes de ${productDetail.productName}`}
          >
            {images.map((image, index) => (
              <button
                type='button'
                className={styles.thumbnail}
                aria-current={index === selectedImageIndex ? 'true' : undefined}
                aria-label={`Ver imagen ${index + 1} de ${images.length}: ${
                  image.title || productDetail.productName
                }`}
                onClick={() => setSelectedImageIndex(index)}
                key={image.url || index}
              >
                <ContentfulImage
                  src={image.url}
                  alt=''
                  width={96}
                  height={96}
                  sizes='72px'
                />
              </button>
            ))}
          </div>
        )}

        <div className={styles.imageStage}>
          {selectedImage && (
            <ContentfulImage
              src={selectedImage.url}
              alt={selectedImage.title || productDetail.productName}
              width={900}
              height={900}
              loading='eager'
              sizes='(min-width: 1280px) 650px, (min-width: 1024px) 52vw, 100vw'
              className={styles.productImage}
            />
          )}

          {hasMultipleImages && (
            <>
              <button
                type='button'
                className={`${styles.galleryArrow} ${styles.previousImage}`}
                aria-label='Ver imagen anterior'
                onClick={selectPreviousImage}
              >
                <ChevronLeft aria-hidden='true' size={28} strokeWidth={2} />
              </button>
              <button
                type='button'
                className={`${styles.galleryArrow} ${styles.nextImage}`}
                aria-label='Ver imagen siguiente'
                onClick={selectNextImage}
              >
                <ChevronRight aria-hidden='true' size={28} strokeWidth={2} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>
            {productDetail.category || 'Producto DNAture'}
          </p>
          <h1>{productDetail.productName}</h1>
          {productDetail.avifySku && (
            <p className={styles.sku}>SKU: {productDetail.avifySku}</p>
          )}

          {hasPriceByUnit ? (
            <p className={styles.price}>
              {selectedPresentation ? (
                <CurrencyText value={selectedPresentation.price} />
              ) : null}
              {selectedPresentation && (
                <span className={styles.small}>
                  {selectedPresentation.size}
                </span>
              )}
            </p>
          ) : (
            <p className={styles.price}>
              <CurrencyText value={productDetail.precio} />
              {productDetail.medida && (
                <span className={styles.small}>{productDetail.medida}</span>
              )}
            </p>
          )}
        </div>

        <ul className={styles.productPromises} aria-label='Calidad DNAture'>
          <li>
            <Leaf aria-hidden='true' size={24} strokeWidth={1.8} />
            <span>Ingredientes naturales</span>
          </li>
          <li>
            <Heart aria-hidden='true' size={24} strokeWidth={1.8} />
            <span>Hecho con amor</span>
          </li>
          <li>
            <ShieldCheck aria-hidden='true' size={24} strokeWidth={1.8} />
            <span>Compra segura</span>
          </li>
        </ul>

        {hasPriceByUnit && (
          <div className={styles.presentation}>
            <PresentationSelector
              presentations={productDetail.preciosPorUnidad}
              selectedPresentation={selectedPresentation}
              onPresentationSelect={handlePresentationSelect}
            />
          </div>
        )}

        <div className={styles.purchase}>
          {itemsInCart > 0 ? (
            <div className={styles.quantityControl}>
              <button
                type='button'
                aria-label={`Disminuir cantidad de ${productDetail.productName}`}
                onClick={onRemoveOneItem}
              >
                <Minus aria-hidden='true' size={22} strokeWidth={2.2} />
              </button>
              <output
                role='status'
                aria-label={`Cantidad de ${productDetail.productName} en el carrito`}
                aria-live='polite'
              >
                {itemsInCart}
              </output>
              <button
                type='button'
                aria-label={`Aumentar cantidad de ${productDetail.productName}`}
                onClick={onAddToCart}
              >
                <Plus aria-hidden='true' size={22} strokeWidth={2.2} />
              </button>
            </div>
          ) : (
            <button
              type='button'
              className={styles.addButton}
              aria-label={`Agregar ${productDetail.productName} al carrito`}
              onClick={onAddToCart}
            >
              <ShoppingBag aria-hidden='true' size={20} strokeWidth={1.9} />
              <span>Agregar al carrito</span>
            </button>
          )}

          {cartTotalItems > 0 && (
            <Link className={styles.cartLink} href='/cart'>
              <ShoppingBag aria-hidden='true' size={19} strokeWidth={1.9} />
              <span>Ver carrito ({cartTotalItems})</span>
              <ArrowRight aria-hidden='true' size={18} strokeWidth={1.9} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
