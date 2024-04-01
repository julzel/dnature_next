import Link from 'next/link';
import { Box } from '@mui/material';
import Image from 'next/image';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PresentationSelector from '../../../components/PresentationSelector'; // Components

// local imports
// styles
import styles from './ProductInfo.module.scss';
import QuickAdd from '../../../components/QuickAdd';

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
        {productDetail.images?.map((img, i) => (
          <Image
            key={i}
            src={img.url}
            alt={img.title}
            width='100%'
            height='100%'
            layout='responsive'
            objectFit='contain'
          />
        ))}
      </div>
      <div className={styles.info}>
        <div>
          <h1>{productDetail.productName}</h1>
          {hasPriceByUnit ? (
            <p className={styles.price}>
              ₡{selectedPresentation ? selectedPresentation.price : ''}{' '}
              {selectedPresentation && (
                <span className={styles.small}> | {selectedPresentation.size}</span>
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
        <Box
          pt={2}
          pb={4}
          mb={2}
          display='flex'
          justifyContent='center'
          sx={{ transform: 'scale(1.25)' }}
        >
          <QuickAdd
            itemsInCart={itemsInCart}
            removeOneItemFromCart={() => onRemoveOneItem(productDetail.sys.id)}
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
      </div>
    </div>
  </>
);

export default ProductInfo;
