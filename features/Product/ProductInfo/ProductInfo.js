import Link from 'next/link';
import { Box } from '@mui/material';
import Image from 'next/image';
import Slider from 'react-slick';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// local imports
// styles
import styles from './ProductInfo.module.scss';
import QuickAdd from '../../../components/QuickAdd';

// components
import PresentationSelector from '../../../components/PresentationSelector'; // Components

const sliderSettings = {
  dots: true, // Shows dot indicators at the bottom
  infinite: true, // Infinite looping
  speed: 500, // Animation speed
  slidesToShow: 1, // Number of slides to show at a time
  slidesToScroll: 1, // Number of slides to scroll
  initialSlide: 0, // Initial slide index
  swipeToSlide: true, // Allows slides to be dragged
  adaptiveHeight: true, // Adjusts height to the current slide
  arrows: true, // Enables navigation arrows
};

const ProductInfo = ({
  productDetail,
  hasPriceByUnit,
  selectedPresentation,
  handlePresentationSelect,
  onAddToCart,
  onRemoveOneItem,
  cartTotalItems,
  itemsInCart,
}) => (
  <>
    <div className={styles.productInfo}>
      <div className={styles.images}>
        <Slider {...sliderSettings}>
          {productDetail.images?.map((img, i) => (
            <div key={i}>
              <Image
                src={img.url}
                alt={img.title}
                width='100%'
                height='100%'
                layout='responsive'
                objectFit='contain'
              />
            </div>
          ))}
        </Slider>
      </div>
      <div className={styles.info}>
        <div>
          <h1>{productDetail.productName}</h1>
          {hasPriceByUnit ? (
            <p className={styles.price}>
              ₡{selectedPresentation ? selectedPresentation.price : ''}{' '}
              {selectedPresentation && (
                <span className={styles.small}>
                  {' '}
                  | {selectedPresentation.size}
                </span>
              )}
            </p>
          ) : (
            <p className={styles.price}>
              ₡{productDetail.precio}{' '}
              <span className={styles.small}>| {productDetail.medida}</span>
            </p>
          )}
        </div>
        {hasPriceByUnit && (
          <Box my={4} width='100%'>
            <PresentationSelector
              presentations={productDetail.preciosPorUnidad}
              selectedPresentation={selectedPresentation}
              onPresentationSelect={handlePresentationSelect}
            />
          </Box>
        )}
        <Box display='flex' flexDirection='column' alignItems={['center', 'flex-end']}>
          <Box pt={2} mb={4} sx={{ transform: 'scale(1.25)' }}>
            <QuickAdd
              itemsInCart={itemsInCart}
              removeOneItemFromCart={() =>
                onRemoveOneItem(productDetail.sys.id)
              }
              addItemToCart={onAddToCart}
            />
          </Box>

          {cartTotalItems > 0 && (
            <Link href={'/cart'} passHref>
              <a>
                Ver Carrito
                <FontAwesomeIcon icon={faCartShopping} />
                <span>({cartTotalItems})</span>
              </a>
            </Link>
          )}
        </Box>
      </div>
    </div>
  </>
);

export default ProductInfo;
