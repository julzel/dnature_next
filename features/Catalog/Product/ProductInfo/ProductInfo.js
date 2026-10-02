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
} from "../../../../components/Icon";
import { useState } from 'react';

import ContentfulImage from '../../../../components/ContentfulImage';
import CurrencyText from '../../../../components/Currency';
import PresentationSelector from '../../PresentationSelector';

const ProductInfo = ({
  productDetail,
  hasPriceByUnit,
  selectedPresentation,
  handlePresentationSelect,
  onAddToCart,
  onRemoveOneItem,
  cartTotalItems,
  itemsInCart,
  availabilityUi,
  canAddToCart,
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
    <div className='product-layout'>
      <div className='product-gallery'>
        {hasMultipleImages && (
          <div
            aria-label={`Imágenes de ${productDetail.productName}`}
          >
            {images.map((image, index) => (
              <button
                type='button'
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

        <div className='product-stage'>
          {selectedImage && (
            <ContentfulImage
              src={selectedImage.url}
              alt={selectedImage.title || productDetail.productName}
              width={900}
              height={900}
              loading='eager'
              sizes='(min-width: 1280px) 650px, (min-width: 1024px) 52vw, 100vw'
            />
          )}

          {hasMultipleImages && (
            <>
              <button
                type='button'
                aria-label='Ver imagen anterior'
                onClick={selectPreviousImage}
              >
                <ChevronLeft aria-hidden='true' size={28} strokeWidth={2} />
              </button>
              <button
                type='button'
                aria-label='Ver imagen siguiente'
                onClick={selectNextImage}
              >
                <ChevronRight aria-hidden='true' size={28} strokeWidth={2} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className='product-information'>
        <div>
          <p className='eyebrow'>
            {productDetail.category || 'Producto DNAture'}
          </p>
          <h1>{productDetail.productName}</h1>
          {productDetail.avifySku && (
            <p className='product-sku'>SKU: {productDetail.avifySku}</p>
          )}

          {hasPriceByUnit ? (
            <p className='product-price'>
              {selectedPresentation ? (
                <CurrencyText value={selectedPresentation.price} />
              ) : null}
              {selectedPresentation && (
                <span className='product-measure'>
                  {selectedPresentation.size}
                </span>
              )}
            </p>
          ) : (
            <p className='product-price'>
              <CurrencyText value={productDetail.precio} />
              {productDetail.medida && (
                <span className='product-measure'>{productDetail.medida}</span>
              )}
            </p>
          )}
        </div>

        <ul aria-label='Calidad DNAture'>
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
            <span>Compra acompañada</span>
          </li>
        </ul>

        {hasPriceByUnit && (
          <div>
            <PresentationSelector
              presentations={productDetail.preciosPorUnidad}
              selectedPresentation={selectedPresentation}
              onPresentationSelect={handlePresentationSelect}
              presentationCommerce={productDetail.commerce?.presentations}
            />
          </div>
        )}

        {productDetail.commerce && availabilityUi.copy && (
          <p
            role={!availabilityUi.canPurchase ? 'status' : undefined}
          >
            <span aria-hidden='true' />
            {availabilityUi.copy}
          </p>
        )}

        <div className='product-actions'>
          {itemsInCart > 0 ? (
            <div>
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
                aria-label={
                  canAddToCart
                    ? `Aumentar cantidad de ${productDetail.productName}`
                    : `Existencia máxima agregada de ${productDetail.productName}`
                }
                onClick={onAddToCart}
                disabled={!canAddToCart}
              >
                <Plus aria-hidden='true' size={22} strokeWidth={2.2} />
              </button>
            </div>
          ) : (
            <button
              type='button'
              aria-label={
                canAddToCart
                  ? `Agregar ${productDetail.productName} al carrito`
                  : `${availabilityUi.disabledActionCopy}: ${productDetail.productName}`
              }
              onClick={onAddToCart}
              disabled={!canAddToCart}
            >
              {canAddToCart && (
                <ShoppingBag aria-hidden='true' size={20} strokeWidth={1.9} />
              )}
              <span>
                {canAddToCart
                  ? 'Agregar al carrito'
                  : availabilityUi.disabledActionCopy}
              </span>
            </button>
          )}

          {cartTotalItems > 0 && (
            <Link href='/checkout'>
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
