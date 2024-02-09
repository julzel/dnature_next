import Link from 'next/link';
import { Box } from '@mui/material';
import Image from 'next/image';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// local imports
// styles
import styles from './ProductInfo.module.scss';
import counterStyles from './Counter.module.scss';
import addToCartStyles from './AddToCart.module.scss';
import presentationStyles from './PresentationSelect.module.scss';

// components
import Button from '../../../components/Button';
import CounterInput from '../../../components/CounterInput';
import CustomSelect from '../../../components/CustomSelect';

// consts
// import { RECETAS_COMPLETAS } from "../consts";
import CurrencyText from '../../../components/Currency';
import QuickAdd from '../../../components/QuickAdd';

const ProductInfo = ({
  productDetail,
  quantity,
  onQuantityChange,
  presentation,
  onPresentationChange,
  presentationOptions,
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
          <p className={styles.price}>
            ₡{productDetail.precio}{' '}
            <span className={styles.small}>| {productDetail.medida}</span>
          </p>
        </div>
        <Box p={4} mb={2} display='flex' justifyContent='center' sx={{ transform: 'scale(1.25)'}}>
          <QuickAdd
            itemsInCart={itemsInCart}
            removeOneItemFromCart={() => onRemoveOneItem(productDetail.sys.id)}
            addItemToCart={onAddToCart}
          />
        </Box>
        {false && (
          <div className={styles.presentation}>
            <label htmlFor='presentation'>Presentación *</label>
            <CustomSelect
              options={presentationOptions}
              selectedOption={presentation}
              onSelect={onPresentationChange}
              classes={{ select: presentationStyles.select }}
            />
            <p></p>
            {/* TODO: add dynamic selector: quantiy by type */}
          </div>
        )}
        {/* <Button
          text={"Agregar al carrito"}
          onClick={() => onAddToCart(productDetail, quantity, presentation)}
          className={addToCartStyles.addToCart}
        /> */}
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
    {false && (
      <div className={styles.presentationNote}>
        <p>* Precio por unidad: </p>
        <p>
          1kg = <CurrencyText value={3500} /> | 500g ={' '}
          <CurrencyText value={1750} /> | 200g = <CurrencyText value={800} />
        </p>
      </div>
    )}
  </>
);

export default ProductInfo;
